import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Contexto para obtener el token de autenticación
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const { token } = useContext(AuthContext); // Extraer el token del contexto de autenticación

  //  lista de usuarios
  const [users, setUsers] = useState<any[]>([]);
  
  // Estado del formulario para crear usuario
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // Valor por defecto "user"
    level: 'A1',  // Nivel por defecto
  });

  // Estado de carga (para cuando se envía el formulario)
  const [loading, setLoading] = useState(false);

  // Estado para marcar qué usuario se está eliminando
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // useEffect para cargar usuarios 
  useEffect(() => {
    fetchUsers();
  }, []);




  // Obtener lista de usuarios desde el backend
  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }, // Enviamos token en headers
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      setUsers(data); // Guardamos usuarios
    } catch (error) {
      console.error('Error en fetchUsers:', error);
    }
  };

  // Manejo de cambios en inputs y selects
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Si el campo es "role", controlamos si se muestra "level"
    if (name === 'role') {
      setForm((prevForm) => ({
        ...prevForm,
        role: value,
        level: value === 'user' ? prevForm.level : '', // Solo los alumnos tienen nivel
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };



  // Manejar envío de formulario (crear usuario nuevo)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Activar estado de carga

    try {
      const res = await fetch('/api/users/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Autenticación con token
        },
        body: JSON.stringify(form), // Datos del nuevo usuario
      });

      if (!res.ok) throw new Error('Error al agregar usuario');

      await fetchUsers(); // actualizar lista de usuarios
      // Reiniciar formulario
      setForm({ name: '', email: '', password: '', role: 'user', level: 'A1' });
    } catch (error: any) {
      alert(error.message);
    }

    setLoading(false); 
  };


  // Eliminar usuario
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return; // Confirmación
    setDeletingId(id); // Marcar usuario en proceso de eliminación

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }, // Autenticación
      });

      if (!res.ok) throw new Error('No se pudo eliminar el usuario');

      await fetchUsers(); // actualizar lista después de eliminar
    } catch (error: any) {
      alert(error.message);
    }

    setDeletingId(null);
  };
  return (
    <div className="admin-container">
      <div className="card">
        <div style={{ width: '100%' }}>
        <div className='titulo'>  <h2 id="heading">USUARIOS</h2> </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <input
                className="input-field"
                name="name"
                placeholder="Nombre"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <input
                className="input-field"
                name="email"
                type="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <input
                className="input-field"
                name="password"
                type="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <select name="role" value={form.role} onChange={handleChange} className="input-field">
              <option value="user">Alumno</option>
              <option value="admin">Teacher</option>
              <option value="superadmin">SuperAdmin</option>
            </select>

            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="input-field"
              disabled={form.role !== 'user'}
            >
              <option value="">Seleccione un nivel</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
            </select>

            <div className="btn">
              <button type="submit" className="button1" disabled={loading}>
                {loading ? 'Agregando...' : 'Agregar Usuario'}
              </button>
            </div>
          </form>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2rem' }}>
            <thead style={{ backgroundColor: '#222a5c', color: 'white' }}>
              <tr>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Nombre</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Rol</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Nivel</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '1rem' }}>
                    No hay usuarios
                  </td>
                </tr>
              ) : (
                users.map((user: any) => (
                  <tr key={user._id}>
                    <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{user.name}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{user.email}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{user.role}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{user.level || '-'}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                      <button
                        onClick={() => handleDelete(user._id)}
                        disabled={deletingId === user._id}
                        className="button3"
                      >
                        {deletingId === user._id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
