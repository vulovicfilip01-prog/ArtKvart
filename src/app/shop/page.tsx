import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import SafeArtImage from '@/components/SafeArtImage';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category;
  const searchQuery = resolvedParams.q?.trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from('artworks')
    .select(
      `
      *,
      profiles (
        id,
        full_name,
        username,
        avatar_url,
        location
      )
    `
    )
    .order('created_at', { ascending: false });

  if (currentCategory) {
    query = query.eq('category', currentCategory);
  }

  if (searchQuery) {
    query = query.or(
      `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`
    );
  }

  const { data: allArtworks } = await query;

  // Filtriramo samo radove koji imaju unetu cenu (na prodaju)
  const forSaleArtworks = (allArtworks || []).filter(
    (art) => art.price && String(art.price).trim().length > 0
  );

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
      {/* Shop Hero Header */}
      <section
        style={{
          backgroundColor: 'var(--nav-bg)',
          padding: '2.5rem 2rem',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.4rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(46, 204, 113, 0.14)',
                color: '#2ecc71',
                border: '1px solid rgba(46, 204, 113, 0.35)',
                padding: '0.2rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '0.6rem',
              }}
            >
              ARTKVART MARKETPLACE
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-light)', marginBottom: '0.3rem' }}>
              Prodavnica Umetničkih Radova
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Kupite originalne slike, skulpture, unikatni tekstil, printove i digitalne radove direktno od umetnika.
            </p>
          </div>

          <Link
            href={user ? '/upload' : '/login'}
            className="btn-primary"
            style={{ textDecoration: 'none', padding: '0.75rem 1.4rem' }}
          >
            + Ponudi rad na prodaju
          </Link>
        </div>

        {/* Category Filters & Search */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.8rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.8rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <Link href="/shop" style={{ textDecoration: 'none' }}>
              <button
                className={`btn-dark all-channels-btn ${!currentCategory ? 'active' : ''}`}
                style={{ fontSize: '0.85rem' }}
              >
                Sve Kategorije
              </button>
            </Link>
            {categories.map((cat) => (
              <Link href={`/shop?category=${encodeURIComponent(cat)}`} key={cat} style={{ textDecoration: 'none' }}>
                <button
                  className={`btn-dark ${currentCategory === cat ? 'all-channels-btn active' : ''}`}
                  style={{ fontSize: '0.85rem' }}
                >
                  {cat}
                </button>
              </Link>
            ))}
          </div>

          <form action="/shop" method="GET" style={{ display: 'flex', gap: '0.5rem', minWidth: '260px' }}>
            {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
            <input
              type="text"
              name="q"
              defaultValue={searchQuery || ''}
              placeholder="Pretraži radove na prodaju..."
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
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '0.55rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}
            >
              Traži
            </button>
          </form>
        </div>
      </section>

      {/* Shop Items Grid */}
      {forSaleArtworks.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.4rem',
          }}
        >
          {forSaleArtworks.map((art) => (
            <Link
              href={`/artwork/${art.id}`}
              key={art.id}
              style={{
                backgroundColor: 'var(--nav-bg)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.07)',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '4/3', backgroundColor: '#000', overflow: 'hidden' }}>
                <SafeArtImage
                  src={art.image_url}
                  alt={art.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    color: '#2ecc71',
                    border: '1px solid rgba(46, 204, 113, 0.45)',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                  }}
                >
                  {art.price}
                </div>
              </div>

              <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <h3 style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                    {art.title}
                  </h3>
                  {art.category && (
                    <span className="profile-badge" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                      {art.category}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.2rem' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      art.profiles?.avatar_url ||
                      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop'
                    }
                    alt={art.profiles?.full_name || 'Umetnik'}
                    style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {art.profiles?.full_name || 'Umetnik'}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '0.9rem',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#2ecc71', fontWeight: 700, fontSize: '0.95rem' }}>{art.price}</span>
                  <span style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.85rem' }}>
                    Kupi / Detalji →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--nav-bg)',
            borderRadius: '12px',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <h3 style={{ color: 'var(--text-light)', fontSize: '1.3rem', marginBottom: '0.6rem' }}>
            Trenutno nema radova na prodaju u ovoj kategoriji
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            Kada objavljujete novi rad ili uređujete postojeći rad (klikom na „Uredi rad“), unesite polje{' '}
            <strong>Cena rada</strong> (npr. 120€) i vaš rad će se automatski pojaviti u Prodavnici!
          </p>
          <Link href={user ? '/upload' : '/login'} className="btn-primary" style={{ textDecoration: 'none' }}>
            Objavi prvi rad na prodaju
          </Link>
        </div>
      )}
    </main>
  );
}
