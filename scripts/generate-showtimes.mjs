// Deterministically generates dummy showtimes.json from movies.json + cinemas.json.
// dayOffset is relative to "today" (0 = today .. 6 = six days out) so the data
// never goes stale — the app resolves dayOffset to a real calendar date at runtime.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', 'src', 'data')

const movies = JSON.parse(readFileSync(join(dataDir, 'movies.json'), 'utf-8'))
const cinemas = JSON.parse(readFileSync(join(dataDir, 'cinemas.json'), 'utf-8'))

function hashSeed(str) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

const TIME_POOL = ['13:00', '14:00', '15:30', '16:00', '17:30', '18:00', '18:30', '19:00', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30']

const showtimes = []
let idCounter = 1

for (const movie of movies) {
  const rand = hashSeed(movie.id)
  const cinemaCount = 2 + Math.floor(rand() * 4) // 2-5 cinemas
  const shuffled = [...cinemas].sort(() => rand() - 0.5)
  const pickedCinemas = shuffled.slice(0, cinemaCount)

  for (const cinema of pickedCinemas) {
    const cinemaRand = hashSeed(movie.id + cinema.id)
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      // most movies skip a day here and there rather than running every single day
      if (cinemaRand() < 0.22) continue
      const showsPerDay = 1 + Math.floor(cinemaRand() * 3) // 1-3 showings
      const times = [...TIME_POOL].sort(() => cinemaRand() - 0.5).slice(0, showsPerDay).sort()
      for (const time of times) {
        showtimes.push({
          id: `st-${idCounter++}`,
          movieId: movie.id,
          cinemaId: cinema.id,
          dayOffset,
          time
        })
      }
    }
  }
}

writeFileSync(join(dataDir, 'showtimes.json'), JSON.stringify(showtimes, null, 2) + '\n')
console.log(`Generated ${showtimes.length} showtimes for ${movies.length} movies across ${cinemas.length} cinemas.`)
