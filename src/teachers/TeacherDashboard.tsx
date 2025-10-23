export default function TeacherDashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Bienvenido Teacher 👩‍🏫</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold">Alumnos Activos</h3>
          <p className="text-2xl font-bold">25</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold">Ejercicios completados</h3>
          <p className="text-2xl font-bold">180</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold">Último acceso</h3>
          <p className="text-lg">Hace 2 horas</p>
        </div>
      </div>
    </div>
  );
}
