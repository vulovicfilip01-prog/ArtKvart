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

  const updates = {
    id: user.id,
    full_name: formData.get('fullName') as string,
    username: formData.get('username') as string,
    location: formData.get('location') as string,
    category: formData.get('category') as string,
    bio: formData.get('bio') as string,
    avatar_url: finalAvatarUrl,
    cover_url: finalCoverUrl,
  }

  const { error } = await supabase.from('profiles').upsert(updates)

  if (error) {
    console.error('Greška pri ažuriranju profila:', error)
  }

  // Osveži rutu korisničkog profila da bi se videle promene
  revalidatePath(`/artist/${user.id}`)
  revalidatePath('/')
  redirect(`/artist/${user.id}`)
}
