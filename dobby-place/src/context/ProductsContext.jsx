
import { createContext, useContext, useState } from "react";
import publicacionesIniciales from "../data/publicaciones";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {

  const [publicaciones, setPublicaciones] = useState(
    publicacionesIniciales
  );

  const [favoritos, setFavoritos] = useState([]);

  const agregarFavorito = (id) => {
    setFavoritos((anteriores) => {
      if (anteriores.includes(id)) {
        return anteriores;
      }

      return [...anteriores, id];
    });
  };

  const quitarFavorito = (id) => {
    setFavoritos((anteriores) =>
      anteriores.filter((favoritoId) => favoritoId !== id)
    );
  };

  const esFavorito = (id) => {
    return favoritos.includes(id);
  };

  return (
    <ProductsContext.Provider
      value={{
        publicaciones,
        setPublicaciones,
        favoritos,
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
