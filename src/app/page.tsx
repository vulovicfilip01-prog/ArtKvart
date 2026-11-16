import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category;
  const searchQuery = resolvedParams.q?.trim();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Dohvatamo radove. Ako je odabrana kategorija ili upit za pretragu, filtriramo bazu!
  let query = supabase
    .from('artworks')
    .select(`
      *,
      profiles (
        full_name,
        username,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (currentCategory) {
    query = query.eq('category', currentCategory);
  }

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
  }

  const { data: artworks } = await query;

  // Ako postoji pretraga, pretražujemo i umetnike (profiles)
  let searchedArtists = null;
  if (searchQuery) {
    const { data: artists } = await supabase
      .from('profiles')
      .select('*')
      .or(`full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
      .limit(8);
    searchedArtists = artists;
  }

  const featured = [
    { id: 1, title: 'Cyberpunk Beograd 2077', subtitle: 'Zaroni u futuristički svet našeg najnovijeg Art Blasta', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1200&auto=format&fit=crop' },
    { id: 2, title: 'Slavenska Mitologija', subtitle: 'Globalni dizajn likova i koncept art', image: 'https://images.unsplash.com/photo-1683398327267-336c1e556f85?q=80&w=1200&auto=format&fit=crop' },
    { id: 3, title: 'Japanski Zmaj - Tetovaža', subtitle: 'Proces izrade majstorskog dela na koži', image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=1200&auto=format&fit=crop' },
  ];

  const categories = [
    { name: 'Digitalna Umetnost', image: 'https://images.unsplash.com/photo-1614729939124-03290b56c9ce?q=80&w=100&auto=format&fit=crop' },
    { name: 'Tradicionalna', image: 'https://images.unsplash.com/photo-1549492423-400259a2e574?q=80&w=100&auto=format&fit=crop' },
    { name: 'Tetovaže', image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=100&auto=format&fit=crop' },
    { name: 'Grafiti', image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?q=80&w=100&auto=format&fit=crop' },
    { name: 'Vajarstvo', image: 'https://images.unsplash.com/photo-1549492423-400259a2e574?q=80&w=100&auto=format&fit=crop' },
    { name: 'Tekstil', image: 'https://images.unsplash.com/photo-1584985437812-9c162ebaf538?q=80&w=100&auto=format&fit=crop' }
  ];

  return (
    <main className="main-content">
      {!searchQuery && (
        <>
          <section className="hero">
            <h1 className="hero-title">Platforma za vrhunske vizuelne umetnike</h1>
            <p className="hero-subtitle">
              Otkrijte izvanredne radove, povežite se sa vodećim studijima i pronađite talente iz sveta digitalne, tradicionalne, street i primenjene umetnosti.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href={user ? `/artist/${user.id}` : '/login?mode=signup'} className="btn-primary" style={{ textDecoration: 'none' }}>
                Kreiraj Portfolio
              </Link>
              <Link href={user ? '/upload' : '/login'} className="btn-dark" style={{ textDecoration: 'none' }}>
                Objavi Rad
              </Link>
            </div>
          </section>

          <section className="featured-carousel">
            {featured.map((item) => (
              <div key={item.id} className="featured-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.title} />
                <div className="featured-content">
                  <h2>{item.title}</h2>
                  <p>{item.subtitle}</p>
                </div>
              </div>
            ))}
          </section>
        </>
      )}

      <section className="channels-bar">
        <button className="btn-dark icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
        </button>
        <Link href="/" style={{textDecoration: 'none'}}>
          <button className={`btn-dark all-channels-btn ${!currentCategory && !searchQuery ? 'active' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px'}}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Svi Kanali
          </button>
        </Link>
        
        <div className="channels-list">
          {categories.map(cat => (
            <Link href={`/?category=${cat.name}`} key={cat.name} style={{textDecoration: 'none'}}>
              <div className={`channel-pill ${currentCategory === cat.name ? 'active' : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.image} alt={cat.name} />
                <span>{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {searchQuery && searchedArtists && searchedArtists.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 className="section-title">Pronađeni umetnici za &ldquo;{searchQuery}&rdquo;</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {searchedArtists.map((artist) => (
              <Link
                href={`/artist/${artist.id}`}
                key={artist.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '0.8rem 1rem',
                  backgroundColor: 'var(--surface-color)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  textDecoration: 'none'
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={artist.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop'}
                  alt={artist.full_name || 'Umetnik'}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ color: 'var(--text-light)', fontWeight: 600, fontSize: '0.95rem' }}>
                    {artist.full_name || 'Umetnik'}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {artist.category || `@${artist.username || 'umetnik'}`}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="gallery-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            {searchQuery
              ? `Rezultati radova za: "${searchQuery}"`
              : currentCategory
                ? `Radovi iz kategorije: ${currentCategory}`
                : 'Novi Radovi (Iz Baze)'}
          </h2>
          {searchQuery && (
            <Link href="/" className="btn-dark" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>
              Poništi pretragu ✕
            </Link>
          )}
        </div>
        <div className="gallery-grid">
          {artworks && artworks.length > 0 ? (
            artworks.map((art) => (
              <Link href={`/artwork/${art.id}`} key={art.id} className="art-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={art.image_url} alt={art.title} className="art-image" />
                
                <div className="art-info">
                  <div className="art-title">{art.title}</div>
                  <div className="art-artist">{art.profiles?.full_name || 'Anonimni Umetnik'}</div>
                </div>
              </Link>
            ))
          ) : (
            <div style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0' }}>
              Nema objavljenih radova za ovaj kriterijum.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
