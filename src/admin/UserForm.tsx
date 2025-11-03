import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createUser, updateUser, getUserById } from "../services/apiClient";
import "../styles/AdminDashboard.css";

function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    nivel: "A1",
    rol: "user",
  });

  useEffect(() => {
    if (isEdit && token) loadUser();
  }, [id, token]);

  const loadUser = async () => {
    try {
      const user = await getUserById(id!, token!);
      setFormData({ ...user, password: "" });
    } catch (error) {
      console.error("Error al cargar usuario:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return alert("Token no disponible. Vuelve a iniciar sesión.");

    if (formData.rol !== "user" && currentUser.role !== "superadmin") {
      return alert("Solo un admin puede crear o editar administradores.");
    }

    try {
      if (isEdit) {
        await updateUser(id!, formData, token);
      } else {
        await createUser(formData, token);
      }
      navigate("/admin");
    } catch (error) {
      alert("Error al guardar el usuario.");
    }
  };

  // 🔹 Botón de cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="user-form-container">
      {/* 🔹 Botón cerrar sesión */}
      <button className="logout-button" onClick={handleLogout}>
        ⏻ Cerrar sesión
      </button>

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

        <select name="nivel" value={formData.nivel} onChange={handleChange}>
          {["A1", "A2", "B1", "B2", "C1", "C2"].map((nivel) => (
            <option key={nivel} value={nivel}>
              {nivel}
            </option>
          ))}
        </select>

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
