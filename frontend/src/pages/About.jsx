import React from 'react'

export default function About() {
  return (
    <main className="container">
      <section className="about-hero">
        <h1>O nama</h1>
        <p className="lead">Humanitarac je nevladina organizacija posvećena pomoći zajednicama u potrebi.</p>
      </section>

      <section className="values">
        <h2>Naše vrijednosti</h2>
        <ul>
          <li>Empatija i dostojanstvo</li>
          <li>Transparentnost</li>
          <li>Održivost</li>
          <li>Uključivost</li>
        </ul>
      </section>

      <section className="impact">
        <h2>Naš uticaj</h2>
        <div className="timeline">
          <div className="timeline-item">
            <h3>2024</h3>
            <p>Provedeno 40 akcija pomoći u raznim gradovima.</p>
          </div>
          <div className="timeline-item">
            <h3>2023</h3>
            <p>Pokrenute edukativne kampanje i radionice za mlade.</p>
          </div>
          <div className="timeline-item">
            <h3>2022</h3>
            <p>Podrška nakon prirodnih nepogoda i hitnih situacija.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
