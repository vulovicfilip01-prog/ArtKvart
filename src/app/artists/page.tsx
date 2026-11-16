import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function ArtistsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category;
  const searchQuery = resolvedParams.q?.trim();

  const supabase = await createClient();

  let query = supabase
    .from('profiles')
    .select('*')
    .order('followers_count', { ascending: false });

  if (currentCategory) {
    query = query.eq('category', currentCategory);
  }

  if (searchQuery) {
    query = query.or(
      `full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`
    );
  }

  const { data: artists } = await query;

  const categories = [
    'Digitalna Umetnost',
    'Tradicionalna',
    'Tetovaže',
    'Grafiti',
    'Vajarstvo',
    'Tekstil',
  ];

  return (
    <main className="main-content">
      {/* Header */}
      <section
        style={{
          backgroundColor: 'var(--nav-bg)',
          padding: '2.5rem 2rem',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-light)', marginBottom: '0.4rem' }}>
            Pronađi talente i umetnike
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Povežite se sa vizuelnim umetnicima, ilustratorima, tatu majstorima i dizajnerima širom regiona.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <Link href="/artists" style={{ textDecoration: 'none' }}>
              <button className={`btn-dark all-channels-btn ${!currentCategory ? 'active' : ''}`} style={{ fontSize: '0.85rem' }}>
                Svi Umetnici
              </button>
            </Link>
            {categories.map((cat) => (
              <Link href={`/artists?category=${encodeURIComponent(cat)}`} key={cat} style={{ textDecoration: 'none' }}>
                <button
                  className={`btn-dark ${currentCategory === cat ? 'all-channels-btn active' : ''}`}
                  style={{ fontSize: '0.85rem' }}
                >
                  {cat}
                </button>
              </Link>
            ))}
          </div>

          <form action="/artists" method="GET" style={{ display: 'flex', gap: '0.5rem', minWidth: '260px' }}>
            {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
            <input
              type="text"
              name="q"
              defaultValue={searchQuery || ''}
              placeholder="Pretraži po imenu ili gradu..."
              style={{
                flex: 1,
                backgroundColor: '#000',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'var(--text-light)',
                padding: '0.55rem 0.9rem',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '0.9rem',
              }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.55rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
              Traži
            </button>
          </form>
        </div>
      </section>

      {/* Artists Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.2rem',
        }}
      >
        {artists && artists.length > 0 ? (
          artists.map((artist) => (
            <Link
              href={`/artist/${artist.id}`}
              key={artist.id}
              style={{
                backgroundColor: 'var(--nav-bg)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.06)',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
            >
              {/* Mini Cover */}
              <div style={{ height: '90px', width: '100%', overflow: 'hidden', backgroundColor: 'var(--surface-color)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    artist.cover_url ||
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
                  }
                  alt="Cover"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Card Body */}
              <div style={{ padding: '0 1.2rem 1.4rem', marginTop: '-36px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.8rem' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      artist.avatar_url ||
                      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop'
                    }
                    alt={artist.full_name || 'Umetnik'}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid var(--nav-bg)',
                      backgroundColor: 'var(--surface-color)',
                    }}
                  />
                  {artist.category && (
                    <span className="profile-badge" style={{ fontSize: '0.75rem' }}>
                      {artist.category}
                    </span>
                  )}
                </div>

                <h3 style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.15rem' }}>
                  {artist.full_name || 'Umetnik'}
                </h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.7rem' }}>
                  @{artist.username || 'umetnik'} • {artist.location || 'Srbija'}
                </div>

                <p
                  style={{
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    marginBottom: '1rem',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {artist.bio || 'Pogledajte portfolio i radove ovog umetnika.'}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.8rem',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span>
                    <strong style={{ color: 'var(--text-light)' }}>{artist.followers_count || 0}</strong> Pratilaca
                  </span>
                  <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Pogledaj profil →</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Nema pronađenih umetnika za izabrani filter.
          </div>
        )}
      </div>
    </main>
  );
}
