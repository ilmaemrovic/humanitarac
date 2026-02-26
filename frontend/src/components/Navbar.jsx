import React, { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../utils/AuthProvider'

export default function Navbar() {
  const { user, logout } = useAuth() || {}
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  return (
    <header className="nav">
      <div className="container nav-inner">
        <div className="brand">Humanitarac</div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
        </button>

        <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
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

          {user && user.role?.toLowerCase() === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
              Admin
            </NavLink>
          )}

          {!user ? (
            <div className="nav-auth">
              <Link to="/signin">Prijava</Link>
              <Link to="/register" className="btn">Registracija</Link>
            </div>
          ) : (
            <div className="nav-auth">
              <span className="nav-greeting">Zdravo, {user.name}</span>
              <button className="btn" onClick={() => logout()}>
                Odjavi se
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
