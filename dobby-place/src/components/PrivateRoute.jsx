
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { usuario } = useAuth();

  // Si no hay usuario, redirigir al Login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, mostrar la página privada
  return children;
}

export default PrivateRoute;
