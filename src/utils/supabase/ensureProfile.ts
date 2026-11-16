import type { SupabaseClient, User } from '@supabase/supabase-js'

export async function ensureProfileExists(supabase: SupabaseClient, user: User) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!existing) {
    await supabase.from('profiles').insert({
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Umetnik',
      username: user.email?.split('@')[0] || `umetnik_${user.id.slice(0, 5)}`,
      avatar_url:
        user.user_metadata?.avatar_url ||
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop',
    })
  }
}
