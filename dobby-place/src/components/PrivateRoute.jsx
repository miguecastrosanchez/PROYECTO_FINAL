import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { usuario, cargandoSesion } = useAuth();
  if (cargandoSesion) return <main><p>Comprobando sesión...</p></main>;
  if (!usuario) return <Navigate to="/login" replace />;
  return children;
}
export default PrivateRoute;
