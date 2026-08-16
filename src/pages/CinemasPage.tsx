import { useMemo, useState } from 'react'
import { cinemas } from '../data'
import { PillGroup } from '../components/PillGroup'
import { MapIcon, ListIcon, StarIcon } from '../components/Icons'
import CinemaMap from '../components/CinemaMap'
import CinemaListItem from '../components/CinemaListItem'
import AccountButton from '../components/AccountButton'
import { useAppState } from '../state/AppState'
import './CinemasPage.css'

type View = 'map' | 'list' | 'favorites'

export default function CinemasPage() {
  const [view, setView] = useState<View>('map')
  const { favoriteCinemas } = useAppState()

  const visibleCinemas = useMemo(() => {
    if (view === 'favorites') return cinemas.filter((c) => favoriteCinemas.includes(c.id))
    return cinemas
  }, [view, favoriteCinemas])

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <div className="eyebrow">Berlin</div>
          <h1 className="heading page-title">Cinemas</h1>
        </div>
        <div className="page-header__actions">
          <AccountButton />
        </div>
      </header>
      <div className="page-body cinemas-body">
        <PillGroup
          options={[
            { value: 'map', label: 'Map', icon: <MapIcon /> },
            { value: 'list', label: 'List', icon: <ListIcon /> },
            { value: 'favorites', label: 'Favorites', icon: <StarIcon size={13} /> }
          ]}
          value={view}
          onChange={setView}
        />

        {view === 'map' && <CinemaMap cinemas={cinemas} />}

        {view !== 'map' && (
          <div className="cinemas-list">
            {visibleCinemas.map((cinema) => (
              <CinemaListItem key={cinema.id} cinema={cinema} />
            ))}
            {visibleCinemas.length === 0 && (
              <p className="eyebrow">No favorite cinemas yet. Tap the star on a cinema to save it here.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
