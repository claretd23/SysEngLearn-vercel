import axios from 'axios';
import type { AxiosResponse } from 'axios'; 

// URL base de la API de usuarios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/users';

// Interfaces para tipado de datos
interface User {
  email: string;
  role: string; 
}

interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

interface ApiResponse {
  message: string;
}

interface RegisterRequest {
  email: string;
  password: string;
}

// Configuración de axios
axios.defaults.headers.common['Content-Type'] = 'application/json';

//  manejo de errores
axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// USUARIOS 

// Obtener todos los usuarios (requiere token)
export const getAllUsers = async (token: string): Promise<User[]> => {
  const response: AxiosResponse<User[]> = await axios.get(API_BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Obtener usuario por ID (requiere token)
export const getUserById = async (id: string, token: string): Promise<User> => {
  const response: AxiosResponse<User> = await axios.get(`${API_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Crear usuario (admin)
export const createUser = async (user: RegisterRequest, token: string): Promise<ApiResponse> => {
  const response: AxiosResponse<ApiResponse> = await axios.post(
    `${API_BASE_URL}/register`, user, { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Actualizar usuario (admin)
export const updateUser = async (id: string, user: Partial<User>, token: string): Promise<ApiResponse> => {
  const response: AxiosResponse<ApiResponse> = await axios.put(
    `${API_BASE_URL}/${id}`, user, { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Eliminar usuario (admin)
export const deleteUser = async (id: string, token: string): Promise<ApiResponse> => {
  const response: AxiosResponse<ApiResponse> = await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};





// AUTENTICACIÓN 

// Login
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response: AxiosResponse<LoginResponse> = await axios.post(`${API_BASE_URL}/login`, { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Registro de usuario (sin token)
export const registerUser = async (email: string, password: string): Promise<ApiResponse> => {
  const response: AxiosResponse<ApiResponse> = await axios.post(`${API_BASE_URL}/register`, { email, password });
  return response.data;
};

// Recuperar contraseña
export const forgotPassword = async (email: string): Promise<ApiResponse> => {
  const response: AxiosResponse<ApiResponse> = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
  return response.data;
};

// Restablecer contraseña con token
export const resetPassword = async (token: string, newPassword: string): Promise<ApiResponse> => {
  const response: AxiosResponse<ApiResponse> = await axios.post(`${API_BASE_URL}/reset-password`, { token, newPassword });
  return response.data;
};





// Cerrar sesión
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Obtener token almacenado
export const getStoredToken = (): string | null => localStorage.getItem('token');

// Obtener usuario almacenado
export const getStoredUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Verificar autenticación
export const isAuthenticated = (): boolean => !!getStoredToken();

// Configurar token por defecto en axios
export const setAuthToken = (token: string): void => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Remover token por defecto de axios
export const removeAuthToken = (): void => {
  delete axios.defaults.headers.common['Authorization'];
};

// Inicializar autenticación al cargar la app
export const initializeAuth = (): void => {
  const token = getStoredToken();
  if (token) setAuthToken(token);
};


export type { User, LoginResponse, ApiResponse };
