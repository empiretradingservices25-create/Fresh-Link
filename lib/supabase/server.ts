// Server-side Supabase client — uses supabase-js directly (no @supabase/ssr needed)
import { createClient as _create } from "@supabase/supabase-js"

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nxirypguonnrusegpmke.supabase.co"
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54aXJ5cGd1b25ucnVzZWdwbWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NDQ3OTcsImV4cCI6MjA5MTEyMDc5N30.zrYG0ZnXFgNoV4vRbqjTEn54MCkAie6NSgTKKufRKA4"

export async function createClient() {
  return _create(URL, KEY)
}
