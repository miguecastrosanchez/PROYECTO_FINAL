
import { Routes, Route } from "react-router-dom";

// COMPONENTES
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// PÁGINAS
import Home from "./pages/Home";
import Explorar from "./pages/Explorar";
import Detalle from "./pages/Detalle";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Publicar from "./pages/Publicar";
import Editar from "./pages/Editar";

function App() {
  return (
    <>
      {/* MENÚ DE NAVEGACIÓN */}
      <Navbar />

      {/* RUTAS DE LA APLICACIÓN */}
      <Routes>

        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<Home />} />

        <Route
          path="/explorar"
          element={<Explorar />}
        />

        <Route
          path="/detalle/:id"
          element={<Detalle />}
        />

        <Route
          path="/registro"
          element={<Registro />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* RUTAS PRIVADAS */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />

        <Route
          path="/publicar"
          element={
            <PrivateRoute>
              <Publicar />
            </PrivateRoute>
          }
        />

        <Route
          path="/editar/:id"
          element={
            <PrivateRoute>
              <Editar />
            </PrivateRoute>
          }
        />

        {/* RUTA NO ENCONTRADA */}
        <Route
          path="*"
          element={
            <main>
              <h1>Página no encontrada</h1>
              <p>La página que buscas no existe.</p>
            </main>
          }
        />

      </Routes>
    </>
  );
}

export default App;
