import React, { createContext, useState, useEffect } from "react";
import { setAuthToken, removeAuthToken, getStoredToken, getStoredUser } from "../services/apiClient";

// Definimos el tipo de usuario
interface User {
  email: string;
  role: string;
}

// Definimos el tipo de contexto de autenticación
interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// Creamos el contexto con valores iniciales vacíos
export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

//  autenticación
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Cargamos el token y usuario desde localStorage 
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [user, setUser] = useState<User | null>(getStoredUser());

  // Cada vez que cambia el token se configura el header global o se quita
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    } else {
      removeAuthToken();
    }
  }, [token]);

  // Función para iniciar sesión () guarda token y usuario en memoria + localStorage)
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // Función para cerrar sesión (limpia memoria y localStorage)
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };


  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
