import React, { useEffect, useState } from "react";
import "./InicioB2.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const semanas = [
  { semana: 1, temas: ["AS...AS", "ADJECTIVES AND ADVERBS", "FUTURE PERFECT"] },
  { semana: 2, temas: ["DISCOURSE MARKERS – LINKING WORDS", "MIXED CONDITIONALS", "COMPOUND WORDS/ADJECTIVES"] },
  { semana: 3, temas: ["ALIKE VS LIKE – IN ORDER TO VS SO THAT", "PHRASAL VERBS – AT WORK", "LISTENING ACTIVITY"] },
  { semana: 4, temas: ["WAYS TO EXPRESS FUTURE", "OTHER EXPRESSIONS IN CONDITIONALS", "GERUNDS AND INFINITIVES: COMPLEX FORMS"] },
  { semana: 5, temas: ["INVERSION WITH NEGATIVE ADVERBIALS – ADDING EMPHASIS", "DISTANCING – EXPRESSIONS AND PASSIVE OF REPORTING VERBS", "FUTURE IN THE PAST"] },
  { semana: 6, temas: ["VERB + OBJECT + INFINITIVE/GERUND – VERB PATTERNS", "UNLESS, EVEN IF, PROVIDED, AS LONG AS, ETC. – OTHER EXPRESSIONS IN CONDITIONALS", "LISTENING ACTIVITY"] },
  { semana: 7, temas: ["CLEFT SENTENCES – ADDING EMPHASIS", "WOULD RATHER, WOULD PREFER: EXPRESSING PREFERENCE", "PARTICIPLE CLAUSES"] },
  { semana: 8, temas: ["CONVERSATION CLASS", "PASSIVE VERBS WITH TWO OBJECTS", "POSSESSIVE ’S WITH TIME EXPRESSIONS – TWO HOURS’ WALK"] },
  { semana: 9, temas: ["THE … THE … COMPARATIVES", "ADJECTIVES WITHOUT NOUN", "PREFIXES AND SUFFIXES"] },
  { semana: 10, temas: ["SO DO I/NEITHER DO I", "IDIOMS AND PHRASAL VERBS", "LISTENING ACTIVITY"] },
  { semana: 11, temas: ["READING ACTIVITY", "LIKELY, UNLIKELY, BOUND, DEFINITELY, PROBABLY – PROBABILITY", "LISTENING EXERCISE"] },
  { semana: 12, temas: ["READING ACTIVITY", "LISTENING EXERCISE", "IDIOMS"] },
];


export default function InicioB2() {
  const [ejerciciosCompletados, setEjerciciosCompletados] = useState<string[]>([]);
  const [mostrarBoton, setMostrarBoton] = useState(false);

useEffect(() => {
  const fetchProgreso = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/progreso/B2", {
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


  const irArriba = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const cerrarSesion = () => {
  localStorage.removeItem("token");
  window.location.href = "/login"; 
};


  return (
      <div className="pagina-wrapper">
        <div className="B2-container">
          <button className="cerrar-sesion-boton" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="titulo">NIVEL B2</h1>

      <div className="semanas-wrapper">
        {semanas.map((semanaData, index) => (
          <div className="tarjeta-semana" key={index}>
            <h2 className="semana-titulo">Week {semanaData.semana}</h2>
            <div className="temas-container">
              {semanaData.temas.map((tema, i) => {
                const totalEjercicios = [1, 2, 3];
                const temaIdBase = `B2-${semanaData.semana}-${i + 1}`;
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
                          to={`/ejercicio/B2/${semanaData.semana}/${i + 1}/${ej}`}
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
        ))}
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