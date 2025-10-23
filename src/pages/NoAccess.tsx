import React from "react";
import { Link } from "react-router-dom";

const NoAccess = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>🚫 Acceso denegado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
};

export default NoAccess;
