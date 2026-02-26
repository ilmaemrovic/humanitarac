import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthProvider'
import { validateEmail, validateRequired } from '../utils/validators'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  function handleChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }))
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateRequired(form.name) || !validateEmail(form.email) || !validateRequired(form.password)) {
      setError('Popunite sva polja ispravno')
      return
    }
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Greška pri registraciji')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <h1>Registracija</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Ime
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
        <label>
          Email
          <input name="email" value={form.email} onChange={handleChange} />
        </label>
        <label>
          Lozinka
          <input type="password" name="password" value={form.password} onChange={handleChange} />
        </label>
        <div className="form-actions">
          <button className="btn primary" type="submit" disabled={loading}>{loading ? '...' : 'Kreiraj nalog'}</button>
        </div>
        {error && <div className="toast error">{error}</div>}
      </form>
    </main>
  )
}
