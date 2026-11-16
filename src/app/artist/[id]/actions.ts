'use server'

import { createClient } from '@/utils/supabase/server'
import { ensureProfileExists } from '@/utils/supabase/ensureProfile'
import { revalidatePath } from 'next/cache'

export async function toggleFollow(artistId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id === artistId) return

  await ensureProfileExists(supabase, user)

  // Proveri da li follow već postoji
  const { data: existingFollow } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', user.id)
    .eq('following_id', artistId)
    .single()

  const { data: artistProfile } = await supabase
    .from('profiles')
    .select('followers_count')
    .eq('id', artistId)
    .single()

  const { data: myProfile } = await supabase
    .from('profiles')
    .select('following_count')
    .eq('id', user.id)
    .single()
    
  const currentFollowers = artistProfile?.followers_count || 0
  const currentFollowing = myProfile?.following_count || 0

  if (existingFollow) {
    // Unfollow
    await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', artistId)
    await supabase.from('profiles').update({ followers_count: Math.max(0, currentFollowers - 1) }).eq('id', artistId)
    await supabase.from('profiles').update({ following_count: Math.max(0, currentFollowing - 1) }).eq('id', user.id)
  } else {
    // Follow
    await supabase.from('follows').insert({ follower_id: user.id, following_id: artistId })
    await supabase.from('profiles').update({ followers_count: currentFollowers + 1 }).eq('id', artistId)
    await supabase.from('profiles').update({ following_count: currentFollowing + 1 }).eq('id', user.id)
  }

  revalidatePath(`/artist/${artistId}`)
  revalidatePath(`/artist/${user.id}`)
}

export async function sendMessageToArtist(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const receiverId = formData.get('receiverId') as string
  const senderName = (formData.get('senderName') as string) || user?.user_metadata?.full_name || user?.email || 'Posetilac'
  const senderEmail = (formData.get('senderEmail') as string) || user?.email || ''
  const subject = formData.get('subject') as string
  const content = formData.get('content') as string

  if (!receiverId || !subject?.trim() || !content?.trim()) return

  await supabase.from('messages').insert({
    sender_id: user?.id || null,
    receiver_id: receiverId,
    sender_name: senderName.trim(),
    sender_email: senderEmail.trim(),
    subject: subject.trim(),
    content: content.trim(),
  })

  revalidatePath('/inbox')
}
