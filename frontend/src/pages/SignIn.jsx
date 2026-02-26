import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthProvider'
import { validateEmail, validateRequired } from '../utils/validators'

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }))
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateEmail(form.email) || !validateRequired(form.password)) {
      setError('Unesite validne kredencijale')
      return
    }
    setLoading(true)
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Greška pri prijavi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <h1>Prijava</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" value={form.email} onChange={handleChange} />
        </label>
        <label>
          Lozinka
          <input type="password" name="password" value={form.password} onChange={handleChange} />
        </label>
        <div className="form-actions">
          <button className="btn primary" type="submit" disabled={loading}>{loading ? '...' : 'Prijavi se'}</button>
        </div>
        {error && <div className="toast error">{error}</div>}
      </form>
    </main>
  )
}
