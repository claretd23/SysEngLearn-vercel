import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "react-router-dom";

// Import dinámico de todos los componentes .tsx dentro de la carpeta actual y subcarpetas
const modules = import.meta.glob('./**/*.tsx');

export default function EjercicioRouter() {
  // Obtenemos los parámetros de la URL: nivel, semana, tema y ejercicio
  const { nivel, semana, tema, ejercicio } = useParams();

  // Estado para el componente que se cargará dinámicamente
  const [Component, setComponent] = useState<React.FC | null>(null);
  const [loading, setLoading] = useState(true);  // Estado de carga
  const [notFound, setNotFound] = useState(false); // Estado si no se encuentra el ejercicio

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    // Construimos la ruta del componente según los parámetros
    const path = `./${nivel}/Semana${semana}/Tema${tema}_Ej${ejercicio}.tsx`;

    // Obtenemos la función de importación dinámica
    const importer = modules[path];

    if (!importer) {
      // Si no existe el componente, marcamos como no encontrado
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Importación dinamica
    importer()
      .then((mod) => {
        setComponent(() => mod.default); // Guardamos el componente importado
      })
      .catch(() => {
        setNotFound(true); // Error al cargar ( componente no encontrado)
      })
      .finally(() => {
        setLoading(false); // Terminamos carga
      });
  }, [nivel, semana, tema, ejercicio]);

  // Render según estado
  if (loading) return <div>Cargando ejercicio...</div>;
  if (notFound) return <div>Ejercicio no encontrado</div>;
  if (Component) return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Component /> {/* Render del componente dinámico */}
    </Suspense>
  );

  return null; 
}
