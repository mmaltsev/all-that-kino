import { useMemo, useState } from 'react'
import { cinemas } from '../data'
import { PillGroup } from '../components/PillGroup'
import { MapIcon, ListIcon, StarIcon } from '../components/Icons'
import CinemaMap from '../components/CinemaMap'
import CinemaListItem from '../components/CinemaListItem'
import AccountButton from '../components/AccountButton'
import { useAppState } from '../state/AppState'
import { useLanguage } from '../i18n/LanguageContext'
import './CinemasPage.css'

type View = 'map' | 'list' | 'favorites'

export default function CinemasPage() {
  const [view, setView] = useState<View>('map')
  const { favoriteCinemas } = useAppState()
  const { t } = useLanguage()

  const visibleCinemas = useMemo(() => {
    if (view === 'favorites') return cinemas.filter((c) => favoriteCinemas.includes(c.id))
    return cinemas
  }, [view, favoriteCinemas])

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <div className="eyebrow">Berlin</div>
          <h1 className="heading page-title">{t('cinemas.title')}</h1>
        </div>
        <div className="page-header__actions">
          <AccountButton />
        </div>
      </header>
      <div className="page-body cinemas-body">
        <PillGroup
          options={[
            { value: 'map', label: t('cinemas.map'), icon: <MapIcon /> },
            { value: 'list', label: t('cinemas.list'), icon: <ListIcon /> },
            { value: 'favorites', label: t('cinemas.favorites'), icon: <StarIcon size={13} /> }
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
            {visibleCinemas.length === 0 && <p className="eyebrow">{t('cinemas.emptyFavorites')}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
