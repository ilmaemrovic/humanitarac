import React, { useEffect, useState } from 'react'
import { useAuth } from '../utils/AuthProvider'
import { createActivity, getActivities, updateActivity, deleteActivity, getParticipations, patchParticipation, getContacts, getVolunteers, patchVolunteer } from '../api/endpoints'
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
  const [contacts, setContacts] = useState([])
  const [volunteers, setVolunteers] = useState([])

  useEffect(() => {
    if (!auth?.token || auth.user?.role?.toLowerCase() !== 'admin') return
    setLoading(true)
    Promise.all([getActivities(), getParticipations(auth.token), getContacts(auth.token), getVolunteers(auth.token)])
      .then(([acts, parts, msgs, vols]) => {
        setActivities(acts)
        setParticipations(parts)
        setContacts(Array.isArray(msgs) ? msgs : [])
        setVolunteers(Array.isArray(vols) ? vols : [])
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

  async function changeVolunteerStatus(id, status) {
    await patchVolunteer(id, { status, _token: auth.token })
    const vols = await getVolunteers(auth.token)
    setVolunteers(Array.isArray(vols) ? vols : [])
  }

  if (!auth?.token || auth.user?.role?.toLowerCase() !== 'admin') return <ErrorState message={'Samo za administratore'} />
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
              <div className="admin-actions">
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
              <div className="admin-actions">
                <button className="btn" onClick={() => changeParticipationStatus(p.id, 'accepted')}>Prihvati</button>
                <button className="btn" onClick={() => changeParticipationStatus(p.id, 'rejected')}>Odbij</button>
              </div>
            </div>
          ))}
          {participations.length === 0 && <p>Nema prijava za učešće.</p>}
        </div>
      </section>

      <section>
        <h2>Prijave za volontiranje</h2>
        <div className="grid">
          {volunteers.map((v) => (
            <div key={v.id} className="card">
              <h3>{v.name}</h3>
              <div><strong>Email:</strong> {v.email}</div>
              <div><strong>Telefon:</strong> {v.phone}</div>
              <div><strong>Interesi:</strong> {v.interests}</div>
              <div><strong>Dostupnost:</strong> {v.availability}</div>
              <div><strong>Status:</strong> {v.status === 'pending' ? 'Na čekanju' : v.status === 'accepted' ? 'Prihvaćen' : 'Odbijen'}</div>
              <div className="meta">Prijavljeno: {new Date(v.createdAt).toLocaleDateString()}</div>
              {v.status === 'pending' && (
                <div className="admin-actions">
                  <button className="btn" onClick={() => changeVolunteerStatus(v.id, 'accepted')}>Prihvati</button>
                  <button className="btn" onClick={() => changeVolunteerStatus(v.id, 'rejected')}>Odbij</button>
                </div>
              )}
            </div>
          ))}
          {volunteers.length === 0 && <p>Nema prijava za volontiranje.</p>}
        </div>
      </section>

      <section>
        <h2>Kontakt poruke</h2>
        <div className="grid">
          {contacts.map((c) => (
            <div key={c.id} className="card">
              <h3>{c.name}</h3>
              <div><strong>Email:</strong> {c.email}</div>
              <p>{c.message}</p>
              <div className="meta">{new Date(c.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
          {contacts.length === 0 && <p>Nema kontakt poruka.</p>}
        </div>
      </section>
    </main>
  )
}
