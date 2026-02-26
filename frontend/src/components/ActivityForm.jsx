import React, { useState } from 'react'

export default function ActivityForm({ initial = {}, onSubmit, submitLabel = 'Sačuvaj' }) {
  const [form, setForm] = useState({ title: '', date: '', city: '', category: '', description: '', ...initial })

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(form)
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
        <button className="btn primary" type="submit">{submitLabel}</button>
      </div>
    </form>
  )
}
