// src/components/AdminRoute.tsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function AdminRoute({ children }: { children: JSX.Element }) {
  const { user } = useContext(AuthContext); // Obtenemos el usuario actual desde el contexto de autenticación

  // Si no hay usuario autenticado → redirigir a login
  if (!user) return <Navigate to="/login" />;

  // Si el usuario no es admin ni superadmin → redirigir a la vista de usuario normal
  if (user.role !== "admin" && user.role !== "superadmin") {
    return <Navigate to="/user-home" />; 
  }

  // Si pasa las validaciones → renderiza el contenido protegido
  return children;
}

export default AdminRoute;
