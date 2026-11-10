
import { Link } from "react-router-dom";

function ProductCard({ publicacion }) {
  return (
    <div className="product-card">
      <Link to={`/detalle/${publicacion.id}`}>
        <img
          src={publicacion.imagen}
          alt={publicacion.titulo}
          className="product-imagen"
        />
      </Link>

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
          Ver detalle
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
