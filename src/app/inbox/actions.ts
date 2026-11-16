'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteMessage(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const messageId = formData.get('messageId') as string
  if (!messageId) return

  await supabase
    .from('messages')
    .delete()
    .eq('id', messageId)
    .eq('receiver_id', user.id)

  revalidatePath('/inbox')
}
