import React, { createContext, useCallback, useContext, useMemo } from 'react'
import moviesData from '../data/movies.json'
import letterboxdCatalog from '../data/letterboxdCatalog.json'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import { shuffleWithSeed } from '../utils/seededRandom'
import type { Movie, PlanItem, WatchlistEntry } from '../types'

const movies = moviesData as Movie[]

interface LetterboxdConnection {
  username: string
  importedAt: string
  catalogOnlyTitles: WatchlistEntry[]
}

interface AppStateValue {
  watchlist: string[]
  isWatchlisted: (movieId: string) => boolean
  toggleWatchlist: (movieId: string) => void

  favoriteCinemas: string[]
  isFavoriteCinema: (cinemaId: string) => boolean
  toggleFavoriteCinema: (cinemaId: string) => void

  plan: PlanItem[]
  addPlanItem: (item: Omit<PlanItem, 'id' | 'addedAt'>) => void
  removePlanItem: (id: string) => void
  isPlanned: (movieId: string, cinemaId: string, dayOffset: number, time: string) => boolean

  letterboxd: LetterboxdConnection | null
  importLetterboxdWatchlist: (username: string) => void
  disconnectLetterboxd: () => void
  watchlistEntries: WatchlistEntry[]
}

const AppStateContext = createContext<AppStateValue | null>(null)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useLocalStorageState<string[]>('paradiso.watchlist', [])
  const [favoriteCinemas, setFavoriteCinemas] = useLocalStorageState<string[]>('paradiso.favoriteCinemas', [])
  const [plan, setPlan] = useLocalStorageState<PlanItem[]>('paradiso.plan', [])
  const [letterboxd, setLetterboxd] = useLocalStorageState<LetterboxdConnection | null>('paradiso.letterboxd', null)

  const isWatchlisted = useCallback((movieId: string) => watchlist.includes(movieId), [watchlist])

  const toggleWatchlist = useCallback((movieId: string) => {
    setWatchlist((prev) => (prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]))
  }, [setWatchlist])

  const isFavoriteCinema = useCallback((cinemaId: string) => favoriteCinemas.includes(cinemaId), [favoriteCinemas])

  const toggleFavoriteCinema = useCallback((cinemaId: string) => {
    setFavoriteCinemas((prev) => (prev.includes(cinemaId) ? prev.filter((id) => id !== cinemaId) : [...prev, cinemaId]))
  }, [setFavoriteCinemas])

  const addPlanItem = useCallback((item: Omit<PlanItem, 'id' | 'addedAt'>) => {
    setPlan((prev) => [
      ...prev,
      { ...item, id: `plan-${Date.now()}-${Math.floor(Math.random() * 1000)}`, addedAt: new Date().toISOString() }
    ])
  }, [setPlan])

  const removePlanItem = useCallback((id: string) => {
    setPlan((prev) => prev.filter((p) => p.id !== id))
  }, [setPlan])

  const isPlanned = useCallback(
    (movieId: string, cinemaId: string, dayOffset: number, time: string) =>
      plan.some((p) => p.movieId === movieId && p.cinemaId === cinemaId && p.dayOffset === dayOffset && p.time === time),
    [plan]
  )

  const importLetterboxdWatchlist = useCallback((username: string) => {
    const clean = username.replace(/^@/, '').trim()
    if (!clean) return
    const rand = shuffleWithSeed(movies, clean)
    const matchedCount = 4 + (clean.length % 5) // 4-8 local matches, deterministic per username
    const matched = rand.slice(0, matchedCount)
    const catalogShuffled = shuffleWithSeed(letterboxdCatalog as WatchlistEntry[], clean + '-catalog')
    const catalogCount = 3 + (clean.length % 4)
    const catalogOnly = catalogShuffled.slice(0, catalogCount).map((c) => ({ ...c, movieId: null }))

    setLetterboxd({ username: clean, importedAt: new Date().toISOString(), catalogOnlyTitles: catalogOnly })
    setWatchlist((prev) => Array.from(new Set([...prev, ...matched.map((m) => m.id)])))
  }, [setLetterboxd, setWatchlist])

  const disconnectLetterboxd = useCallback(() => {
    setLetterboxd(null)
  }, [setLetterboxd])

  const watchlistEntries = useMemo<WatchlistEntry[]>(() => {
    const fromMovies: WatchlistEntry[] = watchlist
      .map((id) => movies.find((m) => m.id === id))
      .filter((m): m is Movie => Boolean(m))
      .map((m) => ({ title: m.title, director: m.director, year: m.year, movieId: m.id }))
    const catalogOnly = letterboxd?.catalogOnlyTitles ?? []
    return [...fromMovies, ...catalogOnly]
  }, [watchlist, letterboxd])

  const value: AppStateValue = {
    watchlist,
    isWatchlisted,
    toggleWatchlist,
    favoriteCinemas,
    isFavoriteCinema,
    toggleFavoriteCinema,
    plan,
    addPlanItem,
    removePlanItem,
    isPlanned,
    letterboxd,
    importLetterboxdWatchlist,
    disconnectLetterboxd,
    watchlistEntries
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
