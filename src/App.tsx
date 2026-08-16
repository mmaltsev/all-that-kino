import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppStateProvider } from './state/AppState'
import { AuthProvider } from './state/AuthContext'
import BottomNav from './components/BottomNav'
import MoviesPage from './pages/MoviesPage'
import CinemasPage from './pages/CinemasPage'
import MovieDetailPage from './pages/MovieDetailPage'
import WatchlistPage from './pages/WatchlistPage'
import LetterboxdConnectPage from './pages/LetterboxdConnectPage'
import AccountPage from './pages/AccountPage'

export default function App() {
  const location = useLocation()
  const hideNav =
    location.pathname.startsWith('/movie/') ||
    location.pathname.startsWith('/letterboxd') ||
    location.pathname.startsWith('/account')

  return (
    <AuthProvider>
      <AppStateProvider>
        <div className="app-shell">
          <Routes>
            <Route path="/" element={<Navigate to="/movies" replace />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/cinemas" element={<CinemasPage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/letterboxd" element={<LetterboxdConnectPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="*" element={<Navigate to="/movies" replace />} />
          </Routes>
        </div>
        {!hideNav && <BottomNav />}
      </AppStateProvider>
    </AuthProvider>
  )
}
