import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthProvider'

export default function Navbar() {
  const { user, logout } = useAuth() || {}

  return (
    <header className="nav">
      <div className="container nav-inner">
        <div className="brand">Humanitarac</div>
        <nav>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Početna
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
            O nama
          </NavLink>
          <NavLink to="/activities" className={({ isActive }) => (isActive ? 'active' : '')}>
            Aktivnosti
          </NavLink>
          <NavLink to="/volunteer" className={({ isActive }) => (isActive ? 'active' : '')}>
            Volontiranje
          </NavLink>
          <NavLink to="/donate" className={({ isActive }) => (isActive ? 'cta active' : 'cta')}>
            Doniraj
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
            Kontakt
          </NavLink>

          {user && user.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
              Admin
            </NavLink>
          )}

          {!user ? (
            <>
              <Link to="/signin">Prijava</Link>
              <Link to="/register" className="btn">Registracija</Link>
            </>
          ) : (
            <>
              <span style={{ marginLeft: 10 }}>Zdravo, {user.name}</span>
              <button className="btn" onClick={() => logout()} style={{ marginLeft: 8 }}>
                Odjavi se
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
