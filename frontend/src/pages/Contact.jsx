import React, { useState } from 'react'
import { postContact } from '../api/endpoints'
import { validateEmail, validateRequired } from '../utils/validators'
import Loader from '../components/Loader'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
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
    if (!validateRequired(form.message)) errs.message = 'Poruka je obavezna.'
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
      await postContact({ name: form.name, email: form.email, message: form.message })
      setSuccess('Hvala! Vaša poruka je poslana. Odgovorićemo Vam u najkraćem roku.')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setError(err.message || 'Greška pri slanju poruke')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <h1>Kontakt</h1>
      <p className="lead">Imate pitanje ili predlog? Pišite nam direktno.</p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <label>
          Ime i prezime
          <input name="name" value={form.name} onChange={handleChange} placeholder="Vaše ime" />
          {errors.name && <div className="field-error">{errors.name}</div>}
        </label>

        <label>
          Email adresa
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="vas@email.com" />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </label>

        <label>
          Poruka
          <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Vaša poruka..." />
          {errors.message && <div className="field-error">{errors.message}</div>}
        </label>

        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? <Loader small /> : 'Pošalji poruku'}
          </button>
        </div>

        {success && <div className="toast success">{success}</div>}
        {error && <div className="toast error">{error}</div>}
      </form>

      <section style={{ marginTop: '2rem' }}>
        <h2>Drugi načini kontakta</h2>
        <div className="card">
          <p><strong>Email:</strong> info@humanitarac.org</p>
          <p><strong>Telefon:</strong> +381 11 123 4567</p>
          <p><strong>Adresa:</strong> Beograd, Srbija</p>
          <p><strong>Radno vreme:</strong> Pon - Pet, 09:00 - 17:00</p>
        </div>
      </section>
    </main>
  )
}
