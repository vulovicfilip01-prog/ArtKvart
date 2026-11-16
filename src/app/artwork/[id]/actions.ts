'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function toggleLike(artworkId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  // Proveri da li lajk već postoji
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('artwork_id', artworkId)
    .single()

  const { data: artwork } = await supabase
    .from('artworks')
    .select('likes_count')
    .eq('id', artworkId)
    .single()
    
  const currentLikes = artwork?.likes_count || 0

  if (existingLike) {
    // Obrisi lajk i smanji broj
    await supabase.from('likes').delete().eq('id', existingLike.id)
    await supabase.from('artworks').update({ likes_count: Math.max(0, currentLikes - 1) }).eq('id', artworkId)
  } else {
    // Dodaj lajk i povećaj broj
    await supabase.from('likes').insert({ user_id: user.id, artwork_id: artworkId })
    await supabase.from('artworks').update({ likes_count: currentLikes + 1 }).eq('id', artworkId)
  }

  // Osveži podatke na strani kako bi se novi broj lajkova video
  revalidatePath(`/artwork/${artworkId}`)
}

export async function postComment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const artworkId = formData.get('artworkId') as string
  const content = formData.get('content') as string

  if (!content || !content.trim()) return

  await supabase.from('comments').insert({
    user_id: user.id,
    artwork_id: artworkId,
    content: content.trim()
  })

  revalidatePath(`/artwork/${artworkId}`)
}

export async function deleteComment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const commentId = formData.get('commentId') as string
  const artworkId = formData.get('artworkId') as string

  if (!commentId) return

  await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id)

  revalidatePath(`/artwork/${artworkId}`)
}

export async function deleteArtwork(artworkId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  await supabase
    .from('artworks')
    .delete()
    .eq('id', artworkId)
    .eq('artist_id', user.id)

  revalidatePath('/')
  revalidatePath(`/artist/${user.id}`)
  redirect(`/artist/${user.id}`)
}
