import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStats, getActivities } from '../api/endpoints'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'
import ActivityCard from '../components/ActivityCard'

export default function Home() {
  const [stats, setStats] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    Promise.all([getStats(), getActivities({ limit: 3 })])
      .then(([s, acts]) => {
        if (!mounted) return
        setStats(s)
        setActivities(acts)
      })
      .catch((e) => setError(e.message || 'Greška pri učitavanju'))
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <Loader />
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />

  return (
    <main className="container">
      <section className="hero">
        <div className="hero-inner hero-split">
          <div className="hero-text">
            <h1>Podržimo zajednice zajedno</h1>
            <p className="lead">Pomažemo ljudima u kriznim momentima i gradimo održive lokalne inicijative.</p>
            <div className="hero-cta">
              <Link to="/donate" className="btn primary">
                Doniraj
              </Link>
              <Link to="/volunteer" className="btn outline">
                Pridruži se kao volonter
              </Link>
            </div>
          </div>
          <div className="hero-img">
            <img src="https://cim.org.rs/wp-content/uploads/2021/05/charity_754x556px-600x442-1.jpeg" alt="Humanitarni rad" />
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stats-grid">
          <div className="stat">
            <div className="num">{stats.actions}</div>
            <div className="label">Akcije</div>
          </div>
          <div className="stat">
            <div className="num">{stats.raised} KM</div>
            <div className="label">Prikupljeno</div>
          </div>
          <div className="stat">
            <div className="num">{stats.volunteers}</div>
            <div className="label">Volonteri</div>
          </div>
        </div>
      </section>

      <section className="latest">
        <h2>Najnovije aktivnosti</h2>
        <div className="grid">
          {activities.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
        <div className="more">
          <Link to="/activities" className="btn">
            Pogledaj više aktivnosti
          </Link>
        </div>
      </section>
    </main>
  )
}
