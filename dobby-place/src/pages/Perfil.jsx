
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";

function Perfil() {
  const navigate = useNavigate();

  // Obtener usuario y función de cerrar sesión
  const { usuario, logout } = useAuth();

  // Obtener publicaciones y favoritos
  const { publicaciones, favoritos } = useProducts();

  // Buscar las publicaciones favoritas
  const publicacionesFavoritas = publicaciones.filter(
    (publicacion) => favoritos.includes(publicacion.id)
  );

  // Cerrar sesión
  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  // Comprobar que existe un usuario
  if (!usuario) {
    return (
      <main>
        <h1>Mi perfil</h1>
        <p>Debes iniciar sesión para ver tu perfil.</p>

        <Link to="/login">
          Iniciar sesión
        </Link>
      </main>
    );
  }

  return (
    <main className="perfil-page">

      {/* INFORMACIÓN DEL USUARIO */}
      <h1>Mi perfil</h1>

      <h2>Bienvenido, {usuario.nombre}</h2>

      <p>
        <strong>Correo:</strong> {usuario.email}
      </p>

      <hr />

      {/* MIS PUBLICACIONES */}
      <section>
        <h2>Mis publicaciones</h2>

        <p>
          Aquí aparecerán las prendas que publiques.
        </p>

        <Link to="/publicar">
          Crear nueva publicación
        </Link>
      </section>

      <hr />

      {/* MIS FAVORITOS */}
      <section>
        <h2>Mis favoritos</h2>

        {publicacionesFavoritas.length === 0 ? (
          <p>
            Todavía no tienes publicaciones favoritas.
          </p>
        ) : (
          <div className="favoritos-lista">

            {publicacionesFavoritas.map((publicacion) => (
              <div
                key={publicacion.id}
                className="favorito-item"
              >

                <h3>{publicacion.titulo}</h3>

                <p>
                  ${publicacion.precio.toLocaleString("es-CL")}
                </p>

                <p>Talla: {publicacion.talla}</p>

                <Link to={`/detalle/${publicacion.id}`}>
                  Ver publicación
                </Link>

              </div>
            ))}

          </div>
        )}
      </section>

      <hr />

      {/* CERRAR SESIÓN */}
      <button
        type="button"
        onClick={cerrarSesion}
      >
        Cerrar sesión
      </button>

    </main>
  );
}

export default Perfil;
