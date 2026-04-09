import { NextRequest, NextResponse } from "next/server"

// -─ Types ----------------------------------

interface ContentPart {
  type: "text" | "image_url"
  text?: string
  image_url?: { url: string }
}

/** Client-supplied conversation messages (user/assistant only — system is injected server-side). */
interface ClientMessage {
  role: "user" | "assistant"
  content: string | ContentPart[]
}

/** Full message shape used when calling the external provider (includes system). */
interface ProviderMessage {
  role: "user" | "assistant" | "system"
  content: string | ContentPart[]
}

interface ChatRequestBody {
  agentId?: string
  systemPrompt: string
  messages: ClientMessage[]
  temperature?: number
  max_tokens?: number
  response_format?: "text" | "json"
}

// -─ Rate limiting (in-memory, per IP) -------------------─

const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = 20 // max requests per window per IP

interface RateEntry {
  count: number
  windowStart: number
}

const rateLimitMap = new Map<string, RateEntry>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now })
    // Lazy cleanup: remove stale entries to avoid unbounded growth
    if (rateLimitMap.size > 1000) {
      for (const [key, val] of rateLimitMap.entries()) {
        if (now - val.windowStart > RATE_LIMIT_WINDOW_MS * 2) {
          rateLimitMap.delete(key)
        }
      }
    }
    return true
  }
  if (entry.count >= RATE_LIMIT_MAX) return false
  entry.count += 1
  return true
}

// -─ Provider config (server-side only) -------------------

const AI_ENDPOINT =
  process.env.AI_ENDPOINT ?? "https://llm.blackbox.ai/chat/completions"

const AI_CUSTOMER_ID = process.env.AI_CUSTOMER_ID ?? ""
const AI_API_KEY = process.env.AI_API_KEY ?? ""

const DEFAULT_MODEL_CHAIN = [
  "openrouter/claude-sonnet-4",
  "openrouter/anthropic/claude-3.5-haiku",
  "openrouter/openai/gpt-4o-mini",
  "openrouter/google/gemini-flash-1.5",
]

function getModelChain(): string[] {
  const raw = process.env.AI_MODEL_CHAIN
  if (raw && raw.trim()) {
    const chain = raw.split(",").map(s => s.trim()).filter(Boolean)
    if (chain.length > 0) return chain
  }
  return DEFAULT_MODEL_CHAIN
}

// -─ LLM call with fallback chain ----------------------

async function callProvider(
  messages: ProviderMessage[],
  temperature: number,
  max_tokens: number,
  attempt = 0
): Promise<{ content: string; model: string }> {
  const modelChain = getModelChain()
  if (attempt >= modelChain.length) throw new Error("QUOTA_EXCEEDED")
  const model = modelChain[attempt]

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (AI_CUSTOMER_ID) headers["customerId"] = AI_CUSTOMER_ID
  if (AI_API_KEY) headers["Authorization"] = `Bearer ${AI_API_KEY}`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)
    const res = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({ model, messages, max_tokens, temperature }),
    })
    clearTimeout(timeout)

    if (res.status === 429 || res.status === 402 || res.status === 503) {
      await new Promise(r => setTimeout(r, 800 * (attempt + 1)))
      return callProvider(messages, temperature, max_tokens, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP_${res.status}`)

    const data = await res.json()
    const text: string = data?.choices?.[0]?.message?.content?.trim() ?? ""
    if (!text || text.length < 2) throw new Error("EMPTY_RESPONSE")
    return { content: text, model }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ""
    if (msg === "QUOTA_EXCEEDED") throw e
    if (attempt < modelChain.length - 1) {
      await new Promise(r => setTimeout(r, 600))
      return callProvider(messages, temperature, max_tokens, attempt + 1)
    }
    throw new Error("QUOTA_EXCEEDED")
  }
}

// -─ Route handler ------------------------------

const MAX_HISTORY = 18

export async function POST(req: NextRequest) {
  // IP-based rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

  // Parse body
  let body: ChatRequestBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  // Validate required fields
  if (typeof body.systemPrompt !== "string" || body.systemPrompt.trim().length === 0) {
    return NextResponse.json({ error: "systemPrompt is required." }, { status: 400 })
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "messages array is required." }, { status: 400 })
  }

  // Validate each message
  for (const msg of body.messages) {
    if (!["user", "assistant"].includes(msg.role)) {
      return NextResponse.json(
        { error: "Each message role must be 'user' or 'assistant'." },
        { status: 400 }
      )
    }
    if (typeof msg.content !== "string" && !Array.isArray(msg.content)) {
      return NextResponse.json(
        { error: "Each message content must be a string or array." },
        { status: 400 }
      )
    }
  }

  const temperature = typeof body.temperature === "number" ? body.temperature : 0.72
  const max_tokens = typeof body.max_tokens === "number" ? body.max_tokens : 2048

  // Truncate history
  const truncated = body.messages.slice(-MAX_HISTORY)

  // Build messages for provider
  const providerMessages: ProviderMessage[] = [
    { role: "system", content: body.systemPrompt.trim() },
    ...truncated,
  ]

  try {
    const result = await callProvider(providerMessages, temperature, max_tokens)
    return NextResponse.json({ content: result.content, model: result.model })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error"
    if (msg === "QUOTA_EXCEEDED") {
      return NextResponse.json(
        { error: "All AI models are currently unavailable. Please try again later." },
        { status: 503 }
      )
    }
    return NextResponse.json({ error: "AI request failed." }, { status: 502 })
  }
}
