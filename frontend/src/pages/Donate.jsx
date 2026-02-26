import React, { useState } from 'react'
import { postDonation } from '../api/endpoints'
import { validateEmail, validateRequired, validateAmount } from '../utils/validators'
import Loader from '../components/Loader'
import { useAuth } from '../utils/AuthProvider'

export default function Donate() {
  const [form, setForm] = useState({ name: '', email: '', amount: '', method: 'card', message: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
    setErrors((e2) => ({ ...e2, [name]: undefined }))
  }

  function validate() {
    const errs = {}
    if (!validateRequired(form.name)) errs.name = 'Ime je obavezno.'
    if (!validateEmail(form.email)) errs.email = 'Nevažeći email.'
    if (!validateAmount(form.amount)) errs.amount = 'Unesite iznos veći od 0.'
    if (!validateRequired(form.method)) errs.method = 'Odaberite način plaćanja.'
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
      // require authenticated user
      if (!auth?.token) throw new Error('Morate biti prijavljeni da biste donirali.')
      await postDonation({ name: form.name, email: form.email, amount: Number(form.amount), method: form.method, message: form.message, _token: auth.token })
      setSuccess('Hvala! Donacija je evidentirana.')
      setForm({ name: '', email: '', amount: '', method: 'card', message: '' })
    } catch (err) {
      setError(err.message || 'Greška pri slanju donacije')
    } finally {
      setLoading(false)
    }
  }

  const auth = useAuth()

  return (
    <main className="container">
      <h1>Doniraj</h1>
      <p className="lead">Podržite naše akcije sigurnom donacijom.</p>

      {!auth?.token ? (
        <div className="card">
          <p>Morate se prijaviti da biste donirali.</p>
          <a href="/signin" className="btn primary">Prijavi se</a>
        </div>
      ) : (
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
          Iznos (KM)
          <input name="amount" value={form.amount} onChange={handleChange} type="number" min="1" />
          {errors.amount && <div className="field-error">{errors.amount}</div>}
        </label>

        <label>
          Način plaćanja
          <select name="method" value={form.method} onChange={handleChange}>
            <option value="card">Kartica</option>
            <option value="bank">Bankovni transfer</option>
            <option value="cash">Gotovina</option>
          </select>
          {errors.method && <div className="field-error">{errors.method}</div>}
        </label>

        <label>
          Poruka (opcionalno)
          <textarea name="message" value={form.message} onChange={handleChange} />
        </label>

          <div className="form-actions">
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? <Loader small /> : 'Doniraj sada'}
            </button>
          </div>

          {success && <div className="toast success">{success}</div>}
          {error && <div className="toast error">{error}</div>}
        </form>
      )}
    </main>
  )
}
