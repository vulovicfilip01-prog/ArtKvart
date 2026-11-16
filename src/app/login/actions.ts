'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { ensureProfileExists } from '@/utils/supabase/ensureProfile'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message?.toLowerCase().includes('email not confirmed')) {
      redirect(
        '/login?message=' +
          encodeURIComponent(
            'Email adresa nije potvrđena. Kliknite na link u emailu koji vam je stigao ili u Supabase Dashboard-u (Authentication -> Providers -> Email) isključite opciju "Confirm email".'
          )
      )
    }
    redirect('/login?message=' + encodeURIComponent('Greška pri prijavi: ' + error.message))
  }

  if (data.user) {
    await ensureProfileExists(supabase, data.user)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') || 'https://artkvart.vercel.app'
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop'
      }
    }
  })

  if (error) {
    console.error('Greška pri registraciji u bazi:', error)
    redirect('/login?mode=signup&message=' + encodeURIComponent('Greška pri registraciji: ' + error.message))
  }

  if (data.user) {
    await ensureProfileExists(supabase, data.user)
  }

  revalidatePath('/', 'layout')
  if (data.session) {
    redirect('/')
  }
  redirect('/login?message=' + encodeURIComponent('Proverite Vaš email da potvrdite registraciju (ili se samo prijavite ako ste isključili potvrdu).'))
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
