
import { useState } from "react";

import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductsContext";

function Explorar() {
  const [categoria, setCategoria] = useState("Todas");
  const { publicaciones } = useProducts();
  const categorias = [
    "Todas",
    "Poleras",
    "Polerones",
    "Shorts",
  ];

  const publicacionesFiltradas = publicaciones.filter(
    (publicacion) =>
      categoria === "Todas" ||
      publicacion.categoria === categoria
  );

  return (
    <main className="explorar-page">
      <h1>Explora a tu ritmo.</h1>

      <p>
        Encuentra ropa cómoda para moverte con tu mascota.
      </p>

      <div className="filtros">
        {categorias.map((item) => (
          <button
            key={item}
            className={
              categoria === item
                ? "filtro activo"
                : "filtro"
            }
            onClick={() => setCategoria(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="productos-grid">
        {publicacionesFiltradas.map((publicacion) => (
          <ProductCard
            key={publicacion.id}
            publicacion={publicacion}
          />
        ))}
      </div>
    </main>
  );
}

export default Explorar;
