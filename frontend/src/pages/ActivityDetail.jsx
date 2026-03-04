import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getActivities, joinActivity } from '../api/endpoints'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'
import { useAuth } from '../utils/AuthProvider'
import { getActivityImage } from '../utils/activityImages'

export default function ActivityDetail() {
  const { id } = useParams()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)
  const auth = useAuth()

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getActivities()
      .then((acts) => {
        const a = acts.find((x) => x.id === id)
        if (!a) throw new Error('Ne postoji aktivnost')
        if (mounted) setActivity(a)
      })
      .catch((e) => mounted && setError(e.message || 'Greška'))
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [id])

  async function handleJoin() {
    if (!auth?.token) return setError('Morate biti prijavljeni da se prijavite za učešće')
    setJoining(true)
    try {
      await joinActivity(id, { note: '', _token: auth.token })
      setJoined(true)
    } catch (err) {
      setError(err.message || 'Greška pri prijavi')
    } finally {
      setJoining(false)
    }
  }

  if (loading) return <Loader />
  if (error) return <ErrorState message={error} />

  return (
    <main className="container">
      <div className="detail-hero">
        <img src={getActivityImage(activity)} alt={activity.title} className="detail-hero-img" />
      </div>
      <h1>{activity.title} {activity.completed && <span className="tag">Završeno</span>}</h1>
      <div className="meta">{activity.city} • {new Date(activity.date).toLocaleDateString()}</div>
      <p>{activity.description}</p>

      {!joined ? (
        <div>
          {activity.completed ? <div>Ova akcija je završena.</div> : (
            <>
              {auth?.token ? (
                <button className="btn primary" onClick={handleJoin} disabled={joining}>{joining ? '...' : 'Prijavi se za učešće'}</button>
              ) : (
                <div className="card">Morate se <a href="/signin">prijaviti</a> da biste se prijavili za učešće.</div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="toast success">Prijava poslana.</div>
      )}
    </main>
  )
}
