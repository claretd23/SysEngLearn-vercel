import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

// Importación de páginas
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./admin/AdminDashboard";
import UserForm from "./admin/UserForm";
import NoAccess from "./pages/NoAccess";
import UserHome from "./pages/UserHome";
import AdminRoute from "./components/AdminRoute";
import EjercicioRouter from "./pages/ejercicios/EjercicioRouter";
import InicioA1 from './pages/niveles/InicioA1';
import InicioA2 from './pages/niveles/InicioA2';
import InicioB1 from './pages/niveles/InicioB1';
import InicioB2 from './pages/niveles/InicioB2';
import InicioC1 from './pages/niveles/InicioC1';
import InicioC2 from './pages/niveles/InicioC2';

//  Redirección inicial según el rol del usuario
function HomeRedirect() {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />; // No hay usuario logueado
  if (user.role === "admin" || user.role === "superadmin") return <Navigate to="/admin" />; // Admin
  return <Navigate to="/user-home" />; // Usuario normal
}



function App() {
  return (
      <Routes>
        {}
        <Route path="/" element={<HomeRedirect />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/user-home" element={<UserHome />} />

        {/* Rutas por niveles */}
        <Route path="/inicio/A1" element={<InicioA1 />} />
        <Route path="/inicio/A2" element={<InicioA2 />} />
        <Route path="/inicio/B1" element={<InicioB1 />} />
        <Route path="/inicio/B2" element={<InicioB2 />} />
        <Route path="/inicio/C1" element={<InicioC1 />} />
        <Route path="/inicio/C2" element={<InicioC2 />} />

        {/* Ruta dinámica para ejercicios */}
        <Route path="/ejercicio/:nivel/:semana/:tema/:ejercicio" element={<EjercicioRouter />} />

        {/* Rutas protegidas para administradores */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/create"
          element={
            <AdminRoute>
              <UserForm />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit/:id"
          element={
            <AdminRoute>
              <UserForm />
            </AdminRoute>
          }
        />

        {/* Ruta para acceso denegado */}
        <Route path="/no-access" element={<NoAccess />} />
      </Routes>
  );
}

export default App;
