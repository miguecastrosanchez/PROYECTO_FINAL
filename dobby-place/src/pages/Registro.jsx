import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Registro() {
  const navigate = useNavigate();
  const { registrar } = useAuth();
  const [form, setForm] = useState({ nombre: "", email: "", lugar: "", password: "", repetirPassword: "" });
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const cambio = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const manejarRegistro = async (e) => {
    e.preventDefault(); setError("");
    if (form.password !== form.repetirPassword) { setError("Las contraseñas no coinciden."); return; }
    setEnviando(true);
    try { await registrar(form); navigate("/login", { replace: true }); }
    catch (err) { setError(err.message); }
    finally { setEnviando(false); }
  };

  return (
    <main className="auth-page">
      <h1>Crear cuenta</h1>
      <p>Únete a DOBBY PLACE y comparte prendas con la comunidad.</p>
      <form className="formulario-auth" onSubmit={manejarRegistro}>
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" name="nombre" value={form.nombre} onChange={cambio} placeholder="Tu nombre" required />
        <label htmlFor="registro-email">Correo electrónico</label>
        <input id="registro-email" name="email" type="email" autoComplete="email" value={form.email} onChange={cambio} placeholder="correo@ejemplo.cl" required />
        <label htmlFor="lugar">Lugar</label>
        <input id="lugar" name="lugar" value={form.lugar} onChange={cambio} placeholder="Ej: Iquique" required />
        <label htmlFor="registro-password">Contraseña</label>
        <input id="registro-password" name="password" type="password" autoComplete="new-password" minLength={8} value={form.password} onChange={cambio} placeholder="Mínimo 8 caracteres" required />
        <label htmlFor="repetir-password">Repetir contraseña</label>
        <input id="repetir-password" name="repetirPassword" type="password" autoComplete="new-password" minLength={8} value={form.repetirPassword} onChange={cambio} required />
        {error && <p className="mensaje-error" role="alert">{error}</p>}
        <button type="submit" className="boton-contactar" disabled={enviando}>{enviando ? "Registrando..." : "Crear cuenta"}</button>
        <p className="auth-footer">¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>
      </form>
    </main>
  );
}
export default Registro;
