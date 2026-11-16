'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ArtworkItem {
  id: string
  title: string
  image_url: string
  category?: string | null
  likes_count?: number | null
  price?: string | null
}

interface ProfileData {
  id: string
  full_name?: string | null
  username?: string | null
  bio?: string | null
  location?: string | null
  category?: string | null
  followers_count?: number | null
  following_count?: number | null
  created_at?: string | null
}

export default function ArtistProfileTabs({
  profile,
  artworks,
  likedArtworks = []
}: {
  profile: ProfileData
  artworks: ArtworkItem[]
  likedArtworks?: ArtworkItem[]
}) {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'liked' | 'about'>('portfolio')

  const totalLikes = artworks.reduce((sum, art) => sum + (art.likes_count || 0), 0)
  const joinedDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('sr-RS', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Nedavno'

  return (
    <>
      {/* Tabs */}
      <div className="profile-tabs">
        <button
          type="button"
          onClick={() => setActiveTab('portfolio')}
          className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`}
        >
          Portfolio ({artworks.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('liked')}
          className={`tab ${activeTab === 'liked' ? 'active' : ''}`}
        >
          Lajkovano ({likedArtworks.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`tab ${activeTab === 'about' ? 'active' : ''}`}
        >
          O meni
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'portfolio' && (
        <div className="gallery-grid" style={{ marginTop: '1.5rem' }}>
          {artworks && artworks.length > 0 ? (
            artworks.map((art) => (
              <Link href={`/artwork/${art.id}`} key={art.id} className="art-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={art.image_url} alt={art.title || 'Art'} className="art-image" />
                {art.price && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(0,0,0,0.78)',
                      color: '#2ecc71',
                      border: '1px solid rgba(46, 204, 113, 0.4)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '14px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {art.price}
                  </div>
                )}
                <div className="art-info">
                  <div className="art-title">{art.title}</div>
                  <div className="art-artist">
                    {art.category || 'Rad'} • {art.likes_count || 0} lajkova
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Ovaj umetnik nema objavljenih radova.</p>
          )}
        </div>
      )}

      {activeTab === 'liked' && (
        <div className="gallery-grid" style={{ marginTop: '1.5rem' }}>
          {likedArtworks && likedArtworks.length > 0 ? (
            likedArtworks.map((art) => (
              <Link href={`/artwork/${art.id}`} key={art.id} className="art-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={art.image_url} alt={art.title || 'Art'} className="art-image" />
                {art.price && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(0,0,0,0.78)',
                      color: '#2ecc71',
                      border: '1px solid rgba(46, 204, 113, 0.4)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '14px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {art.price}
                  </div>
                )}
                <div className="art-info">
                  <div className="art-title">{art.title}</div>
                  <div className="art-artist">
                    {art.category || 'Rad'} • {art.likes_count || 0} lajkova
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Još uvek nema lajkovanih radova.</p>
          )}
        </div>
      )}

      {activeTab === 'about' && (
        <div
          style={{
            marginTop: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {/* Biografija i opis */}
          <div
            style={{
              backgroundColor: 'var(--nav-bg)',
              padding: '1.8rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <h3 style={{ color: 'var(--text-light)', fontSize: '1.15rem', marginBottom: '1rem', fontWeight: 700 }}>
              O umetniku
            </h3>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
              {profile.bio || 'Ovaj umetnik još uvek nije dodao detaljnu biografiju.'}
            </p>
          </div>

          {/* Detalji i Statistika */}
          <div
            style={{
              backgroundColor: 'var(--nav-bg)',
              padding: '1.8rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <h3 style={{ color: 'var(--text-light)', fontSize: '1.15rem', marginBottom: '0.2rem', fontWeight: 700 }}>
              Informacije i statistika
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.7rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Specijalnost / Kategorija:</span>
              <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>{profile.category || 'Opšta umetnost'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.7rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Lokacija:</span>
              <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>{profile.location || 'Nepoznata lokacija'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.7rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Objavljenih radova:</span>
              <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>{artworks.length}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.7rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Ukupno lajkova na radovima:</span>
              <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>{totalLikes}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Član od:</span>
              <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>{joinedDate}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
