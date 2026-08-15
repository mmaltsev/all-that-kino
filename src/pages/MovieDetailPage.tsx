import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMovie, showtimesForMovie, getCinema } from '../data'
import MovieBackdrop from '../components/MovieBackdrop'
import IconButton from '../components/IconButton'
import { ArrowLeftIcon, BookmarkIcon, ChevronDownIcon, PlayIcon, ShareIcon, StarIcon } from '../components/Icons'
import { useAppState } from '../state/AppState'
import { dayLabel, formatRuntime, monthLabel, shortDayNum } from '../utils/dates'
import './MovieDetailPage.css'

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const movie = id ? getMovie(id) : undefined
  const { isWatchlisted, toggleWatchlist, isFavoriteCinema, toggleFavoriteCinema, addPlanItem, removePlanItem, isPlanned, plan } =
    useAppState()

  const [showInfo, setShowInfo] = useState(false)
  const [favoritesFirst, setFavoritesFirst] = useState(true)

  const allShowtimes = useMemo(() => (movie ? showtimesForMovie(movie.id) : []), [movie])

  const availableDays = useMemo(() => {
    const days = Array.from(new Set(allShowtimes.map((s) => s.dayOffset))).sort((a, b) => a - b)
    return days.length ? days : [0]
  }, [allShowtimes])

  const [selectedDay, setSelectedDay] = useState<number>(availableDays[0])

  const groupedByCinema = useMemo(() => {
    const forDay = allShowtimes.filter((s) => s.dayOffset === selectedDay)
    const byCinema = new Map<string, typeof forDay>()
    for (const s of forDay) {
      const list = byCinema.get(s.cinemaId) ?? []
      list.push(s)
      byCinema.set(s.cinemaId, list)
    }
    let entries = Array.from(byCinema.entries()).map(([cinemaId, list]) => ({
      cinema: getCinema(cinemaId)!,
      times: list.sort((a, b) => a.time.localeCompare(b.time))
    }))
    if (favoritesFirst) {
      entries = entries.sort((a, b) => Number(isFavoriteCinema(b.cinema.id)) - Number(isFavoriteCinema(a.cinema.id)))
    } else {
      entries = entries.sort((a, b) => a.cinema.name.localeCompare(b.cinema.name))
    }
    return entries
  }, [allShowtimes, selectedDay, favoritesFirst, isFavoriteCinema, plan])

  const handleShare = async () => {
    if (!movie) return
    const text = `${movie.title} — ${movie.director}, playing in Berlin`
    if (navigator.share) {
      try {
        await navigator.share({ title: movie.title, text })
      } catch {
        // user dismissed the share sheet
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
    }
  }

  if (!movie) {
    return (
      <div className="page">
        <div className="page-body">
          <p>Movie not found.</p>
          <button onClick={() => navigate('/movies')}>Back to Movies</button>
        </div>
      </div>
    )
  }

  const saved = isWatchlisted(movie.id)

  return (
    <div className="page movie-detail">
      <MovieBackdrop color={movie.backdropColor} title={movie.title} className="movie-detail__hero">
        <IconButton className="movie-detail__back" aria-label="Back" onClick={() => navigate(-1)}>
          <ArrowLeftIcon />
        </IconButton>
        <div className="movie-detail__hero-info">
          <div className="eyebrow">{movie.director}</div>
          <h1 className="heading movie-detail__title">{movie.title}</h1>
          <div className="eyebrow">{formatRuntime(movie.runtimeMinutes)}</div>
          <button className="movie-detail__more" onClick={() => setShowInfo((v) => !v)}>
            More info <ChevronDownIcon size={14} />
          </button>
        </div>
      </MovieBackdrop>

      {showInfo && (
        <div className="movie-detail__synopsis">
          <p>{movie.synopsis}</p>
          <p className="eyebrow">
            {movie.genres.join(', ')} · {movie.country} · {movie.year}
          </p>
        </div>
      )}

      <div className="movie-detail__cta-row">
        <button className={`cta-button${saved ? ' cta-button--active' : ''}`} onClick={() => toggleWatchlist(movie.id)}>
          <BookmarkIcon filled={saved} size={16} /> Watchlist
        </button>
        <button className="cta-button" onClick={handleShare}>
          <ShareIcon size={16} /> Share
        </button>
        <button className="cta-button" disabled title="Dummy data — no trailer linked">
          <PlayIcon size={16} /> Trailer
        </button>
      </div>

      <div className="movie-detail__dates">
        {availableDays.map((day) => (
          <button
            key={day}
            className={`date-pill${day === selectedDay ? ' date-pill--active' : ''}`}
            onClick={() => setSelectedDay(day)}
          >
            <span className="date-pill__label">{dayLabel(day)}</span>
            <span className="date-pill__num">
              {monthLabel(day)} {shortDayNum(day)}
            </span>
          </button>
        ))}
      </div>

      <div className="movie-detail__sort-row">
        <button className="movie-detail__sort" onClick={() => setFavoritesFirst((v) => !v)}>
          {favoritesFirst ? 'Favorites first' : 'A–Z'} <ChevronDownIcon size={14} />
        </button>
      </div>

      <div className="movie-detail__cinemas">
        {groupedByCinema.map(({ cinema, times }) => (
          <div key={cinema.id} className="cinema-showtimes">
            <div className="cinema-showtimes__header">
              <span className="cinema-showtimes__name">{cinema.name}</span>
              <button
                className={`cinema-item__star${isFavoriteCinema(cinema.id) ? ' cinema-item__star--active' : ''}`}
                aria-label="Favorite cinema"
                onClick={() => toggleFavoriteCinema(cinema.id)}
              >
                <StarIcon filled={isFavoriteCinema(cinema.id)} />
              </button>
            </div>
            <div className="cinema-showtimes__times">
              {times.map((s) => {
                const planned = isPlanned(movie.id, cinema.id, s.dayOffset, s.time)
                return (
                  <button
                    key={s.id}
                    className={`time-pill${planned ? ' time-pill--active' : ''}`}
                    onClick={() => {
                      if (planned) {
                        const existing = plan.find(
                          (p) => p.movieId === movie.id && p.cinemaId === cinema.id && p.dayOffset === s.dayOffset && p.time === s.time
                        )
                        if (existing) removePlanItem(existing.id)
                      } else {
                        addPlanItem({ movieId: movie.id, cinemaId: cinema.id, dayOffset: s.dayOffset, time: s.time })
                      }
                    }}
                  >
                    {s.time}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        {groupedByCinema.length === 0 && <p className="eyebrow">No showtimes for this day.</p>}
      </div>

      <p className="movie-detail__hint eyebrow">Tap a showtime to add it to your Plan.</p>
    </div>
  )
}
