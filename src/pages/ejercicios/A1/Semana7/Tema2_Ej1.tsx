import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tema2_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios = [
    { pregunta: "This bag is not mine. It’s ___?", opciones: ["her", "hers", "she", "him"], correcta: "hers" },
    { pregunta: "The blue jacket is not ours. It’s ___?", opciones: ["their", "theirs", "ours", "them"], correcta: "theirs" },
    { pregunta: "I love this notebook. Can I borrow ___?", opciones: ["your", "yours", "you", "yours"], correcta: "yours" },
    { pregunta: "This sandwich is not mine. It’s ___?", opciones: ["she", "him", "his", "he"], correcta: "his" },
    { pregunta: "That apartment is not theirs. It’s ___?", opciones: ["ours", "our", "ours", "we"], correcta: "ours" },
    { pregunta: "The cake is not mine. Can I try ___?", opciones: ["her", "hers", "hers", "she"], correcta: "hers" },
    { pregunta: "The tickets are not ours. They are ___?", opciones: ["their", "theirs", "theirs", "them"], correcta: "theirs" },
    { pregunta: "I found a pen. Is this ___?", opciones: ["your", "yours", "you", "yours"], correcta: "yours" },
    { pregunta: "The bag on the chair is not mine. It’s ___?", opciones: ["hers", "her", "she", "him"], correcta: "hers" },
    { pregunta: "The shoes outside the shop are not ours. They are ___?", opciones: ["their", "theirs", "theirs", "them"], correcta: "theirs" },
  ];

  const actual = ejercicios[index];

  // === GUARDAR PROGRESO ===
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

      if (!res.ok) console.error("Error saving progress:", res.statusText);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  // === VERIFICAR RESPUESTA ===
  const verificar = () => {
    if (!opcionSeleccionada) return;

    const oracionCompletada = actual.pregunta.replace("___", opcionSeleccionada);

    if (opcionSeleccionada === actual.correcta) {
      setRespuesta(`Correct\n\n${oracionCompletada}`);
      setCorrectas((prev) => prev + 1);
    } else {
      const oracionCorrecta = actual.pregunta.replace("___", actual.correcta);
      setRespuesta(`Incorrect\n\n${oracionCorrecta}`);
    }
  };

  // === SIGUIENTE ===
  const siguiente = () => {
    setRespuesta(null);
    setOpcionSeleccionada(null);
    setIndex(index + 1);
  };

  // === FINALIZAR ===
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
            <h1 className="titulo-ejercicio">EXERCISE 1</h1>
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
                <p className="instruccion-ejercicio">
                  Choose the correct <b>possessive pronoun</b> to complete each sentence.
                </p>
              </div>
            )}

            {/* Oración */}
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
                className={`respuesta-feedback ${
                  respuesta.startsWith("Correct") ? "correcta" : "incorrecta"
                }`}
                style={{ fontSize: "1.3rem", margin: "1rem 0" }}
              >
                {respuesta.split("\n")[0]}
              </p>
            )}

            {/* Botones */}
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
          <h2 className="correcta">You have completed the exercise!</h2>
          <p>
            Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
