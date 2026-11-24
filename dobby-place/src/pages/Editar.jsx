import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";

function Editar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { publicaciones, editarPublicacion, cargandoProductos } = useProducts();
  const publicacion = publicaciones.find((item) => item.id === Number(id));
  const [formulario, setFormulario] = useState(null);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (publicacion) {
      queueMicrotask(() => setFormulario({
        titulo: publicacion.titulo, categoria: publicacion.categoria,
        precio: String(publicacion.precio), talla: publicacion.talla,
        lugar: publicacion.lugar, descripcion: publicacion.descripcion,
        imagen: publicacion.imagen.includes("placehold.co") ? "" : publicacion.imagen,
      }));
    }
  }, [publicacion]);

  if (cargandoProductos) return <main><p>Cargando publicación...</p></main>;
  if (!publicacion || publicacion.usuarioId !== Number(usuario?.id)) return (
    <main><h1>No puedes editar esta publicación</h1><Link to="/perfil">Volver a mi perfil</Link></main>
  );
  if (!formulario) return <main><p>Cargando formulario...</p></main>;

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };
  const guardarCambios = async (e) => {
    e.preventDefault(); setError("");
    if (!formulario.titulo.trim() || !formulario.lugar.trim() || !formulario.descripcion.trim() || Number(formulario.precio) <= 0) {
      setError("Completa correctamente los campos."); return;
    }
    setEnviando(true);
    try { await editarPublicacion(publicacion.id, formulario); navigate("/perfil"); }
    catch (err) { setError(err.message); }
    finally { setEnviando(false); }
  };
  return (
    <main className="publicar-page">
      <h1>Editar publicación</h1>
      <p>Modifica los datos de tu prenda.</p>
      <form className="formulario-publicar" onSubmit={guardarCambios}>
        <label htmlFor="titulo">Nombre de la prenda</label>
        <input id="titulo" name="titulo" value={formulario.titulo} onChange={manejarCambio} required />
        <label htmlFor="categoria">Categoría</label>
        <select id="categoria" name="categoria" value={formulario.categoria} onChange={manejarCambio}>
          { ["Poleras", "Polerones", "Shorts"].map(c => <option key={c} value={c}>{c}</option>) }
        </select>
        <label htmlFor="precio">Precio (CLP)</label>
        <input id="precio" type="number" name="precio" min="1" value={formulario.precio} onChange={manejarCambio} required />
        <label htmlFor="talla">Talla</label>
        <select id="talla" name="talla" value={formulario.talla} onChange={manejarCambio}>
          { ["XS", "S", "M", "L", "XL", "XXL"].map(t => <option key={t} value={t}>{t}</option>) }
        </select>
        <label htmlFor="lugar">Ubicación</label>
        <input id="lugar" name="lugar" value={formulario.lugar} onChange={manejarCambio} required />
        <label htmlFor="descripcion">Descripción</label>
        <textarea id="descripcion" name="descripcion" rows="4" value={formulario.descripcion} onChange={manejarCambio} required />
        <label htmlFor="imagen">URL de la imagen (opcional)</label>
        <input id="imagen" type="url" name="imagen" value={formulario.imagen} onChange={manejarCambio} />
        {error && <p role="alert" className="mensaje-error">{error}</p>}
        <button type="submit" className="boton-contactar" disabled={enviando}>{enviando ? "Guardando..." : "Guardar cambios"}</button>
      </form>
    </main>
  );
}
export default Editar;
