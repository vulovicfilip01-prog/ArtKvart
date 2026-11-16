import { createBrowserClient } from '@supabase/ssr'

const DEFAULT_SUPABASE_URL = 'https://jwvelqfevwwfogcangzo.supabase.co'
const DEFAULT_SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3dmVscWZldnd3Zm9nY2FuZ3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMTIzNzMsImV4cCI6MjEwNjc4ODM3M30.Sfftnbw8nKHF4c9SU3-X0o9HimVLKM9z6zjCohGezF4'

export function createClient() {
  const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
    .replace(/^NEXT_PUBLIC_SUPABASE_URL=/, '')
    .trim()
  const url = rawUrl.startsWith('https://') ? rawUrl : DEFAULT_SUPABASE_URL

  const rawKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    .replace(/^NEXT_PUBLIC_SUPABASE_ANON_KEY=/, '')
    .trim()
  const anonKey = rawKey.startsWith('eyJ') ? rawKey : DEFAULT_SUPABASE_KEY

  return createBrowserClient(url, anonKey)
}
