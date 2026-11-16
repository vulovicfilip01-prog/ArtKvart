'use client'

import { useState } from 'react'

export default function ImageUploadInput({
  id,
  name,
  label,
  initialPreview,
  isAvatar = false
}: {
  id: string
  name: string
  label: string
  initialPreview?: string | null
  isAvatar?: boolean
}) {
  const [preview, setPreview] = useState<string | null>(initialPreview || null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Fajl je veći od 10MB. Molimo izaberite manju sliku.')
      e.target.value = ''
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
  }

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {preview && (
        <div style={{ marginBottom: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Pregled slike"
            style={
              isAvatar
                ? { width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-color)' }
                : { width: '100%', maxHeight: '220px', borderRadius: '8px', objectFit: 'contain', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.15)' }
            }
          />
          {isAvatar && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pregled profilne slike</span>}
        </div>
      )}
      <input
        type="file"
        id={id}
        name={name}
        accept="image/*"
        onChange={handleFileChange}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          backgroundColor: '#000',
          color: 'var(--text-light)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      />
      {errorMsg && (
        <small style={{ color: '#e74c3c', display: 'block', marginTop: '0.4rem' }}>{errorMsg}</small>
      )}
    </div>
  )
}
