import moviesJson from './movies.json'
import cinemasJson from './cinemas.json'
import showtimesJson from './showtimes.json'
import type { Cinema, Movie, Showtime } from '../types'

export const movies = moviesJson as Movie[]
export const cinemas = cinemasJson as Cinema[]
export const showtimes = showtimesJson as Showtime[]

export function getMovie(id: string): Movie | undefined {
  return movies.find((m) => m.id === id)
}

export function getCinema(id: string): Cinema | undefined {
  return cinemas.find((c) => c.id === id)
}

export function showtimesForMovie(movieId: string): Showtime[] {
  return showtimes.filter((s) => s.movieId === movieId)
}

export function showtimesForCinema(cinemaId: string): Showtime[] {
  return showtimes.filter((s) => s.cinemaId === cinemaId)
}

export function moviesPlayingWithinDays(days: number): Movie[] {
  const ids = new Set(showtimes.filter((s) => s.dayOffset < days).map((s) => s.movieId))
  return movies.filter((m) => ids.has(m.id))
}

export function isMoviePlaying(movieId: string): boolean {
  return showtimes.some((s) => s.movieId === movieId)
}

export function cinemasShowingMovie(movieId: string): Cinema[] {
  const ids = new Set(showtimesForMovie(movieId).map((s) => s.cinemaId))
  return cinemas.filter((c) => ids.has(c.id))
}
