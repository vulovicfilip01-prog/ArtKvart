import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import PostJobModal from '@/components/PostJobModal';
import { deleteJob } from './actions';

const SAMPLE_JOBS = [
  {
    id: 'sample-1',
    user_id: null,
    title: 'Senior Concept Artist & Ilustrator',
    company: 'Mad Head Studio Beograd',
    location: 'Beograd / Remote',
    job_type: 'Stalni posao',
    category: 'Digitalna Umetnost',
    budget: '1.800€ - 2.500€',
    contact_email: 'karijera@artkvart.rs',
    description:
      'Tražimo iskusnog 2D/3D koncept umetnika za rad na novoj dark-fantasy igri. Potrebno odlično poznavanje anatomije, dizajna okruženja i digitalnog slikanja.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    user_id: null,
    title: 'Resident Tattoo Majstor (Realizam / Blackwork)',
    company: 'Crni Zmaj Tattoo Kolektiv',
    location: 'Novi Sad',
    job_type: 'Stalni posao',
    category: 'Tetovaže',
    budget: 'Procenat / Po dogovoru',
    contact_email: 'studio@artkvart.rs',
    description:
      'Tattoo studio u centru Novog Sada širi tim! Obezbeđena klijentela, vrhunska oprema i odlični uslovi za majstore sa jakim portfolijom u realizmu ili blackwork stilu.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    user_id: null,
    title: 'Oslikavanje murala u enterijeru IT haba (45m²)',
    company: 'Kvart Hub Dorćol',
    location: 'Beograd',
    job_type: 'Freelance / Projekat',
    category: 'Grafiti',
    budget: '1.200€',
    contact_email: 'info@artkvart.rs',
    description:
      'Potreban street-art / mural umetnik za oslikavanje glavnog zida u novom coworking prostoru na Dorćolu. Sav materijal i skela su obezbeđeni.',
    created_at: new Date().toISOString(),
  },
];

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; type?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category;
  const currentType = resolvedParams.type;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase.from('jobs').select('*').order('created_at', { ascending: false });
  if (currentCategory) query = query.eq('category', currentCategory);
  if (currentType) query = query.eq('job_type', currentType);

  const { data: dbJobs } = await query;

  const allJobs = [
    ...(dbJobs || []),
    ...SAMPLE_JOBS.filter(
      (job) =>
        (!currentCategory || job.category === currentCategory) &&
        (!currentType || job.job_type === currentType)
    ),
  ];

  const categories = [
    'Digitalna Umetnost',
    'Tradicionalna',
    'Tetovaže',
    'Grafiti',
    'Vajarstvo',
    'Tekstil',
  ];

  return (
    <main className="main-content" style={{ maxWidth: '1100px' }}>
      {/* Header */}
      <section
        style={{
          backgroundColor: 'var(--nav-bg)',
          padding: '2.5rem 2rem',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-light)', marginBottom: '0.4rem' }}>
            Karijera i Oglasi za Umetnike
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Pronađite sledeći freelance projekat, angažman u studiju ili objavite oglas ako tražite umetnika.
          </p>
        </div>

        <PostJobModal isLoggedIn={!!user} />
      </section>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
        <Link href="/jobs" style={{ textDecoration: 'none' }}>
          <button className={`btn-dark all-channels-btn ${!currentCategory ? 'active' : ''}`} style={{ fontSize: '0.85rem' }}>
            Svi Oglasi
          </button>
        </Link>
        {categories.map((cat) => (
          <Link href={`/jobs?category=${encodeURIComponent(cat)}`} key={cat} style={{ textDecoration: 'none' }}>
            <button
              className={`btn-dark ${currentCategory === cat ? 'all-channels-btn active' : ''}`}
              style={{ fontSize: '0.85rem' }}
            >
              {cat}
            </button>
          </Link>
        ))}
      </div>

      {/* Job Listings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {allJobs.length > 0 ? (
          allJobs.map((job) => (
            <div
              key={job.id}
              style={{
                backgroundColor: 'var(--nav-bg)',
                borderRadius: '12px',
                padding: '1.8rem',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-light)' }}>{job.title}</h2>
                    <span className="profile-badge" style={{ fontSize: '0.75rem' }}>
                      {job.category}
                    </span>
                    <span
                      style={{
                        backgroundColor: 'rgba(19, 175, 240, 0.12)',
                        color: 'var(--primary-color)',
                        padding: '0.2rem 0.7rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {job.job_type}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <strong style={{ color: 'var(--text-main)' }}>{job.company}</strong> • {job.location} • Budžet/Plata:{' '}
                    <strong style={{ color: '#2ecc71' }}>{job.budget}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <a
                    href={`mailto:${job.contact_email}?subject=Prijava za oglas: ${encodeURIComponent(job.title)}`}
                    className="btn-primary"
                    style={{ textDecoration: 'none', padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
                  >
                    Prijavi se / Kontakt
                  </a>
                  {user && job.user_id === user.id && (
                    <form action={deleteJob}>
                      <input type="hidden" name="jobId" value={job.id} />
                      <button
                        type="submit"
                        className="btn-dark"
                        style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', color: '#e74c3c' }}
                      >
                        Obriši
                      </button>
                    </form>
                  )}
                </div>
              </div>

              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {job.description}
              </p>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Trenutno nema aktivnih oglasa u ovoj kategoriji.
          </div>
        )}
      </div>
    </main>
  );
}
