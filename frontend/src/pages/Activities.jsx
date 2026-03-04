import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getActivities } from '../api/endpoints'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'
import ActivityCard from '../components/ActivityCard'

export default function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('Sve')
  const [city, setCity] = useState('Sve')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getActivities()
      .then((data) => mounted && setActivities(data))
      .catch((e) => mounted && setError(e.message || 'Greška pri učitavanju'))
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [])

  const categories = useMemo(() => ['Sve', ...Array.from(new Set(activities.map((a) => a.category)))], [activities])
  const cities = useMemo(() => ['Sve', ...Array.from(new Set(activities.map((a) => a.city)))], [activities])

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      if (category !== 'Sve' && a.category !== category) return false
      if (city !== 'Sve' && a.city !== city) return false
      if (query && !a.title.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [activities, category, city, query])

  if (loading) return <Loader />
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />

  return (
    <main className="container">
      <h1>Aktivnosti</h1>

      <div className="filters">
        <label>
          Pretraži
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pretraga po naslovu" />
        </label>
        <label>
          Kategorija
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Grad
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid">
        {filtered.length === 0 && <div>Nema rezultata.</div>}
        {filtered.map((a) => (
          <Link key={a.id} to={`/activities/${a.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ActivityCard activity={a} />
          </Link>
        ))}
      </div>
    </main>
  )
}
