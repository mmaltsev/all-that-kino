import { NavLink } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import './BottomNav.css'

const items = [
  { to: '/movies', labelKey: 'nav.movies' as const, icon: FilmIcon },
  { to: '/cinemas', labelKey: 'nav.cinemas' as const, icon: PinIcon },
  { to: '/watchlist', labelKey: 'nav.watchlist' as const, icon: BookmarkIcon }
]

export default function BottomNav() {
  const { t } = useLanguage()
  return (
    <nav className="bottom-nav">
      {items.map(({ to, labelKey, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`}>
          <Icon />
          <span>{t(labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  )
}

function FilmIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3v18M16 3v18M3 9h5M16 9h5M3 15h5M16 15h5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 3h12v18l-6-4.5L6 21V3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}
