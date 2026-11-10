
import { createContext, useContext, useState } from "react";
import publicacionesIniciales from "../data/publicaciones";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [publicaciones, setPublicaciones] = useState(
    publicacionesIniciales
  );

  const [favoritos, setFavoritos] = useState([]);

  // CREAR PUBLICACIÓN
  const agregarPublicacion = (nuevaPublicacion) => {
    const publicacion = {
      ...nuevaPublicacion,
      id: Date.now(),
    };

    setPublicaciones((anteriores) => [
      publicacion,
      ...anteriores,
    ]);

    return publicacion.id;
  };

  // EDITAR PUBLICACIÓN
  const editarPublicacion = (id, datosActualizados, email) => {
    const existe = publicaciones.some(
      (publicacion) =>
        publicacion.id === id &&
        publicacion.usuarioEmail === email
    );

    if (!existe) return false;

    setPublicaciones((anteriores) =>
      anteriores.map((publicacion) =>
        publicacion.id === id
          ? { ...publicacion, ...datosActualizados }
          : publicacion
      )
    );

    return true;
  };

  // ELIMINAR PUBLICACIÓN
  const eliminarPublicacion = (id, email) => {
    const existe = publicaciones.some(
      (publicacion) =>
        publicacion.id === id &&
        publicacion.usuarioEmail === email
    );

    if (!existe) return false;

    setPublicaciones((anteriores) =>
      anteriores.filter(
        (publicacion) => publicacion.id !== id
      )
    );

    setFavoritos((anteriores) =>
      anteriores.filter((favoritoId) => favoritoId !== id)
    );

    return true;
  };

  // AGREGAR FAVORITO
  const agregarFavorito = (id) => {
    setFavoritos((anteriores) => {
      if (anteriores.includes(id)) return anteriores;
      return [...anteriores, id];
    });
  };

  // QUITAR FAVORITO
  const quitarFavorito = (id) => {
    setFavoritos((anteriores) =>
      anteriores.filter((favoritoId) => favoritoId !== id)
    );
  };

  // COMPROBAR FAVORITO
  const esFavorito = (id) => {
    return favoritos.includes(id);
  };

  return (
    <ProductsContext.Provider
      value={{
        publicaciones,
        favoritos,
        agregarPublicacion,
        editarPublicacion,
        eliminarPublicacion,
        agregarFavorito,
        quitarFavorito,
        esFavorito,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
