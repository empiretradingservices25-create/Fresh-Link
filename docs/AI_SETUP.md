# AI Setup Guide

This document explains how to configure the AI/LLM integration in FreshLink Pro.

## Overview

All AI requests are routed through a single server-side API endpoint at `POST /api/ai/chat`.  
**API keys and secrets never reach the browser.**

## Environment Variables

Create a `.env.local` file at the root of the project (never commit this file).  
Copy `.env.example` as a starting point:

```bash
cp .env.example .env.local
```

Then fill in the following variables:

| Variable | Required | Description |
|---|---|---|
| `AI_ENDPOINT` | No | Override the LLM base URL. Defaults to `https://llm.blackbox.ai/chat/completions` |
| `AI_CUSTOMER_ID` | If provider needs it | Sent as the `customerId` request header |
| `AI_API_KEY` | Yes | Sent as `Authorization: Bearer <key>`. **Keep this secret.** |
| `AI_MODEL_CHAIN` | No | Comma-separated list of model names to try in order (fallback chain) |

### Default model fallback chain

If `AI_MODEL_CHAIN` is not set, the following models are tried in order:

1. `openrouter/claude-sonnet-4`
2. `openrouter/anthropic/claude-3.5-haiku`
3. `openrouter/openai/gpt-4o-mini`
4. `openrouter/google/gemini-flash-1.5`

On HTTP 429 / 402 / 503 responses the server automatically falls back to the next model.

## Important security rules

- **Never** prefix AI variables with `NEXT_PUBLIC_` — this would expose them to the browser bundle.
- **Never** commit `.env.local` or any file containing real API keys.
- The `.gitignore` already excludes `.env.local`.

## Example `.env.local`

```env
AI_ENDPOINT=https://llm.blackbox.ai/chat/completions
AI_CUSTOMER_ID=cus_your_customer_id
AI_API_KEY=sk-your-secret-api-key
AI_MODEL_CHAIN=openrouter/claude-sonnet-4,openrouter/anthropic/claude-3.5-haiku,openrouter/openai/gpt-4o-mini,openrouter/google/gemini-flash-1.5
```

## Rate limiting

The `/api/ai/chat` endpoint applies in-memory rate limiting per client IP:

- **20 requests per minute** per IP address.
- Returns HTTP 429 if the limit is exceeded.

This is a basic safeguard. For production deployments consider using an edge-level rate limiter (e.g., Vercel Edge Middleware or a dedicated WAF).

## API reference

### `POST /api/ai/chat`

**Request body:**

```json
{
  "agentId": "jawad",
  "systemPrompt": "You are a helpful assistant.",
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "temperature": 0.72,
  "max_tokens": 2048,
  "response_format": "text"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `agentId` | string | No | Identifier for the calling agent (informational) |
| `systemPrompt` | string | Yes | System instruction sent as the first message |
| `messages` | array | Yes | Conversation history. Each item has `role` (`user`\|`assistant`) and `content` (string or multimodal array). Last 18 messages are kept. |
| `temperature` | number | No | Sampling temperature (default: 0.72) |
| `max_tokens` | number | No | Maximum tokens in the response (default: 2048) |
| `response_format` | string | No | `"text"` or `"json"` (informational, not enforced server-side) |

**Success response (200):**

```json
{
  "content": "The assistant's reply text.",
  "model": "openrouter/claude-sonnet-4"
}
```

**Error responses:**

| Status | Meaning |
|---|---|
| 400 | Invalid request body |
| 429 | Rate limit exceeded |
| 502 | AI provider returned an error |
| 503 | All models in the fallback chain exhausted |
