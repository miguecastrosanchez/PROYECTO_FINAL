
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";

function Publicar() {
  const navigate = useNavigate();

  const { usuario } = useAuth();
  const { agregarPublicacion } = useProducts();

  // ESTADO DEL FORMULARIO
  const [formulario, setFormulario] = useState({
    titulo: "",
    categoria: "Poleras",
    precio: "",
    talla: "M",
    lugar: "",
    descripcion: "",
    imagen: "",
  });

  // ACTUALIZAR CAMPOS
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // GUARDAR PUBLICACIÓN
  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!usuario) {
      navigate("/login");
      return;
    }

    if (
      !formulario.titulo.trim() ||
      !formulario.lugar.trim() ||
      !formulario.descripcion.trim() ||
      Number(formulario.precio) <= 0
    ) {
      alert("Completa correctamente todos los campos.");
      return;
    }

    const nuevaPublicacion = {
      ...formulario,
      titulo: formulario.titulo.trim(),
      lugar: formulario.lugar.trim(),
      descripcion: formulario.descripcion.trim(),
      precio: Number(formulario.precio),
      imagen:
        formulario.imagen.trim() ||
        "https://placehold.co/500x600/F2E6DC/171717?text=DOBBY+PLACE",
      usuarioEmail: usuario.email,
    };

    const id = agregarPublicacion(nuevaPublicacion);

    navigate(`/detalle/${id}`);
  };

  return (
    <main className="publicar-page">
      <h1>Publicar una prenda</h1>

      <p>
        Comparte ropa cómoda con la comunidad DOBBY PLACE.
      </p>

      <form
        className="formulario-publicar"
        onSubmit={manejarEnvio}
      >
        <label htmlFor="titulo">Nombre de la prenda</label>
        <input
          id="titulo"
          type="text"
          name="titulo"
          value={formulario.titulo}
          onChange={manejarCambio}
          placeholder="Ej: Polerón deportivo"
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
          value={formulario.precio}
          onChange={manejarCambio}
          placeholder="Ej: 19990"
          min="1"
          required
        />

        <label htmlFor="talla">Talla</label>
        <select
          id="talla"
          name="talla"
          value={formulario.talla}
          onChange={manejarCambio}
        >
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>

        <label htmlFor="lugar">Ubicación</label>
        <input
          id="lugar"
          type="text"
          name="lugar"
          value={formulario.lugar}
          onChange={manejarCambio}
          placeholder="Ej: Iquique"
          required
        />

        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formulario.descripcion}
          onChange={manejarCambio}
          placeholder="Describe la prenda y su estado..."
          rows="4"
          required
        />

        <label htmlFor="imagen">URL de imagen (opcional)</label>
        <input
          id="imagen"
          type="url"
          name="imagen"
          value={formulario.imagen}
          onChange={manejarCambio}
          placeholder="https://ejemplo.com/imagen.jpg"
        />

        <button type="submit" className="boton-contactar">
          Publicar prenda
        </button>
      </form>
    </main>
  );
}

export default Publicar;
