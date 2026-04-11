"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://nxirypguonnrusegpmke.supabase.co"

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54aXJ5cGd1b25ucnVzZWdwbWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NDQ3OTcsImV4cCI6MjA5MTEyMDc5N30.zrYG0ZnXFgNoV4vRbqjTEn54MCkAie6NSgTKKufRKA4"

// Singleton pour eviter la creation multiple de clients
let _client: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (!_client) {
    _client = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return _client
}
