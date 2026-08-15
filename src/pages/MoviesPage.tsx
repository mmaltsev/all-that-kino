import { useMemo, useState } from 'react'
import { movies, showtimes } from '../data'
import MovieCard from '../components/MovieCard'
import { PillGroup } from '../components/PillGroup'
import { BellIcon, CalendarIcon, SlidersIcon } from '../components/Icons'
import './MoviesPage.css'

type Filter = 'week' | 'all'

export default function MoviesPage() {
  const [filter, setFilter] = useState<Filter>('week')

  const visibleMovies = useMemo(() => {
    if (filter === 'all') return movies
    const idsThisWeek = new Set(showtimes.filter((s) => s.dayOffset < 7).map((s) => s.movieId))
    return movies.filter((m) => idsThisWeek.has(m.id))
  }, [filter])

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <div className="eyebrow">Berlin</div>
          <h1 className="heading page-title">Movies</h1>
        </div>
        <button className="icon-button" aria-label="Notifications">
          <BellIcon />
        </button>
      </header>
      <div className="page-body">
        <PillGroup
          options={[
            { value: 'week', label: 'This Week', icon: <CalendarIcon /> },
            { value: 'all', label: 'All', icon: <SlidersIcon /> }
          ]}
          value={filter}
          onChange={setFilter}
        />
        <div className="movies-list">
          {visibleMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
          {visibleMovies.length === 0 && <p className="eyebrow">No movies playing right now.</p>}
        </div>
      </div>
    </div>
  )
}
