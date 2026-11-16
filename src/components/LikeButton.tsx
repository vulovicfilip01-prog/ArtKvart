'use client'

import { useState } from 'react'
import { toggleLike } from '@/app/artwork/[id]/actions'
import { useRouter } from 'next/navigation'

export default function LikeButton({ 
  artworkId, 
  initialLikes, 
  isLikedInitial, 
  isLoggedIn 
}: { 
  artworkId: string, 
  initialLikes: number, 
  isLikedInitial: boolean, 
  isLoggedIn: boolean 
}) {
  const [isLiked, setIsLiked] = useState(isLikedInitial)
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleLike = async () => {
    if (!isLoggedIn) {
      alert('Morate biti prijavljeni da biste lajkovali radove.')
      router.push('/login')
      return
    }

    if (isPending) return
    setIsPending(true)

    // Optimistični UI update (odmah menjamo boju da korisnik ne čeka)
    setIsLiked(!isLiked)

    // Pozivamo backend akciju
    await toggleLike(artworkId)
    
    setIsPending(false)
  }

  return (
    <button 
      onClick={handleLike}
      className="btn-primary" 
      style={{ 
        flex: 1, 
        padding: '0.8rem', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '0.5rem', 
        fontWeight: 600,
        backgroundColor: isLiked ? 'transparent' : 'var(--primary-color)',
        color: isLiked ? '#e74c3c' : '#fff',
        border: isLiked ? '1px solid #e74c3c' : '1px solid var(--primary-color)',
        transition: 'all 0.2s',
        cursor: 'pointer'
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      {isLiked ? 'Sviđa ti se' : 'Sviđa mi se'}
    </button>
  )
}
