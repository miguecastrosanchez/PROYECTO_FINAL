import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);
const CLAVE_TOKEN = "dobby_place_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(CLAVE_TOKEN));
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  // Si se refresca la página, consultamos /me para recuperar la sesión del JWT.
  useEffect(() => {
    let activo = true;
    if (!token) {
      queueMicrotask(() => { if (activo) { setUsuario(null); setCargandoSesion(false); } });
      return () => { activo = false; };
    }
    api("/api/users/me", { token })
      .then((u) => { if (activo) setUsuario({ id: u.id, nombre: u.name, email: u.email, lugar: u.place }); })
      .catch(() => {
        if (activo) {
          sessionStorage.removeItem(CLAVE_TOKEN);
          setToken(null);
          setUsuario(null);
        }
      })
      .finally(() => { if (activo) setCargandoSesion(false); });
    return () => { activo = false; };
  }, [token]);

  const login = async (email, password) => {
    const datos = await api("/api/auth/login", { method: "POST", body: { email, password } });
    sessionStorage.setItem(CLAVE_TOKEN, datos.token);
    setUsuario({ id: datos.user.id, nombre: datos.user.name, email: datos.user.email, lugar: datos.user.place });
    setToken(datos.token);
    setCargandoSesion(false);
  };

  const registrar = async (datos) => api("/api/auth/register", {
    method: "POST",
    body: { name: datos.nombre, email: datos.email, place: datos.lugar, password: datos.password, confirmPassword: datos.repetirPassword },
  });

  const logout = () => {
    sessionStorage.removeItem(CLAVE_TOKEN);
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, registrar, logout, cargandoSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
