import type { ReactNode } from 'react'
import './MovieBackdrop.css'

interface Props {
  color: string
  title: string
  children?: ReactNode
  className?: string
}

// Real poster art isn't available for dummy data, so each movie gets a generated
// abstract backdrop (tinted gradient + oversized initial) instead of a photo.
export default function MovieBackdrop({ color, title, children, className }: Props) {
  const initial = title.trim().charAt(0).toUpperCase()
  return (
    <div
      className={`movie-backdrop${className ? ` ${className}` : ''}`}
      style={{
        background: `radial-gradient(120% 90% at 30% 0%, ${color} 0%, #0a0a0a 72%)`
      }}
    >
      <span className="movie-backdrop__initial" aria-hidden="true">
        {initial}
      </span>
      <div className="movie-backdrop__grain" />
      {children}
    </div>
  )
}
