export interface Movie {
  id: string
  title: string
  director: string
  year: number
  runtimeMinutes: number
  genres: string[]
  country: string
  synopsis: string
  backdropColor: string
}

export interface Cinema {
  id: string
  name: string
  chain: string
  neighborhood: string
  address: string
  lat: number
  lng: number
  mapX: number
  mapY: number
}

export interface Showtime {
  id: string
  movieId: string
  cinemaId: string
  dayOffset: number
  time: string
}

export interface LetterboxdCatalogEntry {
  title: string
  director: string
  year: number
}

export interface WatchlistEntry {
  title: string
  director: string
  year: number
  movieId: string | null
}

export interface PlanItem {
  id: string
  movieId: string
  cinemaId: string
  dayOffset: number
  time: string
  addedAt: string
}
