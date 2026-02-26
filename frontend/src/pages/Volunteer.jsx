import React, { useState } from 'react'
import { postVolunteer } from '../api/endpoints'
import { useAuth } from '../utils/AuthProvider'
import { validateEmail, validateRequired } from '../utils/validators'
import Loader from '../components/Loader'

export default function Volunteer() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', interests: [], availability: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const auth = useAuth()

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    if (name === 'interests') {
      // simple comma-separated interests
      setForm((s) => ({ ...s, interests: value.split(',').map((x) => x.trim()).filter(Boolean) }))
    } else {
      setForm((s) => ({ ...s, [name]: value }))
    }
    setErrors((e2) => ({ ...e2, [name]: undefined }))
  }

  function validate() {
    const errs = {}
    if (!validateRequired(form.name)) errs.name = 'Ime je obavezno.'
    if (!validateEmail(form.email)) errs.email = 'Nevažeći email.'
    if (!validateRequired(form.phone)) errs.phone = 'Telefon je obavezan.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSuccess(null)
    setError(null)
    if (!validate()) return
    setLoading(true)
    try {
      // include token when available
      const payload = { ...form }
      if (auth && auth.token) payload._token = auth.token
      await postVolunteer(payload)
      setSuccess('Hvala! Prijava je poslana.')
      setForm({ name: '', email: '', phone: '', interests: [], availability: '' })
    } catch (err) {
      setError(err.message || 'Greška pri slanju prijave')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <h1>Volontiranje</h1>
      <p className="lead">Pridruži nam se i pomoz lokalnoj zajednici.</p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <label>
          Ime
          <input name="name" value={form.name} onChange={handleChange} />
          {errors.name && <div className="field-error">{errors.name}</div>}
        </label>

        <label>
          Email
          <input name="email" value={form.email} onChange={handleChange} />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </label>

        <label>
          Telefon
          <input name="phone" value={form.phone} onChange={handleChange} />
          {errors.phone && <div className="field-error">{errors.phone}</div>}
        </label>

        <label>
          Interesovanja (odvojite zarezom)
          <input name="interests" value={form.interests.join(', ')} onChange={handleChange} />
        </label>

        <label>
          Dostupnost
          <select name="availability" value={form.availability} onChange={handleChange}>
            <option value="">Odaberite</option>
            <option value="weekdays">Radni dani</option>
            <option value="weekends">Vikendi</option>
            <option value="flexible">Fleksibilno</option>
          </select>
        </label>

        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? <Loader small /> : 'Pošalji prijavu'}
          </button>
        </div>

        {success && <div className="toast success">{success}</div>}
        {error && <div className="toast error">{error}</div>}
      </form>
    </main>
  )
}
