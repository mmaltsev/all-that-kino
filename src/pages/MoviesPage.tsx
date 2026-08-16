import { useMemo, useState } from 'react'
import { movies, showtimes } from '../data'
import MovieCard from '../components/MovieCard'
import { PillGroup } from '../components/PillGroup'
import AccountButton from '../components/AccountButton'
import { BellIcon, CalendarIcon, SlidersIcon } from '../components/Icons'
import { useLanguage } from '../i18n/LanguageContext'
import './MoviesPage.css'

type Filter = 'week' | 'all'

export default function MoviesPage() {
  const [filter, setFilter] = useState<Filter>('week')
  const { t } = useLanguage()

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
          <h1 className="heading page-title">{t('movies.title')}</h1>
        </div>
        <div className="page-header__actions">
          <button className="icon-button" aria-label={t('movies.notifications')}>
            <BellIcon />
          </button>
          <AccountButton />
        </div>
      </header>
      <div className="page-body">
        <PillGroup
          options={[
            { value: 'week', label: t('movies.thisWeek'), icon: <CalendarIcon /> },
            { value: 'all', label: t('movies.all'), icon: <SlidersIcon /> }
          ]}
          value={filter}
          onChange={setFilter}
        />
        <div className="movies-list">
          {visibleMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
          {visibleMovies.length === 0 && <p className="eyebrow">{t('movies.empty')}</p>}
        </div>
      </div>
    </div>
  )
}
