import { NextRequest, NextResponse } from "next/server"

// ─── Rate limiting (in-memory, best-effort) ───────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 60_000   // 1 minute
const RATE_LIMIT_MAX = 30             // requests per window per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT_MAX) return false
  entry.count++
  return true
}

// ─── Model chain ──────────────────────────────────────────────────────────────
const MODEL_CHAIN = [
  "openrouter/claude-sonnet-4",
  "openrouter/anthropic/claude-3.5-haiku",
  "openrouter/openai/gpt-4o-mini",
  "openrouter/google/gemini-flash-1.5",
]

const MAX_MESSAGES = 18

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: unknown
}

async function callUpstream(
  model: string,
  messages: ChatMessage[],
  temperature: number,
  max_tokens: number,
  signal: AbortSignal
): Promise<Response> {
  const endpoint = "https://llm.blackbox.ai/chat/completions"
  const customerId = process.env.BLACKBOX_CUSTOMER_ID ?? ""
  const apiKey = process.env.BLACKBOX_API_KEY ?? ""

  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "customerId": customerId,
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, temperature, max_tokens }),
    signal,
  })
}

export async function POST(req: NextRequest) {
  // ─── Rate limit ─────────────────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Veuillez patienter une minute." },
      { status: 429 }
    )
  }

  // ─── Parse & validate body ───────────────────────────────────────────────────
  let body: {
    agentId?: string
    messages?: unknown
    systemPrompt?: string
    model?: string
    temperature?: number
    max_tokens?: number
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 })
  }

  const { agentId, messages, systemPrompt, model, temperature, max_tokens } = body

  if (!agentId || typeof agentId !== "string") {
    return NextResponse.json({ error: "Champ 'agentId' requis." }, { status: 400 })
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Champ 'messages' requis (tableau non vide)." }, { status: 400 })
  }

  // Validate message structure
  const validMessages = (messages as unknown[]).every(
    (m) =>
      m !== null &&
      typeof m === "object" &&
      "role" in (m as object) &&
      "content" in (m as object) &&
      ["user", "assistant", "system"].includes((m as { role: string }).role)
  )
  if (!validMessages) {
    return NextResponse.json(
      { error: "Messages invalides : chaque message doit avoir 'role' et 'content'." },
      { status: 400 }
    )
  }

  // ─── Build messages array (cap at MAX_MESSAGES) ─────────────────────────────
  // Filter out any system messages from the client to avoid duplicates
  const clientMessages = (messages as ChatMessage[]).filter(m => m.role !== "system")
  const windowedMessages: ChatMessage[] = clientMessages.slice(-MAX_MESSAGES)

  // Prepend system prompt if provided
  const fullMessages: ChatMessage[] = systemPrompt
    ? [{ role: "system", content: systemPrompt }, ...windowedMessages]
    : windowedMessages

  // ─── Call upstream with model chain retry ────────────────────────────────────
  const chosenTemperature = typeof temperature === "number" ? temperature : 0.72
  const chosenMaxTokens = typeof max_tokens === "number" ? max_tokens : 2048
  const modelChain = model ? [model, ...MODEL_CHAIN.filter(m => m !== model)] : MODEL_CHAIN

  let lastError = ""
  for (let attempt = 0; attempt < modelChain.length; attempt++) {
    const currentModel = modelChain[attempt]
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30_000)

      let upstreamRes: Response
      try {
        upstreamRes = await callUpstream(
          currentModel,
          fullMessages,
          chosenTemperature,
          chosenMaxTokens,
          controller.signal
        )
      } finally {
        clearTimeout(timeout)
      }

      // Map upstream error codes
      if (upstreamRes.status === 429 || upstreamRes.status === 402 || upstreamRes.status === 503) {
        lastError = `upstream_${upstreamRes.status}`
        if (attempt < modelChain.length - 1) {
          await new Promise(r => setTimeout(r, 800 * (attempt + 1)))
          continue
        }
        return NextResponse.json(
          { error: "Service IA temporairement indisponible. Réessayez dans quelques instants." },
          { status: 429 }
        )
      }

      if (!upstreamRes.ok) {
        lastError = `HTTP_${upstreamRes.status}`
        if (attempt < modelChain.length - 1) {
          await new Promise(r => setTimeout(r, 600))
          continue
        }
        break
      }

      const data = await upstreamRes.json()
      const content: string = data?.choices?.[0]?.message?.content?.trim() ?? ""
      if (!content || content.length < 2) {
        lastError = "EMPTY_RESPONSE"
        if (attempt < modelChain.length - 1) continue
        break
      }

      return NextResponse.json({ content })
    } catch (e: unknown) {
      lastError = e instanceof Error ? e.message : "UNKNOWN"
      if (attempt < modelChain.length - 1) {
        await new Promise(r => setTimeout(r, 600))
        continue
      }
    }
  }

  console.error(`[api/ai/chat] All models failed. agentId=${agentId} lastError=${lastError}`)
  return NextResponse.json(
    { error: "Tous les modèles IA sont indisponibles. Réessayez plus tard." },
    { status: 503 }
  )
}
