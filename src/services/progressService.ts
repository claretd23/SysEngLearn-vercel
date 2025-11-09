import axios from "axios";

// URL de la API de progreso
const API_URL = import.meta.env.VITE_API_URL + "/api/progreso";

// Guardar progreso de un ejercicio completado
export const guardarProgreso = async (
  token: string,
  nivel: string,
  semana: string,
  tema: string,
  ejercicio: string
) => {
  try {
    const response = await axios.post(
      API_URL,
      { nivel, semana, tema, ejercicio },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error guardando progreso:", error);
    throw error;
  }
};

// Obtener progreso de un usuario por nivel
export const obtenerProgreso = async (token: string, nivel: string) => {
  try {
    const response = await axios.get(`${API_URL}/${nivel}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo progreso:", error);
    throw error;
  }
};
