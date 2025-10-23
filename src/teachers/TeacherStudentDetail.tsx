import { useParams } from "react-router-dom";

const progresoMock = {
    id: 1,
    nombre: "Juan Pérez",
    nivel: "A1",
    ejercicios: [
        { id: "ej1", titulo: "Listening - Semana 1", estado: "Completado", fecha: "10/08/2025", score: 85 },
        { id: "ej2", titulo: "Reading - Semana 1", estado: "Pendiente", fecha: "-", score: null },
        { id: "ej3", titulo: "Grammar - Semana 1", estado: "Completado", fecha: "12/08/2025", score: 92 },
    ],
    };

    export default function TeacherStudentDetail() {
    const { id } = useParams();

    return (
        <div>
        <h2 className="text-2xl font-bold mb-4">Detalle del Alumno</h2>

        {/* Info general */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
            <h3 className="text-xl font-semibold mb-2">{progresoMock.nombre}</h3>
            <p className="text-gray-600">Nivel: <span className="font-semibold">{progresoMock.nivel}</span></p>
            <p className="text-gray-600">ID Alumno: <span className="font-semibold">{id}</span></p>
        </div>

        {/* Tabla de ejercicios */}
        <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">Progreso de Ejercicios</h3>
            <table className="w-full">
            <thead className="bg-[#222a5c] text-white">
                <tr>
                <th className="p-3 text-left">Ejercicio</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Puntuación</th>
                </tr>
            </thead>
            <tbody>
                {progresoMock.ejercicios.map((ej) => (
                <tr key={ej.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{ej.titulo}</td>
                    <td className={`p-3 font-semibold ${ej.estado === "Completado" ? "text-green-600" : "text-red-500"}`}>
                    {ej.estado}
                    </td>
                    <td className="p-3">{ej.fecha}</td>
                    <td className="p-3">{ej.score ? `${ej.score}%` : "-"}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {/* Feedback */}
        <div className="bg-white p-6 rounded-2xl shadow mt-6">
            <h3 className="text-lg font-semibold mb-4">Feedback del Teacher</h3>
            <textarea
            placeholder="Escribe un comentario para este alumno..."
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#222a5c]"
            rows={4}
            ></textarea>
            <button className="mt-4 bg-[#bcd03c] text-[#222a5c] px-5 py-2 rounded-xl font-semibold hover:bg-[#aabc37]">
            Guardar Feedback
            </button>
        </div>
        </div>
    );
}
