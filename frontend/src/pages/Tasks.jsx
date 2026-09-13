import React, { useEffect, useState } from 'react'
import { useAuth } from '../utils/AuthProvider'
import { getTasks, createTask, updateTask, deleteTask } from '../api/endpoints'
import Loader from '../components/Loader'

const PRIORITY_LABELS = { high: 'Visok', medium: 'Srednji', low: 'Nizak' }
const STATUS_LABELS = { todo: 'Za uraditi', 'in-progress': 'U toku', done: 'Završeno' }
const PRIORITY_COLORS = { high: '#e74c3c', medium: '#f39c12', low: '#27ae60' }

export default function Tasks() {
  const auth = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [toast, setToast] = useState(null)

  // Form state
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' })

  useEffect(() => {
    if (!auth?.token) return
    loadTasks()
  }, [auth?.token])

  async function loadTasks() {
    try {
      setLoading(true)
      const res = await getTasks(auth.token)
      setTasks(Array.isArray(res?.tasks) ? res.tasks : Array.isArray(res) ? res : [])
    } catch (e) {
      showToast('Greška pri učitavanju taskova', 'error')
    } finally {
      setLoading(false)
    }
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function resetForm() {
    setForm({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' })
    setEditingTask(null)
    setShowForm(false)
  }

  function startEdit(task) {
    setForm({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    })
    setEditingTask(task)
    setShowForm(true)
  }

  function startNew() {
    resetForm()
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return showToast('Naslov je obavezan', 'error')

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
      clearDueDate: !form.dueDate,
      _token: auth.token,
    }

    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload)
        showToast('Task ažuriran!')
      } else {
        await createTask(payload)
        showToast('Task kreiran!')
      }
      resetForm()
      await loadTasks()
    } catch (e) {
      showToast(e.message || 'Greška', 'error')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Obrisati task?')) return
    try {
      await deleteTask(id, auth.token)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      showToast('Task obrisan')
    } catch (e) {
      showToast('Greška pri brisanju', 'error')
    }
  }

  async function handleStatusChange(task, newStatus) {
    try {
      await updateTask(task.id, { status: newStatus, _token: auth.token })
      await loadTasks()
    } catch (e) {
      showToast('Greška pri promjeni statusa', 'error')
    }
  }

  // Auth guard
  if (!auth?.token) {
    return (
      <main className="container">
        <div className="tasks-auth-guard">
          <h2>Moji zadaci</h2>
          <p>Morate biti prijavljeni da biste vidjeli svoje zadatke.</p>
          <a href="/signin" className="btn primary">Prijavi se</a>
        </div>
      </main>
    )
  }

  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)
  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  }

  return (
    <main className="container tasks-page">
      <div className="tasks-header">
        <div>
          <h1>Moji zadaci</h1>
          <p className="lead">Upravljajte svojim zadacima i pratite napredak</p>
        </div>
        <button className="btn primary" onClick={startNew}>+ Novi zadatak</button>
      </div>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      {/* Summary cards */}
      <div className="tasks-summary">
        <div className="tasks-stat" style={{ borderLeftColor: 'var(--primary)' }}>
          <span className="num">{counts.all}</span>
          <span className="label">Ukupno</span>
        </div>
        <div className="tasks-stat" style={{ borderLeftColor: '#3498db' }}>
          <span className="num">{counts.todo}</span>
          <span className="label">Za uraditi</span>
        </div>
        <div className="tasks-stat" style={{ borderLeftColor: '#f39c12' }}>
          <span className="num">{counts['in-progress']}</span>
          <span className="label">U toku</span>
        </div>
        <div className="tasks-stat" style={{ borderLeftColor: '#27ae60' }}>
          <span className="num">{counts.done}</span>
          <span className="label">Završeno</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="tasks-filters">
        {['all', 'todo', 'in-progress', 'done'].map((f) => (
          <button
            key={f}
            className={`tasks-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Svi' : STATUS_LABELS[f]} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Task form modal */}
      {showForm && (
        <div className="tasks-form-overlay" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="tasks-form-modal card">
            <h2>{editingTask ? 'Izmijeni zadatak' : 'Novi zadatak'}</h2>
            <form className="form" onSubmit={handleSubmit}>
              <label>
                Naslov *
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Unesite naslov zadatka"
                  autoFocus
                />
              </label>
              <label>
                Opis
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Opišite zadatak..."
                  rows={3}
                />
              </label>
              <div className="tasks-form-row">
                <label>
                  Status
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="todo">Za uraditi</option>
                    <option value="in-progress">U toku</option>
                    <option value="done">Završeno</option>
                  </select>
                </label>
                <label>
                  Prioritet
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    <option value="high">Visok</option>
                    <option value="medium">Srednji</option>
                    <option value="low">Nizak</option>
                  </select>
                </label>
                <label>
                  Rok
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                </label>
              </div>
              <div className="tasks-form-actions">
                <button type="submit" className="btn primary">
                  {editingTask ? 'Sačuvaj izmjene' : 'Kreiraj zadatak'}
                </button>
                <button type="button" className="btn outline" onClick={resetForm}>Otkaži</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task list */}
      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <div className="tasks-empty">
          <p>{filter === 'all' ? 'Nemate još zadataka. Kreirajte prvi!' : 'Nema zadataka u ovoj kategoriji.'}</p>
        </div>
      ) : (
        <div className="tasks-list">
          {filtered.map((task) => (
            <div key={task.id} className={`tasks-card card ${task.status === 'done' ? 'tasks-done' : ''}`}>
              <div className="tasks-card-top">
                <div className="tasks-card-priority" style={{ background: PRIORITY_COLORS[task.priority] || '#999' }}>
                  {PRIORITY_LABELS[task.priority] || task.priority}
                </div>
                <div className="tasks-card-status">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                    className="tasks-status-select"
                  >
                    <option value="todo">Za uraditi</option>
                    <option value="in-progress">U toku</option>
                    <option value="done">Završeno</option>
                  </select>
                </div>
              </div>

              <h3 className={task.status === 'done' ? 'tasks-title-done' : ''}>{task.title}</h3>
              {task.description && <p className="tasks-desc">{task.description}</p>}

              <div className="tasks-card-meta">
                {task.dueDate && (
                  <span className="tasks-due">
                    Rok: {new Date(task.dueDate).toLocaleDateString('bs-BA')}
                  </span>
                )}
                <span className="tasks-created">
                  Kreirano: {new Date(task.createdAt).toLocaleDateString('bs-BA')}
                </span>
              </div>

              <div className="tasks-card-actions">
                <button className="btn" onClick={() => startEdit(task)}>Izmijeni</button>
                <button className="btn" onClick={() => handleDelete(task.id)}>Obriši</button>
                {task.status !== 'done' && (
                  <button className="btn primary" onClick={() => handleStatusChange(task, 'done')}>
                    Završi
                  </button>
                )}
                {task.status === 'done' && (
                  <button className="btn outline" onClick={() => handleStatusChange(task, 'todo')}>
                    Vrati
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
