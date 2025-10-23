import { Link } from "react-router-dom";

const alumnos = [
  { id: 1, nombre: "Juan Pérez", nivel: "A1", progreso: "45%", ultimo: "12/08/2025" },
  { id: 2, nombre: "Ana Torres", nivel: "B1", progreso: "72%", ultimo: "15/08/2025" },
];

export default function TeacherStudents() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Mis Alumnos</h2>
      
      <table className="w-full bg-white rounded-2xl shadow overflow-hidden">
        <thead className="bg-[#222a5c] text-white">
          <tr>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Nivel</th>
            <th className="p-3 text-left">Progreso</th>
            <th className="p-3 text-left">Último acceso</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno) => (
            <tr key={alumno.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{alumno.nombre}</td>
              <td className="p-3">{alumno.nivel}</td>
              <td className="p-3">{alumno.progreso}</td>
              <td className="p-3">{alumno.ultimo}</td>
              <td className="p-3 text-center">
                <Link to={`/teacher/students/${alumno.id}`} className="text-[#222a5c] font-semibold hover:text-[#bcd03c]">
                  Ver Detalle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
