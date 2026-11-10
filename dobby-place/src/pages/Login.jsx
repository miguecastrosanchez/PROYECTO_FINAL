import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Completa todos los campos");
      return;
    }
    login(email);
    navigate("/perfil");
  };

  return (
    <main className="auth-page">
      <h1>Iniciar sesión</h1>
      <p>Vuelve a tu espacio en DOBBY PLACE.</p>
      <form className="formulario-auth" onSubmit={iniciarSesion}>
        <label htmlFor="email">Correo electrónico</label>
        <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.cl" required />
        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tu contraseña" required />
        <button type="submit" className="boton-contactar">Iniciar sesión</button>
        <p className="auth-footer">¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link></p>
      </form>
    </main>
  );
}

export default Login;
