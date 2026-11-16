'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createJob(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const title = formData.get('title') as string
  const company = formData.get('company') as string
  const location = formData.get('location') as string
  const jobType = formData.get('jobType') as string
  const category = formData.get('category') as string
  const budget = formData.get('budget') as string
  const contactEmail = formData.get('contactEmail') as string
  const description = formData.get('description') as string

  if (!title?.trim() || !company?.trim() || !description?.trim()) return

  await supabase.from('jobs').insert({
    user_id: user.id,
    title: title.trim(),
    company: company.trim(),
    location: location?.trim() || 'Remote / Srbija',
    job_type: jobType || 'Freelance / Projekat',
    category: category || 'Digitalna Umetnost',
    budget: budget?.trim() || 'Po dogovoru',
    contact_email: contactEmail?.trim() || user.email || '',
    description: description.trim(),
  })

  revalidatePath('/jobs')
}

export async function deleteJob(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const jobId = formData.get('jobId') as string
  if (!jobId) return

  await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId)
    .eq('user_id', user.id)

  revalidatePath('/jobs')
}
