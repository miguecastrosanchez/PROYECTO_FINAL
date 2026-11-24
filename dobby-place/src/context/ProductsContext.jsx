import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, mapearPublicacion, prepararPublicacion } from "../services/api";
import { useAuth } from "./AuthContext";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const { usuario, token } = useAuth();
  const [publicaciones, setPublicaciones] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState("");

  const cargarPublicaciones = useCallback(async () => {
    const datos = await api("/api/publications");
    setPublicaciones(datos.map(mapearPublicacion));
    setErrorProductos("");
  }, []);

  const cargarFavoritos = useCallback(async () => {
    if (!token || !usuario) { setFavoritos([]); return; }
    const datos = await api("/api/favorites", { token });
    setFavoritos(datos.map((f) => Number(f.publication_id)));
  }, [token, usuario]);

  useEffect(() => {
    let activo = true;
    api("/api/publications")
      .then((datos) => { if (activo) { setPublicaciones(datos.map(mapearPublicacion)); setErrorProductos(""); } })
      .catch((e) => { if (activo) setErrorProductos(e.message); })
      .finally(() => { if (activo) setCargandoProductos(false); });
    return () => { activo = false; };
  }, []);

  useEffect(() => {
    let activo = true;
    if (!usuario || !token) {
      queueMicrotask(() => { if (activo) setFavoritos([]); });
      return () => { activo = false; };
    }
    api("/api/favorites", { token })
      .then((datos) => { if (activo) setFavoritos(datos.map((f) => Number(f.publication_id))); })
      .catch(() => { if (activo) setFavoritos([]); });
    return () => { activo = false; };
  }, [usuario, token]);

  const agregarPublicacion = async (datos) => {
    const creada = await api("/api/publications", { method: "POST", body: prepararPublicacion(datos), token });
    await cargarPublicaciones();
    return Number(creada.id);
  };

  const editarPublicacion = async (id, datos) => {
    await api(`/api/publications/${id}`, { method: "PUT", body: prepararPublicacion(datos), token });
    await cargarPublicaciones();
  };

  const eliminarPublicacion = async (id) => {
    await api(`/api/publications/${id}`, { method: "DELETE", token });
    await cargarPublicaciones();
    setFavoritos((anteriores) => anteriores.filter((favoritoId) => favoritoId !== id));
  };

  const agregarFavorito = async (id) => {
    await api("/api/favorites", { method: "POST", body: { publication_id: Number(id) }, token });
    await cargarFavoritos();
  };

  const quitarFavorito = async (id) => {
    await api(`/api/favorites/${id}`, { method: "DELETE", token });
    await cargarFavoritos();
  };

  const esFavorito = (id) => favoritos.includes(Number(id));

  return <ProductsContext.Provider value={{
    publicaciones, favoritos, cargandoProductos, errorProductos, cargarPublicaciones,
    agregarPublicacion, editarPublicacion, eliminarPublicacion, agregarFavorito, quitarFavorito, esFavorito,
  }}>{children}</ProductsContext.Provider>;
}

export function useProducts() { return useContext(ProductsContext); }
