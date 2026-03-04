import React from 'react'

export default function About() {
  return (
    <main className="container">
      <section className="about-hero about-hero-split">
        <div className="about-hero-text">
          <h1>O nama</h1>
          <p className="lead">Humanitarac je nevladina organizacija posvećena pomoći zajednicama u potrebi.</p>
        </div>
        <div className="about-hero-img">
          <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop" alt="Tim Humanitarac" />
        </div>
      </section>

      <section className="values">
        <h2>Naše vrijednosti</h2>
        <div className="values-grid">
          <div className="value-card">
            <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=260&fit=crop" alt="Empatija" />
            <h3>Empatija i dostojanstvo</h3>
            <p>Svaki čovjek zaslužuje pomoć bez predrasuda.</p>
          </div>
          <div className="value-card">
            <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=260&fit=crop" alt="Transparentnost" />
            <h3>Transparentnost</h3>
            <p>Otvoreno djelujemo i dijelimo rezultate našeg rada.</p>
          </div>
          <div className="value-card">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=260&fit=crop" alt="Održivost" />
            <h3>Održivost</h3>
            <p>Gradimo dugoročna rješenja za lokalne zajednice.</p>
          </div>
          <div className="value-card">
            <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=260&fit=crop" alt="Uključivost" />
            <h3>Uključivost</h3>
            <p>Svako može doprinijeti — zajedno smo jači.</p>
          </div>
        </div>
      </section>

      <section className="impact">
        <h2>Naš uticaj</h2>
        <div className="timeline">
          <div className="timeline-item">
            <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=260&fit=crop" alt="Akcije 2024" className="timeline-img" />
            <div>
              <h3>2024</h3>
              <p>Provedeno 40 akcija pomoći u raznim gradovima.</p>
            </div>
          </div>
          <div className="timeline-item">
            <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=260&fit=crop" alt="Edukacija 2023" className="timeline-img" />
            <div>
              <h3>2023</h3>
              <p>Pokrenute edukativne kampanje i radionice za mlade.</p>
            </div>
          </div>
          <div className="timeline-item">
            <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=260&fit=crop" alt="Pomoć 2022" className="timeline-img" />
            <div>
              <h3>2022</h3>
              <p>Podrška nakon prirodnih nepogoda i hitnih situacija.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
