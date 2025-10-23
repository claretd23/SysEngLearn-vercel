import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TeacherLayout() {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#222a5c] text-white flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-8">Teacher Portal</h1>
        <nav className="flex flex-col gap-4">
          <Link to="/teacher/dashboard" className="hover:text-[#bcd03c]">Dashboard</Link>
          <Link to="/teacher/students" className="hover:text-[#bcd03c]">Alumnos</Link>
          <Link to="/teacher/profile" className="hover:text-[#bcd03c]">Perfil</Link>
        </nav>
        <button 
          onClick={logout} 
          className="mt-auto bg-[#bcd03c] text-[#222a5c] px-4 py-2 rounded-xl font-semibold hover:bg-[#aabc37]"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
