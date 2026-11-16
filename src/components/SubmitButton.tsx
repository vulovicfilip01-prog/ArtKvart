'use client'

import { useFormStatus } from 'react-dom'

export default function SubmitButton({
  label,
  pendingLabel = 'Sačekajte...',
  className = 'btn-primary',
  style
}: {
  label: string
  pendingLabel?: string
  className?: string
  style?: React.CSSProperties
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      style={{
        ...style,
        opacity: pending ? 0.7 : 1,
        cursor: pending ? 'not-allowed' : 'pointer'
      }}
    >
      {pending ? pendingLabel : label}
    </button>
  )
}
