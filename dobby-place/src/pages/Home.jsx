import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <p className="home-eyebrow">DOBBY PLACE · MARKETPLACE</p>
      <h1>ROPA QUE TE <span>ACOMPAÑA.</span></h1>
      <p>Para pasear, entrenar y disfrutar junto a tu mascota. Prendas cómodas, una comunidad que se mueve contigo.</p>
      <div className="home-actions">
        <Link className="btn btn-dark" to="/explorar">Explorar prendas</Link>
        <Link className="btn btn-outline" to="/registro">Crear cuenta</Link>
      </div>
      <div className="home-rule" aria-hidden="true" />
    </main>
  );
}

export default Home;
