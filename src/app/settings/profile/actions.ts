'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let finalAvatarUrl = (formData.get('avatarUrl') as string) || ''
  let finalCoverUrl = (formData.get('coverUrl') as string) || ''

  const avatarFile = formData.get('avatarFile') as File | null
  const coverFile = formData.get('coverFile') as File | null

  // Ako je korisnik izabrao fajl za Avatar sa računara, otpremamo ga u "radovi" bucket
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop()
    const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('radovi')
      .upload(fileName, avatarFile)

    if (uploadError) {
      console.error('Greška pri uploadu avatara:', uploadError)
    } else {
      const { data: { publicUrl } } = supabase.storage.from('radovi').getPublicUrl(fileName)
      finalAvatarUrl = publicUrl
    }
  }

  // Ako je korisnik izabrao fajl za Cover sa računara, otpremamo ga u "radovi" bucket
  if (coverFile && coverFile.size > 0) {
    const fileExt = coverFile.name.split('.').pop()
    const fileName = `cover-${user.id}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('radovi')
      .upload(fileName, coverFile)

    if (uploadError) {
      console.error('Greška pri uploadu cover slike:', uploadError)
    } else {
      const { data: { publicUrl } } = supabase.storage.from('radovi').getPublicUrl(fileName)
      finalCoverUrl = publicUrl
    }
  }

  const rawInstagram = ((formData.get('instagramUrl') as string) || '').trim()
  const instagramUrl = rawInstagram
    ? rawInstagram.startsWith('http')
      ? rawInstagram
      : `https://instagram.com/${rawInstagram.replace(/^@/, '')}`
    : ''
  const websiteUrl = ((formData.get('websiteUrl') as string) || '').trim()
  const availableForWork = formData.get('availableForWork') === 'on'

  const baseUpdates = {
    id: user.id,
    full_name: formData.get('fullName') as string,
    username: formData.get('username') as string,
    location: formData.get('location') as string,
    category: formData.get('category') as string,
    bio: formData.get('bio') as string,
    avatar_url: finalAvatarUrl,
    cover_url: finalCoverUrl,
  }

  const { error } = await supabase.from('profiles').upsert({
    ...baseUpdates,
    instagram_url: instagramUrl || null,
    website_url: websiteUrl || null,
    available_for_work: availableForWork,
  })

  if (error) {
    // Fallback ako nove kolone još nisu dodate u bazu
    await supabase.from('profiles').upsert(baseUpdates)
  }

  // Osveži rutu korisničkog profila da bi se videle promene
  revalidatePath(`/artist/${user.id}`)
  revalidatePath('/')
  redirect(`/artist/${user.id}`)
}

export async function changePassword(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Morate biti prijavljeni.' }
  }

  const newPassword = formData.get('newPassword') as string
  if (!newPassword || newPassword.length < 6) {
    return { error: 'Lozinka mora imati najmanje 6 karaktera.' }
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
