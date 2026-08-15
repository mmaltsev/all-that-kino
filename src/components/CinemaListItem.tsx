import type { Cinema } from '../types'
import { StarIcon, PinIcon } from './Icons'
import { useAppState } from '../state/AppState'
import { showtimesForCinema } from '../data'
import './CinemaListItem.css'

export default function CinemaListItem({ cinema }: { cinema: Cinema }) {
  const { isFavoriteCinema, toggleFavoriteCinema } = useAppState()
  const fav = isFavoriteCinema(cinema.id)
  const todayCount = showtimesForCinema(cinema.id).filter((s) => s.dayOffset === 0).length

  return (
    <div className="cinema-item">
      <div className="cinema-item__main">
        <div className="cinema-item__name-row">
          <span className="cinema-item__name">{cinema.name}</span>
        </div>
        <div className="cinema-item__meta">
          <PinIcon size={13} />
          <span>{cinema.neighborhood}</span>
          <span className="cinema-item__dot">·</span>
          <span>{todayCount} showing{todayCount === 1 ? '' : 's'} today</span>
        </div>
        <div className="cinema-item__address">{cinema.address}</div>
      </div>
      <button
        className={`cinema-item__star${fav ? ' cinema-item__star--active' : ''}`}
        aria-label={fav ? 'Unfavorite cinema' : 'Favorite cinema'}
        onClick={() => toggleFavoriteCinema(cinema.id)}
      >
        <StarIcon filled={fav} />
      </button>
    </div>
  )
}
