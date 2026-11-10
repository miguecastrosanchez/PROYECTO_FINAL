import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Registro() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");

  const manejarRegistro = (e) => {
    e.preventDefault();
    if (password !== repetirPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    // Hito 2: solo demostración de interfaz; aún no se crea una cuenta real.
    alert("Formulario de registro validado. El registro real se conectará al backend en el siguiente hito.");
    navigate("/login");
  };

  return (
    <main className="auth-page">
      <h1>Crear cuenta</h1>
      <p>Únete a DOBBY PLACE y comparte prendas con la comunidad.</p>
      <form className="formulario-auth" onSubmit={manejarRegistro}>
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" required />
        <label htmlFor="registro-email">Correo electrónico</label>
        <input id="registro-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.cl" required />
        <label htmlFor="registro-password">Contraseña</label>
        <input id="registro-password" type="password" autoComplete="new-password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required />
        <label htmlFor="repetir-password">Repetir contraseña</label>
        <input id="repetir-password" type="password" autoComplete="new-password" minLength={6} value={repetirPassword} onChange={(e) => setRepetirPassword(e.target.value)} placeholder="Repite tu contraseña" required />
        <button type="submit" className="boton-contactar">Continuar</button>
        <p className="auth-footer">Esta es una demostración frontend; aún no crea usuarios reales.</p>
        <p className="auth-footer">¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>
      </form>
    </main>
  );
}

export default Registro;
