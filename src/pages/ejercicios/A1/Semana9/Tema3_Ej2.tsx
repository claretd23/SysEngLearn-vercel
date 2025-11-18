import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

interface EjercicioOpciones {
  pregunta: string;
  opciones: string[];
  correcta: string;
}

export default function Tema3_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const navigate = useNavigate();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;

  const [index, setIndex] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;


  const ejercicios: EjercicioOpciones[] = [
    {
      pregunta: "_______ is my new phone.",
      opciones: ["These", "Those", "This"],
      correcta: "This",
    },
    {
      pregunta: "_______ are my friends from school.",
      opciones: ["This", "That", "These"],
      correcta: "These",
    },
    {
      pregunta: "I like _______ dress you’re wearing.",
      opciones: ["These", "That", "Those"],
      correcta: "That",
    },
    {
      pregunta: "_______ pencils on the desk are mine.",
      opciones: ["This", "Those", "That"],
      correcta: "Those",
    },
    {
      pregunta: "_______ dog over there looks friendly.",
      opciones: ["These", "That", "This"],
      correcta: "That",
    },
    {
      pregunta: "_______ is my brother’s computer.",
      opciones: ["This", "These", "Those"],
      correcta: "This",
    },
    {
      pregunta: "_______ cookies taste delicious!",
      opciones: ["These", "This", "That"],
      correcta: "These",
    },
    {
      pregunta: "Do you see _______ building across the street?",
      opciones: ["These", "That", "Those"],
      correcta: "That",
    },
    {
      pregunta: "_______ are not my shoes; they’re yours.",
      opciones: ["That", "This", "Those"],
      correcta: "Those",
    },
    {
      pregunta: "_______ is a great idea!",
      opciones: ["These", "Those", "This"],
      correcta: "This",
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

      const res = await fetch(`${API_URL}/api/progreso`, {
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
      setRespuesta(`Correct!\n\n${actual.pregunta.replace("_______", opcionSeleccionada)}`);
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect.\n\n${actual.pregunta.replace("_______", actual.correcta)}`);
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
            {/* Instrucción solo en la primera pregunta */}
            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
                <p className="instruccion-ejercicio" style={{ fontSize: "1.3rem" }}>
                  Complete each sentence with the correct <b>demonstrative</b>:
                  <br />
                  (this, these, that, those)
                </p>
              </div>
            )}

            {/* Pregunta */}
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

            {/* Opciones */}
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

            {/* Botón Check */}
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

            {/* Feedback */}
            {respuesta && (
              <p
                className={`respuesta-feedback ${respuesta.startsWith("✅") ? "correcta" : "incorrecta"}`}
                style={{ fontSize: "1.3rem", margin: "1rem 0" }}
              >
                {respuesta.split("\n")[0]}
              </p>
            )}

            {/* Botones siguiente / finalizar */}
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