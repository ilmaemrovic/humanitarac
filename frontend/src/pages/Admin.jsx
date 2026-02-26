import React, { useEffect, useState } from 'react'
import { useAuth } from '../utils/AuthProvider'
import { createActivity, getActivities, updateActivity, deleteActivity, getParticipations, patchParticipation } from '../api/endpoints'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'
import ActivityForm from '../components/ActivityForm'

export default function Admin() {
  const auth = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [participations, setParticipations] = useState([])

  useEffect(() => {
    if (!auth?.token || auth.user?.role !== 'admin') return
    setLoading(true)
    Promise.all([getActivities(), getParticipations(auth.token)])
      .then(([acts, parts]) => {
        setActivities(acts)
        setParticipations(parts)
      })
      .catch((e) => setError(e.message || 'Greška'))
      .finally(() => setLoading(false))
  }, [auth])

  async function handleCreate(payload) {
    await createActivity({ ...payload, _token: auth.token })
    const acts = await getActivities()
    setActivities(acts)
    setEditing(null)
  }

  async function handleUpdate(id, payload) {
    await updateActivity(id, { ...payload, _token: auth.token })
    const acts = await getActivities()
    setActivities(acts)
    setEditing(null)
  }

  async function handleDelete(id) {
    if (!confirm('Obrisati aktivnost?')) return
    await deleteActivity(id, auth.token)
    setActivities((s) => s.filter((a) => a.id !== id))
  }

  async function refreshParticipations() {
    const parts = await getParticipations(auth.token)
    setParticipations(parts)
  }

  async function changeParticipationStatus(id, status) {
    await patchParticipation(id, { status, _token: auth.token })
    await refreshParticipations()
  }

  if (!auth?.token || auth.user?.role !== 'admin') return <ErrorState message={'Samo za administratore'} />
  if (loading) return <Loader />
  if (error) return <ErrorState message={error} />

  return (
    <main className="container">
      <h1>Admin — Upravljanje aktivnostima</h1>

      <section className="card">
        <h2>Dodaj novu aktivnost</h2>
        <ActivityForm onSubmit={handleCreate} />
      </section>

      <section>
        <h2>Postojeće aktivnosti</h2>
        <div className="grid">
          {activities.map((a) => (
            <div key={a.id} className="card">
              <h3>{a.title} {a.completed && <span className="tag">Završeno</span>}</h3>
              <div className="meta">{a.city} • {new Date(a.date).toLocaleDateString()}</div>
              <p>{a.description}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => setEditing(a)}>Izmijeni</button>
                <button className="btn" onClick={() => handleDelete(a.id)}>Obriši</button>
                <button className="btn" onClick={async () => { await updateActivity(a.id, { completed: !a.completed, _token: auth.token }); const acts = await getActivities(); setActivities(acts) }}>
                  {a.completed ? 'Označi aktivnom' : 'Označi završenom'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {editing && (
        <section className="card">
          <h2>Uredi aktivnost</h2>
          <ActivityForm initial={editing} onSubmit={(vals) => handleUpdate(editing.id, vals)} submitLabel={'Ažuriraj'} />
        </section>
      )}

      <section>
        <h2>Prijave za učešće</h2>
        <div className="grid">
          {participations.map((p) => (
            <div key={p.id} className="card">
              <div><strong>{p.userName}</strong> za aktivnost {p.activityId}</div>
              <div>{p.note}</div>
              <div>Status: {p.status}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => changeParticipationStatus(p.id, 'accepted')}>Prihvati</button>
                <button className="btn" onClick={() => changeParticipationStatus(p.id, 'rejected')}>Odbij</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
