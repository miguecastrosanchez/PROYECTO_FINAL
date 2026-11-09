
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  // Obtenemos el usuario desde Context API
  const { usuario } = useAuth();

  return (
    <nav className="navbar-dobby">

      {/* LOGO DOBBY PLACE */}
      <Link to="/" className="logo">
        <img
          src="/assets/logo-dobby.png"
          alt="Logo de DOBBY PLACE"
          className="logo-icono"
        />

        <span className="logo-texto">
          DOBBY<span>PLACE.</span>
        </span>
      </Link>

      {/* MENÚ CENTRAL */}
      <div className="navbar-links">
        <Link to="/explorar">Explorar</Link>
        <Link to="/explorar">Categorías</Link>
      </div>

      {/* ACCESOS DE USUARIO */}
      <div className="navbar-usuarios">

        {usuario ? (
          <>
            {/* Usuario con sesión iniciada */}

            <Link
              to="/publicar"
              title="Nueva publicación"
              aria-label="Nueva publicación"
              className="boton-publicar"
            >
              <span className="icono-publicar">+</span>
            </Link>

            <Link
              to="/perfil"
              title="Mi perfil"
              className="usuario-activo"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
              </svg>

              <span>{usuario.nombre || usuario.email}</span>
            </Link>
          </>
        ) : (
          <>
            {/* Visitante sin sesión */}

            <Link
              to="/login"
              title="Iniciar sesión"
              aria-label="Iniciar sesión"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
              </svg>
            </Link>

            <Link
              to="/registro"
              title="Crear cuenta"
              aria-label="Crear cuenta"
            >
              <svg
                viewBox="0 0 32 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="10" cy="7" r="4" />
                <path d="M2 21v-2a8 8 0 0 1 16 0v2" />
                <path
                  d="M25 5v12 M19 11h12"
                  strokeWidth="2.5"
                />
              </svg>
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;
