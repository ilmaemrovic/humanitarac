import React, { useState } from 'react'
import { validateRequired } from '../utils/validators'

const EMPTY_FORM = { title: '', date: '', city: '', category: '', description: '' }

export default function ActivityForm({ initial, onSubmit, submitLabel = 'Sačuvaj' }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial })
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateRequired(form.title) || !validateRequired(form.date) || !validateRequired(form.city) || !validateRequired(form.category)) {
      setError('Naziv, datum, grad i kategorija su obavezni.')
      return
    }
    setSaving(true)
    try {
      await onSubmit(form)
      if (!initial) setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.message || 'Greška pri čuvanju aktivnosti')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Naziv
        <input name="title" value={form.title} onChange={handleChange} />
      </label>
      <label>
        Datum
        <input name="date" type="date" value={form.date ? form.date.split('T')[0] : ''} onChange={handleChange} />
      </label>
      <label>
        Grad
        <input name="city" value={form.city} onChange={handleChange} />
      </label>
      <label>
        Kategorija
        <input name="category" value={form.category} onChange={handleChange} />
      </label>
      <label>
        Opis
        <textarea name="description" value={form.description} onChange={handleChange} />
      </label>
      <div className="form-actions">
        <button className="btn primary" type="submit" disabled={saving}>{saving ? '...' : submitLabel}</button>
      </div>
      {error && <div className="toast error">{error}</div>}
    </form>
  )
}
