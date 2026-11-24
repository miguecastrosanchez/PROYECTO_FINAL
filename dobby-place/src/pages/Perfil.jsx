
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";

function Perfil() {
  const navigate = useNavigate();

  // USUARIO Y SESIÓN
  const { usuario, logout } = useAuth();

  // PUBLICACIONES Y FAVORITOS
  const {
    publicaciones,
    favoritos,
    eliminarPublicacion, cargandoProductos, errorProductos,
  } = useProducts();

  // MIS PUBLICACIONES
  const misPublicaciones = publicaciones.filter(
    (publicacion) =>
      publicacion.usuarioId === Number(usuario?.id)
  );

  // MIS FAVORITOS
  const publicacionesFavoritas = publicaciones.filter(
    (publicacion) =>
      favoritos.includes(publicacion.id)
  );

  // CERRAR SESIÓN
  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  // ELIMINAR UNA PUBLICACIÓN
  const [error, setError] = useState("");
  const manejarEliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar esta publicación?"
    );

    if (!confirmar) return;

    try { await eliminarPublicacion(id); }
    catch (err) { setError(err.message); }
  };

  // VERIFICAR SESIÓN
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

      {error && <p role="alert" className="mensaje-error">{error}</p>}
      {errorProductos && <p role="alert" className="mensaje-error">{errorProductos}</p>}
      {cargandoProductos && <p>Cargando publicaciones...</p>}

      {/* MIS PUBLICACIONES */}
      <section>
        <h2>Mis publicaciones</h2>

        <Link to="/publicar">
          + Crear nueva publicación
        </Link>

        {misPublicaciones.length === 0 ? (
          <p>Todavía no has publicado ninguna prenda.</p>
        ) : (
          <div className="productos-grid">

            {misPublicaciones.map((publicacion) => (
              <div
                key={publicacion.id}
                className="product-card"
              >
                <img
                  src={publicacion.imagen}
                  alt={publicacion.titulo}
                  className="product-imagen"
                />

                <div className="product-info">
                  <h3>{publicacion.titulo}</h3>

                  <p>
                    ${publicacion.precio.toLocaleString("es-CL")}
                  </p>

                  <span>Talla: {publicacion.talla}</span>

                  <Link
                    to={`/detalle/${publicacion.id}`}
                    className="product-detalle"
                  >
                    Ver publicación
                  </Link>

                  {/* BOTONES CRUD */}
                  <div className="acciones-publicacion">

                    <Link
                      to={`/editar/${publicacion.id}`}
                      className="boton-editar"
                    >
                      Editar
                    </Link>

                    <button
                      type="button"
                      className="boton-eliminar"
                      onClick={() =>
                        manejarEliminar(publicacion.id)
                      }
                    >
                      Eliminar
                    </button>

                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
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
          <div className="productos-grid">

            {publicacionesFavoritas.map((publicacion) => (
              <div
                key={publicacion.id}
                className="product-card"
              >
                <img
                  src={publicacion.imagen}
                  alt={publicacion.titulo}
                  className="product-imagen"
                />

                <div className="product-info">
                  <h3>{publicacion.titulo}</h3>

                  <p>
                    ${publicacion.precio.toLocaleString("es-CL")}
                  </p>

                  <span>Talla: {publicacion.talla}</span>

                  <Link
                    to={`/detalle/${publicacion.id}`}
                    className="product-detalle"
                  >
                    Ver publicación
                  </Link>
                </div>
              </div>
            ))}

          </div>
        )}
      </section>

      <hr />

      {/* CERRAR SESIÓN */}
      <button
        type="button"
        className="boton-contactar"
        onClick={cerrarSesion}
      >
        Cerrar sesión
      </button>

    </main>
  );
}

export default Perfil;
