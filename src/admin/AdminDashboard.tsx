import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const { token, logout } = useContext(AuthContext);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    level: 'A1',
  });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Obtener lista de usuarios
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error en fetchUsers:', error);
    }
  };

  // Manejo de cambios en inputs y selects
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'role') {
      setForm((prevForm) => ({
        ...prevForm,
        role: value,
        level: value === 'user' ? prevForm.level : '',
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Crear usuario nuevo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/admin/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Error al agregar usuario');

      await fetchUsers();
      setForm({ name: '', email: '', password: '', role: 'user', level: 'A1' });
    } catch (error: any) {
      alert(error.message);
    }
    setLoading(false);
  };

  // Eliminar usuario
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('No se pudo eliminar el usuario');
      await fetchUsers();
    } catch (error: any) {
      alert(error.message);
    }
    setDeletingId(null);
  };

  return (
    <div className="admin-container">
  <button className="logout-button" onClick={logout}>Cerrar Sesión</button>

  <div className="card">
    <h2 className="heading">Panel de Usuarios</h2>

        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input-field"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="input-field"
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="input-field"
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />
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

          <button type="submit" className="button-add" disabled={loading}>
            {loading ? 'Agregando...' : 'Agregar Usuario'}
          </button>
        </form>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Nivel</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty">
                    No hay usuarios
                  </td>
                </tr>
              ) : (
                users.map((user: any) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.level || '-'}</td>
                    <td>
                      <button
                        className="button-delete"
                        onClick={() => handleDelete(user._id)}
                        disabled={deletingId === user._id}
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
