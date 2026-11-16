'use client'

import { useState, useEffect } from 'react'

export default function ArtworkLightbox({
  src,
  alt
}: {
  src: string
  alt: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#000',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'zoom-in'
        }}
        title="Klikni za prikaz preko celog ekrana"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '0.35rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            border: '1px solid rgba(255,255,255,0.15)',
            pointerEvents: 'none'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
          Uvećaj sliku
        </div>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.94)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            cursor: 'zoom-out'
          }}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: '20px',
              right: '24px',
              backgroundColor: 'rgba(255,255,255,0.12)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Zatvori prikaz"
          >
            ✕
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '95vw',
              maxHeight: '92vh',
              objectFit: 'contain',
              borderRadius: '6px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              cursor: 'default'
            }}
          />
        </div>
      )}
    </>
  )
}
