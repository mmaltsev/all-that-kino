import { Link } from 'react-router-dom'
import type { Movie } from '../types'
import MovieBackdrop from './MovieBackdrop'
import IconButton from './IconButton'
import { BookmarkIcon, ShareIcon } from './Icons'
import { useAppState } from '../state/AppState'
import './MovieCard.css'

export default function MovieCard({ movie }: { movie: Movie }) {
  const { isWatchlisted, toggleWatchlist } = useAppState()
  const saved = isWatchlisted(movie.id)

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    const shareData = { title: movie.title, text: `${movie.title} — ${movie.director}, playing in Berlin` }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // user cancelled the native share sheet — nothing to do
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareData.title} — ${shareData.text}`)
    }
  }

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <MovieBackdrop color={movie.backdropColor} title={movie.title} className="movie-card__backdrop">
        <div className="movie-card__actions">
          <IconButton
            active={saved}
            aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
            onClick={(e) => {
              e.preventDefault()
              toggleWatchlist(movie.id)
            }}
          >
            <BookmarkIcon filled={saved} />
          </IconButton>
          <IconButton aria-label="Share" onClick={handleShare}>
            <ShareIcon />
          </IconButton>
        </div>
        <div className="movie-card__info">
          <div className="eyebrow">{movie.director}</div>
          <h2 className="heading movie-card__title">{movie.title}</h2>
        </div>
      </MovieBackdrop>
    </Link>
  )
}
