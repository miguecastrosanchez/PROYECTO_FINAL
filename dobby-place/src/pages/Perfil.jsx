
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Perfil() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  if (!usuario) {
    return (
      <main>
        <h1>Mi perfil</h1>
        <p>Debes iniciar sesión para ver tu perfil.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Mi perfil</h1>

      <h2>Bienvenido, {usuario.nombre}</h2>
      <p>Correo: {usuario.email}</p>

      <h3>Mis publicaciones</h3>
      <p>Aquí mostraremos tus prendas.</p>

      <h3>Mis favoritos</h3>
      <p>Aquí mostraremos tus favoritos.</p>

      <button onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </main>
  );
}

export default Perfil;
