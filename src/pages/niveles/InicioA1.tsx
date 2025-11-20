import React, { useEffect, useState } from "react";
import "./InicioA1.css";
import logo from "../../assets/LOGO.svg";
import { Link } from "react-router-dom";

const semanas = [
  { semana: 1, temas: ["ABC", "NUMBERS", "ORDINAL NUMBERS"] },
  { semana: 2, temas: ["GREETINGS", "ARTICLES", "VERB TO BE"] },
  { semana: 3, temas: ["PERSONAL INFORMATION", "COUNTRIES AND NATIONALITIES", "PROFESSIONS"] },
  { semana: 4, temas: ["SIMPLE PRESENT (SUB+VERB+OBJECT+PLACE)", "ADJECTIVES", "SHORT ANSWERS"] },
  { semana: 5, temas: ["FRECUENCY ADVERBS", "ADJECTIVES 2 (COLOR,SHAPE, ETC)", "PREPOSITIONS 1 (TRANSPORT)"] },
  { semana: 6, temas: ["PREPOSITIONS 2 (PLACE)", "IMPERATIVES", "PREPOSITIONS 3 (IN/ON/AT)"] },
  { semana: 7, temas: ["POSSESSIVE ADJECTIVES ", "POSSESSIVE PRONOUNS", "OBJECT PRONOUNS"] },
  { semana: 8, temas: ["HOW MUCH?", "HOW MANY?", "IS THERE/ARE THERE?"] },
  { semana: 9, temas: ["WH QUESTIONS SIMPLE PRESENT", "HAVE GOT: DO YOU HAVE?", "THIS/THESE/THAT/THOSE"] },
  { semana: 10, temas: ["WANT/WOULD LIKE", "PRESENT CONTINUOUS", "CAN, CAN´T: ABILITY, POSSIBILITY,PERMISSION"] },
  { semana: 11, temas: ["WHOSE POSSESSIVES (S'-S')", "FAMILY TREE", "WEATHER"] },
  { semana: 12, temas: ["TELL THE TIME ", "FUTURE (GOING TO)", "FUTURE (WILL)"] },
];

export default function InicioA1() {
  const [ejerciciosCompletados, setEjerciciosCompletados] = useState<string[]>([]);
  const [mostrarBoton, setMostrarBoton] = useState(false);

  // ✅ Mantiene la semana actual en localStorage
  const [semanaActual, setSemanaActual] = useState(() => {
    const semanaGuardada = localStorage.getItem("semanaActualA1");
    return semanaGuardada ? parseInt(semanaGuardada) : 0;
  });

  useEffect(() => {
    // Guarda cada vez que cambia
    localStorage.setItem("semanaActualA1", semanaActual.toString());
  }, [semanaActual]);

  useEffect(() => {
    const fetchProgreso = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/progreso/A1`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error("Error al obtener progreso:", res.statusText);
          return;
        }
        const data = await res.json();
        const ids = data.map(
          (item: any) =>
            `${item.nivel}-${item.semana}-${item.tema}-${item.ejercicio}`
        );
        setEjerciciosCompletados(ids);
      } catch (error) {
        console.error("Error al obtener el progreso:", error);
      }
    };

    fetchProgreso();

    const manejarScroll = () => {
      setMostrarBoton(window.scrollY > 300);
    };
    window.addEventListener("scroll", manejarScroll);
    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);

  const irArriba = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleNext = () => {
    if (semanaActual < semanas.length - 1) setSemanaActual(semanaActual + 1);
  };

  const handlePrev = () => {
    if (semanaActual > 0) setSemanaActual(semanaActual - 1);
  };

  const semanaData = semanas[semanaActual];

  return (
    <div className="pagina-wrapper">
      <div className="a1-container">
        <button className="cerrar-sesion-boton" onClick={cerrarSesion}>
          Cerrar sesión
        </button>

        <img src={logo} alt="Logo" className="logo" />
        <h1 className="titulo">NIVEL A1</h1>

        {/* 📱 En móvil, solo muestra una semana */}
        <div className="semanas-wrapper">
          <div className="tarjeta-semana">
            <h2 className="semana-titulo">Week {semanaData.semana}</h2>
            <div className="temas-container">
              {semanaData.temas.map((tema, i) => {
                const totalEjercicios = [1, 2, 3];
                const temaIdBase = `A1-${semanaData.semana}-${i + 1}`;
                const completados = totalEjercicios.filter((ej) =>
                  ejerciciosCompletados.includes(`${temaIdBase}-${ej}`)
                );
                const porcentaje = Math.round(
                  (completados.length / totalEjercicios.length) * 100
                );

                return (
                  <div className="tema-bloque" key={i}>
                    <p className="tema-nombre">{tema}</p>
                    <p className="porcentaje-completado">
                      Progress: {porcentaje}%
                    </p>
                    <div className="botones-ejercicios">
                      {totalEjercicios.map((ej) => {
                        const ejercicioId = `${temaIdBase}-${ej}`;
                        const estaCompletado = ejerciciosCompletados.includes(ejercicioId);

                        return (
                          <Link
                            key={ej}
                            to={`/ejercicio/A1/${semanaData.semana}/${i + 1}/${ej}`}
                            className={`ejercicio-boton ${estaCompletado ? "completado" : ""}`}
                          >
                            Activity {ej}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navegación entre semanas */}
        <div className="botones-navegacion">
          {semanaActual > 0 && (
            <button onClick={handlePrev} className="btn-nav prev">
              ⬅️ previous week
            </button>
          )}
          {semanaActual < semanas.length - 1 && (
            <button onClick={handleNext} className="btn-nav next">
              Next week ➡️
            </button>
          )}
        </div>

        {mostrarBoton && (
          <button className="boton-arriba" onClick={irArriba}>
            ↑
          </button>
        )}
      </div>
    </div>
  );
}
