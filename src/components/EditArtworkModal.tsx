'use client'

import { useState } from 'react'
import { updateArtwork } from '@/app/artwork/[id]/actions'

export default function EditArtworkModal({
  artwork
}: {
  artwork: {
    id: string
    title: string
    category?: string | null
    description?: string | null
    price?: string | null
  }
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    await updateArtwork(formData)
    setIsOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn-dark"
        style={{ padding: '0.8rem 1rem', fontSize: '0.85rem' }}
      >
        Uredi rad
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
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '2rem',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 15px 50px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ color: 'var(--text-light)', fontSize: '1.3rem', fontWeight: 700 }}>
                Izmeni detalje rada
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form action={handleSubmit}>
              <input type="hidden" name="artworkId" value={artwork.id} />

              <div className="form-group">
                <label htmlFor="edit-title">Naslov dela</label>
                <input
                  id="edit-title"
                  name="title"
                  type="text"
                  required
                  defaultValue={artwork.title}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-category">Kategorija</label>
                <select
                  id="edit-category"
                  name="category"
                  defaultValue={artwork.category || 'Digitalna Umetnost'}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    backgroundColor: '#000',
                    color: 'var(--text-light)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                >
                  <option value="Digitalna Umetnost">Digitalna Umetnost</option>
                  <option value="Tradicionalna">Tradicionalna</option>
                  <option value="Tetovaže">Tetovaže</option>
                  <option value="Grafiti">Grafiti</option>
                  <option value="Vajarstvo">Vajarstvo</option>
                  <option value="Tekstil">Tekstil</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">Opis rada</label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows={4}
                  defaultValue={artwork.description || ''}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    backgroundColor: '#000',
                    color: 'var(--text-light)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-price">Cena rada – ako je na prodaju (Opciono)</label>
                <input
                  id="edit-price"
                  name="price"
                  type="text"
                  defaultValue={artwork.price || ''}
                  placeholder="Npr. 120€ (ostavite prazno ako nije na prodaju)"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.2rem' }}>
                <button type="button" onClick={() => setIsOpen(false)} className="btn-dark">
                  Otkaži
                </button>
                <button type="submit" className="btn-primary">
                  Sačuvaj izmene
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
