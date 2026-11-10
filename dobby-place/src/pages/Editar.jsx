
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";

function Editar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { usuario } = useAuth();
  const { publicaciones, editarPublicacion } = useProducts();

  // Buscar publicación
  const publicacion = publicaciones.find(
    (item) => item.id === Number(id)
  );

  // Estado inicial del formulario
  const [formulario, setFormulario] = useState({
    titulo: publicacion?.titulo || "",
    categoria: publicacion?.categoria || "Poleras",
    precio: publicacion?.precio || "",
    talla: publicacion?.talla || "M",
    lugar: publicacion?.lugar || "",
    descripcion: publicacion?.descripcion || "",
    imagen: publicacion?.imagen || "",
  });

  // Comprobar propiedad
  if (!publicacion || publicacion.usuarioEmail !== usuario?.email) {
    return (
      <main>
        <h1>No puedes editar esta publicación</h1>
        <Link to="/perfil">Volver a mi perfil</Link>
      </main>
    );
  }

  // Actualizar campos
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // Guardar cambios
  const guardarCambios = (e) => {
    e.preventDefault();

    if (
      !formulario.titulo.trim() ||
      !formulario.lugar.trim() ||
      !formulario.descripcion.trim() ||
      Number(formulario.precio) <= 0
    ) {
      alert("Completa correctamente los campos.");
      return;
    }

    const actualizado = editarPublicacion(
      publicacion.id,
      {
        ...formulario,
        titulo: formulario.titulo.trim(),
        precio: Number(formulario.precio),
        lugar: formulario.lugar.trim(),
        descripcion: formulario.descripcion.trim(),
      },
      usuario.email
    );

    if (actualizado) {
      navigate("/perfil");
    }
  };

  return (
    <main className="publicar-page">
      <h1>Editar publicación</h1>
      <p>Modifica los datos de tu prenda.</p>

      <form
        className="formulario-publicar"
        onSubmit={guardarCambios}
      >
        <label htmlFor="titulo">Nombre de la prenda</label>
        <input
          id="titulo"
          name="titulo"
          value={formulario.titulo}
          onChange={manejarCambio}
          required
        />

        <label htmlFor="categoria">Categoría</label>
        <select
          id="categoria"
          name="categoria"
          value={formulario.categoria}
          onChange={manejarCambio}
        >
          <option value="Poleras">Poleras</option>
          <option value="Polerones">Polerones</option>
          <option value="Shorts">Shorts</option>
        </select>

        <label htmlFor="precio">Precio (CLP)</label>
        <input
          id="precio"
          type="number"
          name="precio"
          min="1"
          value={formulario.precio}
          onChange={manejarCambio}
          required
        />

        <label htmlFor="talla">Talla</label>
        <select
          id="talla"
          name="talla"
          value={formulario.talla}
          onChange={manejarCambio}
        >
          {["XS", "S", "M", "L", "XL", "XXL"].map((talla) => (
            <option key={talla} value={talla}>
              {talla}
            </option>
          ))}
        </select>

        <label htmlFor="lugar">Ubicación</label>
        <input
          id="lugar"
          name="lugar"
          value={formulario.lugar}
          onChange={manejarCambio}
          required
        />

        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows="4"
          value={formulario.descripcion}
          onChange={manejarCambio}
          required
        />

        <label htmlFor="imagen">URL de la imagen</label>
        <input
          id="imagen"
          type="url"
          name="imagen"
          value={formulario.imagen}
          onChange={manejarCambio}
        />

        <button type="submit" className="boton-contactar">
          Guardar cambios
        </button>
      </form>
    </main>
  );
}

export default Editar;
