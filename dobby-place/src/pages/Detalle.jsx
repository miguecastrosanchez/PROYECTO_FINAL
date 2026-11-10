
import { Link, useParams, useNavigate } from "react-router-dom";

import { useProducts } from "../context/ProductsContext";
import { useAuth } from "../context/AuthContext";

function Detalle() {
  // Obtener el ID desde la URL
  const { id } = useParams();

  // Navegación mediante React Router
  const navigate = useNavigate();

  // Obtener el usuario autenticado
  const { usuario } = useAuth();

  // Obtener publicaciones y favoritos del contexto
  const {
    publicaciones,
    agregarFavorito,
    quitarFavorito,
    esFavorito,
  } = useProducts();

  // Buscar la publicación seleccionada
  const publicacion = publicaciones.find(
    (item) => item.id === Number(id)
  );

  // Si la publicación no existe
  if (!publicacion) {
    return (
      <main>
        <h1>Publicación no encontrada</h1>

        <Link to="/explorar">
          Volver a explorar
        </Link>
      </main>
    );
  }

  // Agregar o quitar una publicación de favoritos
  const manejarFavorito = () => {
    // Si no hay sesión, ir al Login
    if (!usuario) {
      navigate("/login");
      return;
    }

    // Comprobar si ya está en favoritos
    if (esFavorito(publicacion.id)) {
      quitarFavorito(publicacion.id);
    } else {
      agregarFavorito(publicacion.id);
    }
  };

  return (
    <main className="detalle-page">

      {/* RUTA DE NAVEGACIÓN */}
      <p className="detalle-ruta">
        <Link to="/explorar">Explorar</Link>
        {" / "}
        {publicacion.categoria}
        {" / "}
        {publicacion.titulo}
      </p>

      <div className="detalle-contenedor">

        {/* IMAGEN DE LA PUBLICACIÓN */}
        <div className="detalle-imagen">
          <img
            src={publicacion.imagen}
            alt={publicacion.titulo}
          />
        </div>

        {/* INFORMACIÓN DE LA PUBLICACIÓN */}
        <div className="detalle-informacion">

          <h1>{publicacion.titulo}</h1>

          <h2>
            ${publicacion.precio.toLocaleString("es-CL")}
          </h2>

          <p>
            <strong>Categoría:</strong>{" "}
            {publicacion.categoria}
          </p>

          <p>
            <strong>Talla:</strong>{" "}
            {publicacion.talla}
          </p>

          <hr />

          <p>{publicacion.descripcion}</p>

          {/* CONTACTAR AL VENDEDOR */}
          <button
            type="button"
            className="boton-contactar"
            disabled
            title="Funcionalidad pendiente de implementar"
          >
            Contactar al vendedor
          </button>

          {/* GUARDAR O QUITAR FAVORITOS */}
          <button
            type="button"
            className="boton-favorito"
            onClick={manejarFavorito}
          >
            {esFavorito(publicacion.id)
              ? "♥ Quitar de favoritos"
              : "♡ Guardar en favoritos"}
          </button>

        </div>
      </div>
    </main>
  );
}

export default Detalle;
