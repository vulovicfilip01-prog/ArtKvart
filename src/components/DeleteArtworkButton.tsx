'use client'

import { useState } from 'react'
import { deleteArtwork } from '@/app/artwork/[id]/actions'

export default function DeleteArtworkButton({ artworkId }: { artworkId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm('Da li ste sigurni da želite da obrišete ovaj rad?')
    if (!confirmed) return

    setIsDeleting(true)
    await deleteArtwork(artworkId)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="btn-dark"
      style={{
        padding: '0.8rem 1rem',
        color: '#e74c3c',
        border: '1px solid rgba(231, 76, 60, 0.3)',
        cursor: isDeleting ? 'not-allowed' : 'pointer',
        fontSize: '0.85rem'
      }}
    >
      {isDeleting ? 'Brisanje...' : 'Obriši rad'}
    </button>
  )
}
