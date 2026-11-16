'use client'

import { useState } from 'react'
import { sendMessageToArtist } from '@/app/artist/[id]/actions'

export default function ContactModalButton({
  artistId,
  artistName,
  username,
  location,
  category
}: {
  artistId: string
  artistName: string
  username?: string | null
  location?: string | null
  category?: string | null
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSending(true)
    await sendMessageToArtist(formData)
    setIsSending(false)
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setIsOpen(false)
    }, 1800)
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-dark">
        Kontaktiraj
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '1rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--nav-bg)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '2rem',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 15px 50px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--text-light)', fontSize: '1.3rem', fontWeight: 700 }}>
                Kontaktiraj umetnika
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                backgroundColor: 'var(--surface-color)',
                padding: '0.9rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.2rem',
                fontSize: '0.9rem'
              }}
            >
              <div style={{ color: 'var(--text-light)', fontWeight: 600 }}>{artistName}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                @{username || 'umetnik'} • {category || 'Vizuelni umetnik'} • {location || 'Srbija'}
              </div>
            </div>

            {sent ? (
              <div
                style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  color: '#2ecc71',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                ✓ Poruka je poslata u inboks umetnika {artistName}!
              </div>
            ) : (
              <form action={handleSubmit}>
                <input type="hidden" name="receiverId" value={artistId} />

                <div className="form-group">
                  <label htmlFor="sender-name">Vaše ime ili studio</label>
                  <input
                    id="sender-name"
                    name="senderName"
                    type="text"
                    placeholder="Npr. Marko / Studio Kvart"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sender-email">Vaš kontakt email</label>
                  <input
                    id="sender-email"
                    name="senderEmail"
                    type="email"
                    placeholder="vas@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-subject">Predmet upita</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="Npr. Saradnja na projektu / Narudžbina rada"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message">Poruka</label>
                  <textarea
                    id="contact-message"
                    name="content"
                    rows={4}
                    required
                    placeholder={`Zdravo ${artistName}, želeo/la bih da se raspitam o...`}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      backgroundColor: '#000',
                      color: 'var(--text-light)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      fontSize: '0.95rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.2rem' }}>
                  <button type="button" onClick={() => setIsOpen(false)} className="btn-dark">
                    Otkaži
                  </button>
                  <button type="submit" disabled={isSending} className="btn-primary">
                    {isSending ? 'Slanje...' : 'Pošalji poruku'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
