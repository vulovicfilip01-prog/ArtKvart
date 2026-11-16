'use client'

import { useState } from 'react'
import { changePassword } from '@/app/settings/profile/actions'

export default function ChangePasswordForm() {
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setStatus(null)
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!newPassword || newPassword.length < 6) {
      setStatus({ type: 'error', text: 'Nova lozinka mora imati najmanje 6 karaktera.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', text: 'Lozinke se ne poklapaju.' })
      return
    }

    setIsPending(true)
    const result = await changePassword(formData)
    setIsPending(false)

    if (result?.error) {
      setStatus({ type: 'error', text: result.error })
    } else {
      setStatus({ type: 'success', text: '✓ Lozinka je uspešno promenjena!' })
    }
  }

  return (
    <div
      style={{
        marginTop: '2.5rem',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <h3 style={{ color: 'var(--text-light)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
        Promena lozinke
      </h3>

      {status && (
        <div
          style={{
            padding: '0.85rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            backgroundColor: status.type === 'success' ? 'rgba(46, 204, 113, 0.14)' : 'rgba(231, 76, 60, 0.14)',
            color: status.type === 'success' ? '#2ecc71' : '#e74c3c',
            border: `1px solid ${status.type === 'success' ? 'rgba(46, 204, 113, 0.35)' : 'rgba(231, 76, 60, 0.35)'}`
          }}
        >
          {status.text}
        </div>
      )}

      <form action={handleSubmit}>
        <div className="form-group">
          <label htmlFor="newPassword">Nova lozinka</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            required
            minLength={6}
            placeholder="Unesite novu lozinku (min. 6 karaktera)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Potvrdi novu lozinku</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            minLength={6}
            placeholder="Ponovite novu lozinku"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn-dark"
          style={{ width: '100%', padding: '0.9rem', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          {isPending ? 'Menjanje lozinke...' : 'Promeni lozinku'}
        </button>
      </form>
    </div>
  )
}
