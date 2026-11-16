'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/login?message=' + encodeURIComponent('Pogrešan email ili lozinka.'))
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
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

  revalidatePath('/', 'layout')
  redirect('/login?message=' + encodeURIComponent('Proverite Vaš email da potvrdite registraciju (ili se samo prijavite ako ste isključili potvrdu).'))
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
