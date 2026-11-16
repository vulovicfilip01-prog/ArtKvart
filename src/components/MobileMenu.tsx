'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signout } from '@/app/login/actions'

export default function MobileMenu({
  user
}: {
  user: { id: string; email?: string; fullName?: string } | null
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mobile-menu-wrapper">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn-dark mobile-menu-btn"
        aria-label="Otvori meni"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="mobile-menu-drawer">
          <form
            action="/"
            method="GET"
            onSubmit={() => setIsOpen(false)}
            style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}
          >
            <input
              type="text"
              name="q"
              placeholder="Pretraži radove i umetnike..."
              style={{
                flex: 1,
                backgroundColor: '#000',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '0.7rem 1rem',
                borderRadius: '8px',
                outline: 'none'
              }}
            />
            <button type="submit" className="btn-primary" style={{ borderRadius: '8px' }}>
              Traži
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <Link href="/" onClick={() => setIsOpen(false)} className="mobile-nav-link">
              Istraži Radove
            </Link>
            <Link href="/artists" onClick={() => setIsOpen(false)} className="mobile-nav-link">
              Pronađi talente
            </Link>
            <Link href="/jobs" onClick={() => setIsOpen(false)} className="mobile-nav-link">
              Karijera i Oglasi
            </Link>
          </div>

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <Link
                href="/upload"
                onClick={() => setIsOpen(false)}
                className="btn-primary"
                style={{ textAlign: 'center', textDecoration: 'none' }}
              >
                + Objavi Rad
              </Link>
              <Link
                href={`/artist/${user.id}`}
                onClick={() => setIsOpen(false)}
                className="btn-dark"
                style={{ textDecoration: 'none' }}
              >
                Moj Profil ({user.fullName || user.email})
              </Link>
              <Link
                href="/inbox"
                onClick={() => setIsOpen(false)}
                className="btn-dark"
                style={{ textDecoration: 'none' }}
              >
                Poruke (Inboks)
              </Link>
              <form action={signout}>
                <button type="submit" className="btn-dark" style={{ width: '100%', color: '#e74c3c' }}>
                  Odjavi se
                </button>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="btn-dark"
                style={{ flex: 1, textDecoration: 'none' }}
              >
                Prijavi se
              </Link>
              <Link
                href="/login?mode=signup"
                onClick={() => setIsOpen(false)}
                className="btn-primary"
                style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
              >
                Registracija
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
