import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

interface EjercicioOpciones {
  pregunta: string;
  opciones: string[];
  correcta: string;
}

export default function Tema2_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const navigate = useNavigate();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;

  const [index, setIndex] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState<boolean | null>(null);
  const [oracionFinal, setOracionFinal] = useState("");
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const ejercicios: EjercicioOpciones[] = [
    { pregunta: "Anna: Hi, Tom! What _______  now?", opciones: ["are you doing", "do you do", "doing"], correcta: "are you doing" },
    { pregunta: "Tom: Hi, Anna! I _______  a movie.", opciones: ["am watching", "is watching", "watching"], correcta: "am watching" },
    { pregunta: "Anna: Cool! I _______  to music.", opciones: ["am listening", "is listening", "listening"], correcta: "am listening" },
    { pregunta: "Anna: Yes, they _______ football outside.", opciones: ["are playing", "play", "is playing"], correcta: "are playing" },
    { pregunta: "Tom: Great! I _______  popcorn for the movie.", opciones: ["am making", "is making", "making"], correcta: "am making" },
    { pregunta: "Anna: Nice! What else _______  your brother?", opciones: ["is your brother doing", "does your brother do", "your brother is doing"], correcta: "is your brother doing" },
    { pregunta: "Tom: He _______ in his room.", opciones: ["is sleeping", "sleep", "are sleeping"], correcta: "is sleeping" },
    { pregunta: "Tom: She _______  a comic book.", opciones: ["is reading", "reads", "reading"], correcta: "is reading" },
    { pregunta: "Tom: Yes, they _______  dinner in the kitchen.", opciones: ["are cooking", "cook", "is cooking"], correcta: "are cooking" },
    { pregunta: "Anna: Wow! Everyone _______ something fun today.", opciones: ["is doing", "are doing", "does"], correcta: "is doing" },
  ];

  const actual = ejercicios[index];

  const verificar = () => {
    if (!opcionSeleccionada) return;

    const esCorrecta = opcionSeleccionada === actual.correcta;
    setRespuestaCorrecta(esCorrecta);

    const autocompletada = actual.pregunta.replace("_______", esCorrecta ? opcionSeleccionada : actual.correcta);
    setOracionFinal(autocompletada);

    if (esCorrecta) setCorrectas(prev => prev + 1);
  };

  const siguiente = () => {
    setRespuestaCorrecta(null);
    setOpcionSeleccionada(null);
    setOracionFinal("");
    setIndex(index + 1);
  };

  const manejarFinalizacion = async () => {
    try {
      // Solo guardar localStorage sin repetir
      const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
      if (!completados.includes(id)) {
        completados.push(id);
        localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
      }

      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/api/progreso`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nivel, semana, tema, ejercicio }),
      });
    } catch (err) {
      console.error(err);
    }

    setFinalizado(true);
    setTimeout(() => {
      navigate(`/inicio/${nivel}`);
      window.location.reload();
    }, 3000);
  };

  return (
    <div className="ejercicio-container">
      {!finalizado ? (
        <>
          <header className="ejercicio-header">
            <h1 className="titulo-ejercicio">EXERCISE 2</h1>
            <p className="progreso-ejercicio">
              Question {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section className="tarjeta-ejercicio" style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}>

            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
                <p className="instruccion-ejercicio" style={{ fontSize: "1.3rem" }}>
                  Complete the dialogue using the <b>present continuous</b>.
                </p>
              </div>
            )}

            <div
              className="oracion-box"
              style={{
                backgroundColor: "#f4f6fa",
                borderLeft: "5px solid #222a5c",
                borderRadius: "8px",
                padding: "1.5rem",
                margin: "1rem auto",
                maxWidth: "650px",
                textAlign: "left",
                fontStyle: "italic",
              }}
            >
              <p>{oracionFinal || actual.pregunta}</p>
            </div>

            {!respuestaCorrecta && respuestaCorrecta !== false && (
              <div className="opciones-ejercicio" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
                {actual.opciones.map((op, i) => (
                  <button
                    key={i}
                    className={`opcion-btn ${opcionSeleccionada === op ? "seleccionada" : ""}`}
                    onClick={() => setOpcionSeleccionada(op)}
                    style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem", minWidth: "180px" }}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}

            {respuestaCorrecta === null && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                disabled={!opcionSeleccionada}
                style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", marginTop: "1rem" }}
              >
                Check
              </button>
            )}

            {respuestaCorrecta !== null && (
              <p
                style={{
                  fontSize: "1.3rem",
                  margin: "1rem 0",
                  fontWeight: "bold",
                  color: respuestaCorrecta ? "green" : "red",
                }}
              >
                {respuestaCorrecta ? "Correct" : "Incorrect"}
              </p>
            )}

            {respuestaCorrecta !== null && (
              <div style={{ marginTop: "1rem" }}>
                {index < ejercicios.length - 1 ? (
                  <button onClick={siguiente} className="ejercicio-btn" style={{ padding: "0.8rem 2rem" }}>
                    Next question
                  </button>
                ) : (
                  <button onClick={manejarFinalizacion} className="ejercicio-btn" style={{ padding: "0.8rem 2rem" }}>
                    Finish
                  </button>
                )}
              </div>
            )}
          </section>
        </>
      ) : (
        <div className="finalizado" style={{ fontSize: "1.3rem" }}>
          <h2>You have completed the exercise!</h2>
          <p>
            Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
