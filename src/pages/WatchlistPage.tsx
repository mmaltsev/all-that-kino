import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SegmentedControl from '../components/SegmentedControl'
import { useAppState } from '../state/AppState'
import { useAuth } from '../state/AuthContext'
import { BookmarkIcon, ClockIcon, PersonIcon, PinIcon, TrashIcon } from '../components/Icons'
import { getCinema, getMovie } from '../data'
import { groupLabel } from '../utils/dates'
import './WatchlistPage.css'

type Tab = 'watchlist' | 'plan'

export default function WatchlistPage() {
  const [tab, setTab] = useState<Tab>('watchlist')
  const navigate = useNavigate()
  const { watchlistEntries, toggleWatchlist, letterboxd, plan, removePlanItem } = useAppState()
  const { user } = useAuth()

  const planGroups = useMemo(() => {
    const sorted = [...plan].sort((a, b) => a.dayOffset - b.dayOffset || a.time.localeCompare(b.time))
    const groups = new Map<number, typeof sorted>()
    for (const item of sorted) {
      const list = groups.get(item.dayOffset) ?? []
      list.push(item)
      groups.set(item.dayOffset, list)
    }
    return Array.from(groups.entries())
  }, [plan])

  return (
    <div className="page">
      <header className="page-header">
        <SegmentedControl
          options={[
            { value: 'watchlist', label: 'Watchlist' },
            { value: 'plan', label: 'Plan' }
          ]}
          value={tab}
          onChange={setTab}
        />
        <button className="icon-button watchlist-avatar" aria-label="Account" onClick={() => navigate('/account')}>
          {user ? (user.email ?? user.displayName ?? '?').charAt(0).toUpperCase() : <PersonIcon size={18} />}
        </button>
      </header>

      <div className="page-body">
        {tab === 'watchlist' && (
          <>
            {!letterboxd && (
              <button className="letterboxd-banner" onClick={() => navigate('/letterboxd')}>
                <div>
                  <strong>Connect Letterboxd</strong>
                  <p>Import your watchlist to see what's playing nearby.</p>
                </div>
                <span className="letterboxd-banner__cta">Import</span>
              </button>
            )}
            <div className="watchlist-list">
              {watchlistEntries.map((entry) => (
                <WatchlistRow key={`${entry.title}-${entry.year}`} entry={entry} onRemove={entry.movieId ? () => toggleWatchlist(entry.movieId!) : undefined} />
              ))}
              {watchlistEntries.length === 0 && (
                <p className="eyebrow">Nothing saved yet. Bookmark a movie or import your Letterboxd watchlist.</p>
              )}
            </div>
          </>
        )}

        {tab === 'plan' && (
          <div className="plan-list">
            {planGroups.map(([dayOffset, items]) => (
              <div key={dayOffset} className="plan-group">
                <div className="plan-group__label">{groupLabel(dayOffset).toUpperCase()}</div>
                {items.map((item) => {
                  const movie = getMovie(item.movieId)
                  const cinema = getCinema(item.cinemaId)
                  if (!movie || !cinema) return null
                  return (
                    <div key={item.id} className="plan-item" style={{ background: `linear-gradient(120deg, ${movie.backdropColor}55, #16161600)` }}>
                      <Link to={`/movie/${movie.id}`} className="plan-item__info">
                        <div className="plan-item__title">{movie.title}</div>
                        <div className="plan-item__meta">
                          <PinIcon size={12} /> {cinema.name}
                          <span className="cinema-item__dot">·</span>
                          <ClockIcon size={12} /> {item.time}
                        </div>
                      </Link>
                      <button className="plan-item__delete" aria-label="Remove from plan" onClick={() => removePlanItem(item.id)}>
                        <TrashIcon size={17} />
                      </button>
                    </div>
                  )
                })}
              </div>
            ))}
            {planGroups.length === 0 && (
              <p className="eyebrow">No screenings planned yet. Pick a showtime from a movie's page to add it here.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function WatchlistRow({ entry, onRemove }: { entry: ReturnType<typeof useAppState>['watchlistEntries'][number]; onRemove?: () => void }) {
  const movie = entry.movieId ? getMovie(entry.movieId) : undefined
  return (
    <div className="watchlist-row">
      <div
        className="watchlist-row__swatch"
        style={{ background: movie ? movie.backdropColor : '#2a2a2a' }}
      >
        {entry.title.charAt(0)}
      </div>
      <div className="watchlist-row__info">
        <div className="watchlist-row__title">{entry.title}</div>
        <div className="watchlist-row__meta">
          {entry.director} · {entry.year}
        </div>
        {movie ? (
          <Link to={`/movie/${movie.id}`} className="watchlist-row__badge watchlist-row__badge--playing">
            Playing nearby
          </Link>
        ) : (
          <span className="watchlist-row__badge">Not playing nearby</span>
        )}
      </div>
      {onRemove && (
        <button className="watchlist-row__remove" aria-label="Remove from watchlist" onClick={onRemove}>
          <BookmarkIcon filled size={18} />
        </button>
      )}
    </div>
  )
}
