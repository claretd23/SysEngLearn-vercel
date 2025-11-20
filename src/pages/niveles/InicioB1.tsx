import React, { useEffect, useState } from "react";
import "./InicioB1.css";
import logo from "../../assets/LOGO.svg";
import { Link } from "react-router-dom";

const semanas = [
  { semana: 1, temas: ["COMPOUND ADJECTIVES WITH NUMBERS", "ADJECTIVE + PREPOSITION: DEPENDENT PREPOSITIONS", "ANOTHER, OTHER, OTHERS, THE OTHER, THE OTHERS"] },
  { semana: 2, temas: ["DESCRIBING WHAT YOU ARE GOOD AT", "ABLE TO", "2ND CONDITIONAL"] },
  { semana: 3, temas: ["3RD CONDITIONAL", "NEITHER & EITHER", "SUPERLATIVES WITHOUT 'THE'"] },
  { semana: 4, temas: ["TOO, ENOUGH", "SO, SUCH, VERY, BOTH", "PHRASAL VERBS"] },
  { semana: 5, temas: ["ADVERBS (MANNER)", "QUESTION TAGS", "CLAUSES OF CONTRAST, PURPOSE AND REASON"] },
  { semana: 6, temas: ["FUTURE CONTINUOUS", "VERB + PREPOSITION: DEPENDENT PREPOSITIONS", "GET: DIFFERENT MEANINGS"] },
  { semana: 7, temas: ["MODALS MIGHT/MAY WILL PROBABLY", "SHOULD HAVE / MIGHT HAVE / WOULD HAVE", "REPORTING VERBS – ADMIT DOING, REFUSE TO DO, ETC."] },
  { semana: 8, temas: ["READING CLASS", "PHRASAL VERBS", "SUPPOSED TO"] },
  { semana: 9, temas: ["REPORTED SPEECH", "WHATEVER, WHENEVER, WHEREVER, WHOEVER, HOWEVER", "IDIOMS"] },
  { semana: 10, temas: ["LISTENING CLASS", "PRETTY, RATHER, QUITE, FAIRLY", "ADVANCED SPLITTABLE PHRASAL VERBS"] },
  { semana: 11, temas: ["THE PASSIVE WITH REPORTING VERBS", "AIN'T", "HAVE SOMETHING DONE"] },
  { semana: 12, temas: ["NEEDN’T, DON’T NEED TO, DIDN’T NEED TO, NEEDN’T HAVE", "HOPE VS WISH","POLITE QUESTIONS"] },
];

export default function InicioB1() {
  const [ejerciciosCompletados, setEjerciciosCompletados] = useState<string[]>([]);
  const [mostrarBoton, setMostrarBoton] = useState(false);

useEffect(() => {
  const fetchProgreso = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/progreso/B1", {
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
        <div className="B1-container">
          <button className="cerrar-sesion-boton" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="titulo">NIVEL B1</h1>

      <div className="semanas-wrapper">
        {semanas.map((semanaData, index) => (
          <div className="tarjeta-semana" key={index}>
            <h2 className="semana-titulo">Week {semanaData.semana}</h2>
            <div className="temas-container">
              {semanaData.temas.map((tema, i) => {
                const totalEjercicios = [1, 2, 3];
                const temaIdBase = `B1-${semanaData.semana}-${i + 1}`;
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
                          to={`/ejercicio/A2/${semanaData.semana}/${i + 1}/${ej}`}
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