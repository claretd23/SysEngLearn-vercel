import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

interface EjercicioTexto {
  oracion: string;
  correcta: string;
}

export default function Tema3_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const navigate = useNavigate();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;

  const [index, setIndex] = useState(0);
  const [respuesta, setRespuesta] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [oracionMostrada, setOracionMostrada] = useState("");

  // URL base como en tu ejercicio Tema1_Ej1
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const ejercicios: EjercicioTexto[] = [
    { oracion: "I like this book. I want to read ___", correcta: "it" },
    { oracion: "Can you help me? Yes, I can help ___", correcta: "you" },
    { oracion: "She knows John. She often sees ___", correcta: "him" },
    { oracion: "I met Sarah yesterday. I spoke to ___", correcta: "her" },
    { oracion: "This gift is for my brother. Give it to ___", correcta: "him" },
    { oracion: "The teacher is talking to the students. She listens to ___", correcta: "them" },
    { oracion: "I don’t understand this. Can you explain ___?", correcta: "it" },
    { oracion: "We invited Tom and Anna. Did you see ___ at the party?", correcta: "them" },
    { oracion: "I love this movie. Have you seen ___?", correcta: "it" },
    { oracion: "Peter is very nice. I like ___ very much.", correcta: "him" },
  ];

  const actual = ejercicios[index];

  // Actualizar oración al entrar y al cambiar de ejercicio
  useState(() => {
    setOracionMostrada(actual.oracion);
  });

  const guardarProgreso = async () => {
    const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");

    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
    }

    if (!API_URL || !token) return;

    try {
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
    const esCorrecta = respuesta.trim().toLowerCase() === actual.correcta;

    // Mostrar oración completada automáticamente
    const oracionCompletada = actual.oracion.replace("___", actual.correcta);
    setOracionMostrada(oracionCompletada);

    if (esCorrecta) {
      setFeedback("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setFeedback("Incorrect");
    }
  };

  const siguiente = async () => {
    setFeedback(null);
    setRespuesta("");

    await guardarProgreso();

    if (index < ejercicios.length - 1) {
      const nuevoIndex = index + 1;
      setIndex(nuevoIndex);
      setOracionMostrada(ejercicios[nuevoIndex].oracion);
    } else {
      manejarFinalizacion();
    }
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
              Sentence {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section
            className="tarjeta-ejercicio"
            style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}
          >
            {/* Instrucción solo en la primera oración */}
            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1rem" }}>
                <p className="instruccion-ejercicio" style={{ fontSize: "1.1rem" }}>
                  Complete each sentence with the correct <b>object pronoun</b>.
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
              }}
            >
              <p>{oracionMostrada}</p>
            </div>

            {/* Input */}
            {!feedback && (
              <input
                type="text"
                placeholder="Write your answer..."
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                style={{
                  fontSize: "1.2rem",
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginBottom: "1rem",
                  textAlign: "center",
                  minWidth: "150px",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && respuesta.trim()) verificar();
                }}
              />
            )}

            {/* Botón Check */}
            {!feedback && (
              <div>
                <button
                  onClick={verificar}
                  className="ejercicio-btn"
                  disabled={!respuesta.trim()}
                  style={{
                    fontSize: "1.3rem",
                    padding: "0.8rem 2rem",
                    borderRadius: "8px",
                  }}
                >
                  Check
                </button>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <p
                style={{
                  fontSize: "1.3rem",
                  color: feedback === "Correct" ? "green" : "red",
                  margin: "1rem 0",
                }}
              >
                {feedback}
              </p>
            )}

            {/* Botón siguiente */}
            {feedback && (
              <button
                onClick={siguiente}
                className="ejercicio-btn"
                style={{
                  fontSize: "1.3rem",
                  padding: "0.8rem 2rem",
                  borderRadius: "8px",
                }}
              >
                {index === ejercicios.length - 1 ? "Finish" : "Next"}
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
