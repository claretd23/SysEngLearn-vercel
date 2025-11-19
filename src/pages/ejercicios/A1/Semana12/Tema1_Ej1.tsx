import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

export default function Tema1_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const ejercicios = [
    { hora: "1:00", correcta: "One o’clock" },
    { hora: "4:00", correcta: "Four o’clock" },
    { hora: "6:30", correcta: "Half past six" },
    { hora: "10:30", correcta: "Half past ten" },
    { hora: "8:00", correcta: "Eight o’clock" },
    { hora: "11:30", correcta: "Half past eleven" },
    { hora: "7:00", correcta: "Seven o’clock" },
    { hora: "3:30", correcta: "Half past three" },
    { hora: "5:00", correcta: "Five o’clock" },
    { hora: "9:30", correcta: "Half past nine" },
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
    if (!respuesta) return;

    const usuario = respuesta.trim().toLowerCase();
    const correcta = actual.correcta.toLowerCase();

    if (usuario === correcta) {
      setFeedback("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setFeedback("Incorrect");
    }
  };

  const siguiente = () => {
    setRespuesta("");
    setFeedback(null);
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
            <h1 className="titulo-ejercicio">EXERCISE 1</h1>
            <p className="progreso-ejercicio">
              Question {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section
            className="tarjeta-ejercicio"
            style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}
          >
            {/* Instrucción */}
            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
                <p className="instruccion-ejercicio">
                  Write the correct time in words. Use o’clock or half past.
                </p>
              </div>
            )}

            {/* Hora mostrada */}
            <div
              className="oracion-box"
              style={{
                backgroundColor: "#f4f6fa",
                borderLeft: "5px solid #222a5c",
                borderRadius: "8px",
                padding: "1.5rem",
                margin: "1rem auto",
                maxWidth: "600px",
                textAlign: "center",
                fontStyle: "italic",
                color: "black",
              }}
            >
              <p>{actual.hora}</p>
            </div>

            {/* Input */}
            {!feedback && (
              <input
                type="text"
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder="Write your answer here"
                style={{
                  fontSize: "1.2rem",
                  padding: "0.8rem",
                  width: "80%",
                  maxWidth: "400px",
                  marginBottom: "1rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  textAlign: "center",
                }}
              />
            )}

            {/* Botón Check */}
            {!feedback && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                disabled={!respuesta}
                style={{
                  fontSize: "1.3rem",
                  padding: "0.8rem 2rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              >
                Check
              </button>
            )}

            {/* Feedback (Correct / Incorrect) */}
            {feedback && (
              <p
                style={{
                  fontSize: "1.3rem",
                  margin: "1rem 0",
                  color: feedback === "Correct" ? "#19ba1bff" : "#ff5c5c",
                  fontWeight: "bold",
                }}
              >
                {feedback}
              </p>
            )}

            {/* Mostrar la respuesta correcta siempre en negro */}
            {feedback && (
              <p style={{ fontSize: "1.2rem", color: "black", marginTop: "0.5rem" }}>
                {actual.hora} → {actual.correcta}
              </p>
            )}

            {/* Botones */}
            {feedback && index < ejercicios.length - 1 && (
              <button
                onClick={siguiente}
                className="ejercicio-btn"
                style={{
                  fontSize: "1.3rem",
                  padding: "0.8rem 2rem",
                  borderRadius: "8px",
                  marginTop: "1rem",
                }}
              >
                Next question
              </button>
            )}

            {feedback && index === ejercicios.length - 1 && (
              <button
                onClick={manejarFinalizacion}
                className="ejercicio-btn"
                style={{
                  fontSize: "1.3rem",
                  padding: "0.8rem 2rem",
                  borderRadius: "8px",
                  marginTop: "1rem",
                }}
              >
                Finish
              </button>
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
