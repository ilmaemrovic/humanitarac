import React from 'react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>© {new Date().getFullYear()} Humanitarac — Svi prava zadržana</div>
        <div className="small">Kontakt: info@humanitarac.example</div>
      </div>
    </footer>
  )
}
