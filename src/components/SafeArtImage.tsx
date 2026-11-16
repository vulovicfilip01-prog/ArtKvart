'use client'

import { useState } from 'react'

const FALLBACK_ART_IMAGE =
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=900&auto=format&fit=crop'

export default function SafeArtImage({
  src,
  alt,
  className,
  style
}: {
  src?: string | null
  alt: string
  className?: string
  style?: React.CSSProperties
}) {
  const isInvalidPageUrl =
    !src || src.startsWith('https://unsplash.com/photos/') || src.startsWith('http://unsplash.com/photos/')

  const [imgSrc, setImgSrc] = useState<string>(isInvalidPageUrl ? FALLBACK_ART_IMAGE : src)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => {
        if (imgSrc !== FALLBACK_ART_IMAGE) {
          setImgSrc(FALLBACK_ART_IMAGE)
        }
      }}
    />
  )
}
