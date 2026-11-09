
import { useParams } from "react-router-dom";

function Detalle() {
  const { id } = useParams();

  return (
    <main>
      <h1>Detalle de publicación</h1>
      <p>Publicación número: {id}</p>
    </main>
  );
}

export default Detalle;
