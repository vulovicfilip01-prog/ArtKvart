'use client'

import { useState } from 'react'
import { toggleFollow } from '@/app/artist/[id]/actions'
import { useRouter } from 'next/navigation'

export default function FollowButton({ 
  artistId, 
  isFollowingInitial, 
  isLoggedIn 
}: { 
  artistId: string, 
  isFollowingInitial: boolean, 
  isLoggedIn: boolean 
}) {
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial)
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleFollow = async () => {
    if (!isLoggedIn) {
      alert('Morate biti prijavljeni da biste zapratili umetnika.')
      router.push('/login')
      return
    }

    if (isPending) return
    setIsPending(true)

    // Optimistični UI
    setIsFollowing(!isFollowing)

    // Backend
    await toggleFollow(artistId)
    
    setIsPending(false)
  }

  return (
    <button 
      onClick={handleFollow} 
      className={isFollowing ? "btn-dark" : "btn-primary"} 
      style={{ 
        padding: '0.3rem 0.8rem', 
        fontSize: '0.8rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.4rem', 
        border: isFollowing ? '1px solid rgba(255,255,255,0.2)' : 'none',
        cursor: 'pointer'
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="8.5" cy="7" r="4"/>
        {!isFollowing && <line x1="20" y1="8" x2="20" y2="14"/>}
        {!isFollowing && <line x1="23" y1="11" x2="17" y2="11"/>}
      </svg>
      {isFollowing ? 'Pratiš' : 'Zaprati'}
    </button>
  )
}
