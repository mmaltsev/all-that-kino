import { useState } from 'react'
import type { Cinema } from '../types'
import { StarIcon, PinIcon } from './Icons'
import { useAppState } from '../state/AppState'
import { showtimesForCinema, getMovie } from '../data'
import './CinemaMap.css'

export default function CinemaMap({ cinemas }: { cinemas: Cinema[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { isFavoriteCinema, toggleFavoriteCinema } = useAppState()
  const selected = cinemas.find((c) => c.id === selectedId) ?? null

  const todayScreenings = selected
    ? showtimesForCinema(selected.id)
        .filter((s) => s.dayOffset === 0)
        .sort((a, b) => a.time.localeCompare(b.time))
        .slice(0, 4)
    : []

  return (
    <div className="cinema-map">
      <div className="cinema-map__canvas">
        <svg className="cinema-map__streets" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="0" y1="20" x2="100" y2="15" />
          <line x1="0" y1="45" x2="100" y2="50" />
          <line x1="0" y1="75" x2="100" y2="80" />
          <line x1="15" y1="0" x2="20" y2="100" />
          <line x1="50" y1="0" x2="45" y2="100" />
          <line x1="80" y1="0" x2="85" y2="100" />
        </svg>
        {cinemas.map((cinema) => {
          const active = cinema.id === selectedId
          const fav = isFavoriteCinema(cinema.id)
          return (
            <button
              key={cinema.id}
              className={`cinema-map__pin${active ? ' cinema-map__pin--active' : ''}${fav ? ' cinema-map__pin--fav' : ''}`}
              style={{ left: `${cinema.mapX}%`, top: `${cinema.mapY}%` }}
              onClick={() => setSelectedId(cinema.id === selectedId ? null : cinema.id)}
              aria-label={cinema.name}
            >
              <PinIcon size={13} />
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="cinema-map__sheet">
          <div className="cinema-item__main">
            <div className="cinema-item__name">{selected.name}</div>
            <div className="cinema-item__meta">
              <PinIcon size={13} />
              <span>{selected.neighborhood}</span>
            </div>
            <div className="cinema-item__address">{selected.address}</div>
            {todayScreenings.length > 0 ? (
              <div className="cinema-map__screenings">
                {todayScreenings.map((s) => (
                  <span key={s.id} className="cinema-map__screening">
                    {getMovie(s.movieId)?.title} · {s.time}
                  </span>
                ))}
              </div>
            ) : (
              <div className="cinema-map__screenings eyebrow">Nothing scheduled today.</div>
            )}
          </div>
          <button
            className={`cinema-item__star${isFavoriteCinema(selected.id) ? ' cinema-item__star--active' : ''}`}
            aria-label="Favorite cinema"
            onClick={() => toggleFavoriteCinema(selected.id)}
          >
            <StarIcon filled={isFavoriteCinema(selected.id)} />
          </button>
        </div>
      )}
    </div>
  )
}
