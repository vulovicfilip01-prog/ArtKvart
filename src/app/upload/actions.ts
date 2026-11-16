'use server'

import { createClient } from '@/utils/supabase/server'
import { ensureProfileExists } from '@/utils/supabase/ensureProfile'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function uploadArtwork(formData: FormData) {
  const supabase = await createClient()
  
  // Proveravamo da li je korisnik ulogovan
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Osiguraj da korisnik ima kreiran profil u tabeli profiles
  await ensureProfileExists(supabase, user)

  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const price = ((formData.get('price') as string) || '').trim()
  const tools = ((formData.get('tools') as string) || '').trim()
  const file = formData.get('file') as File | null
  let finalImageUrl = formData.get('imageUrl') as string

  // Ako je izabran fajl sa računara, prvo ga otpremiti u "radovi" bucket
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage.from('radovi').upload(fileName, file)
    
    if (uploadError) {
      console.error('Greška pri uploadu slike:', uploadError)
    } else {
      // Ako je upload uspeo, dobij javni URL te slike
      const { data: { publicUrl } } = supabase.storage.from('radovi').getPublicUrl(fileName)
      finalImageUrl = publicUrl
    }
  }

  // Ako i dalje nemamo url (ni fajl ni link)
  if (!finalImageUrl) {
    // Možeš vratiti grešku, ali za sad ignorišemo
    finalImageUrl = ''
  }

  // Ubacujemo rad u bazu
  const { error } = await supabase.from('artworks').insert({
    artist_id: user.id,
    title: title,
    category: category,
    description: description,
    image_url: finalImageUrl,
    price: price || null,
    tools: tools || null
  })

  if (error) {
    // Fallback ako kolone price ili tools još nisu dodate u Supabase tabelu
    await supabase.from('artworks').insert({
      artist_id: user.id,
      title: title,
      category: category,
      description: description,
      image_url: finalImageUrl
    })
  }

  // Osvežavamo početnu stranu da bi se video novi rad
  revalidatePath('/')
  redirect('/')
}
