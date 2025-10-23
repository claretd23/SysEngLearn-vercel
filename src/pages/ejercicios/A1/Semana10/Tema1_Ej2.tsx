import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

interface EjercicioOpciones {
  pregunta: string;
  opciones: string[];
  correcta: string;
}

export default function Tema1_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const navigate = useNavigate();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;

  const [index, setIndex] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios: EjercicioOpciones[] = [
    {
      pregunta: "Anna: Hi, Tom! What _______ for lunch?",
      opciones: ["wants", "do you want", "would you like"],
      correcta: "do you want",
    },
    {
      pregunta: "Tom: Hi, Anna! I _______ a sandwich.",
      opciones: ["want", "would like", "wants"],
      correcta: "want",
    },
    {
      pregunta: "Anna: Nice! I _______ some juice.",
      opciones: ["want", "would like", "wants"],
      correcta: "would like",
    },
    {
      pregunta: "Tom: Do you _______ to go to the park later?",
      opciones: ["wants", "want", "would like"],
      correcta: "want",
    },
    {
      pregunta: "Anna: Yes! I _______ to play football there.",
      opciones: ["want", "wants", "would like"],
      correcta: "want",
    },
    {
      pregunta: "Tom: Great! What _______ your brother?",
      opciones: ["does your brother want", "wants your brother", "do your brother want"],
      correcta: "does your brother want",
    },
    {
      pregunta: "Anna: He _______ a pizza for lunch.",
      opciones: ["wants", "want", "would like"],
      correcta: "wants",
    },
    {
      pregunta: "Tom: And your sister?\nAnna: She _______ a cup of tea.",
      opciones: ["wants", "would like", "want"],
      correcta: "would like",
    },
    {
      pregunta: "Tom: Do your parents _______ anything?",
      opciones: ["want", "wants", "would like"],
      correcta: "want",
    },
    {
      pregunta: "Anna: Yes, they _______ to watch a movie after lunch.",
      opciones: ["wants", "want", "would like"],
      correcta: "want",
    },
  ];

  const actual = ejercicios[index];

  const guardarProgreso = async () => {
    const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/progreso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nivel, semana, tema, ejercicio }),
      });

      if (!res.ok) console.error("Error al guardar progreso:", res.statusText);
    } catch (error) {
      console.error("Error al guardar el progreso:", error);
    }
  };

  const verificar = () => {
    if (!opcionSeleccionada) return;

    if (opcionSeleccionada === actual.correcta) {
      setRespuesta(`✅ Correct!\n\n${actual.pregunta.replace("_______", opcionSeleccionada)}`);
      setCorrectas((prev) => prev + 1);
    } else {
      // Si es incorrecta, muestra la correcta en el input
      setRespuesta(`❌ Incorrect.\n\n${actual.pregunta.replace("_______", actual.correcta)}`);
      setOpcionSeleccionada(actual.correcta);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setOpcionSeleccionada(null);
    setIndex(index + 1);
  };

  const manejarFinalizacion = async () => {
    await guardarProgreso();
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

          <section
            className="tarjeta-ejercicio"
            style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}
          >
            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
                <p className="instruccion-ejercicio" style={{ fontSize: "1.3rem" }}>
                  Complete the dialogue by choosing the correct option for each blank.
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
                whiteSpace: "pre-line",
              }}
            >
              <p>{respuesta ? respuesta.split("\n").slice(1).join("\n") : actual.pregunta}</p>
            </div>

            {!respuesta && (
              <div
                className="opciones-ejercicio"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
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

            {!respuesta && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                disabled={!opcionSeleccionada}
                style={{
                  fontSize: "1.3rem",
                  padding: "0.8rem 2rem",
                  marginBottom: "1rem",
                  borderRadius: "8px",
                }}
              >
                Check
              </button>
            )}

            {respuesta && (
              <p
                className={`respuesta-feedback ${respuesta.startsWith("✅") ? "correcta" : "incorrecta"}`}
                style={{ fontSize: "1.3rem", margin: "1rem 0" }}
              >
                {respuesta.split("\n")[0]}
              </p>
            )}

            <div
              className="botones-siguiente"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {respuesta && index < ejercicios.length - 1 && (
                <button
                  onClick={siguiente}
                  className="ejercicio-btn"
                  style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
                >
                  Next question
                </button>
              )}
              {respuesta && index === ejercicios.length - 1 && (
                <button
                  onClick={manejarFinalizacion}
                  className="ejercicio-btn"
                  style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
                >
                  Finish
                </button>
              )}
            </div>
          </section>
        </>
      ) : (
        <div className="finalizado" style={{ fontSize: "1.3rem" }}>
          <h2>✅ You have completed the exercise!</h2>
          <p>
            Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
