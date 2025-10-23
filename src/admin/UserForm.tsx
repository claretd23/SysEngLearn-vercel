import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createUser, updateUser, getUserById } from "../services/apiClient";
import "../styles/AdminDashboard.css";

function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Si existe id, significa que estamos editando
  const isEdit = Boolean(id);

  // Usuario actual y token guardados en localStorage
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    nivel: "A1",
    rol: "user",
  });

  // Si estamos editando y hay token, cargar datos del usuario
  useEffect(() => {
    if (isEdit && token) {
      loadUser();
    }
  }, [id, token]);

  // Cargar usuario por ID
  const loadUser = async () => {
    try {
      const user = await getUserById(id!, token!);
      setFormData({ ...user, password: "" }); // No mostramos la contraseña
    } catch (error) {
      console.error("Error al cargar usuario:", error);
    }
  };

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return alert("Token no disponible. Vuelve a iniciar sesión.");

    // Solo un admin puede asignar roles distintos a "user"
    if (formData.rol !== "user" && currentUser.role !== "superadmin") {
      return alert("Solo un admin puede crear o editar administradores.");
    }

    try {
      if (isEdit) {
        await updateUser(id!, formData, token); // Editar usuario
      } else {
        await createUser(formData, token); // Crear nuevo usuario
      }
      navigate("/admin"); // Volver al panel admin
    } catch (error) {
      alert("Error al guardar el usuario.");
    }
  };

  return (
    <div className="user-form-container">
      <h2>{isEdit ? "Editar Usuario" : "Crear Usuario"}</h2>
      <form className="user-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {/* Solo pedimos contraseña al crear, no al editar */}
        {!isEdit && (
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
        )}
        {/* Selección de nivel */}
        <select name="nivel" value={formData.nivel} onChange={handleChange}>
          {["A1", "A2", "B1", "B2", "C1", "C2"].map((nivel) => (
            <option key={nivel} value={nivel}>
              {nivel}
            </option>
          ))}
        </select>
        {/* Selección de rol, restringida si no es administrador */}
        <select name="rol" value={formData.rol} onChange={handleChange}>
          {currentUser.role === "superadmin" ? (
            ["user", "admin", "superadmin"].map((rol) => (
              <option key={rol} value={rol}>
                {rol}
              </option>
            ))
          ) : (
            <option value="user">user</option>
          )}
        </select>
        <button type="submit" className="button1">
          {isEdit ? "Guardar Cambios" : "Crear Usuario"}
        </button>
      </form>
    </div>
  );
}

export default UserForm;
