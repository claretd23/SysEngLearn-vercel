import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

interface EjercicioOpciones {
  pregunta: string;
  opciones: string[];
  correcta: string;
}

export default function Tema3_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  // URL del backend
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const ejercicios: EjercicioOpciones[] = [
    {
      pregunta: "I met John yesterday. I spoke to ___?",
      opciones: ["he", "him", "his"],
      correcta: "him",
    },
    {
      pregunta: "Can you help Sarah? Yes, I can help ___?",
      opciones: ["her", "she", "hers"],
      correcta: "her",
    },
    {
      pregunta: "I like this cake. I want to eat ___?",
      opciones: ["it", "its", "they"],
      correcta: "it",
    },
    {
      pregunta: "Did you see Anna and Tom? I saw ___ at the park.",
      opciones: ["them", "they", "their"],
      correcta: "them",
    },
    {
      pregunta: "I do not understand this exercise. Can you explain ___?",
      opciones: ["it", "its", "them"],
      correcta: "it",
    },
    {
      pregunta: "I love Peter. I often talk to ___?",
      opciones: ["him", "he", "his"],
      correcta: "him",
    },
    {
      pregunta: "The teacher is talking to the students. She listens to ___?",
      opciones: ["they", "them", "theirs"],
      correcta: "them",
    },
    {
      pregunta: "I saw the movie yesterday. Have you seen ___?",
      opciones: ["it", "its", "they"],
      correcta: "it",
    },
    {
      pregunta: "I want to call my friend. Can I speak to ___?",
      opciones: ["him", "he", "his"],
      correcta: "him",
    },
    {
      pregunta: "The dog is very cute. I like ___ very much.",
      opciones: ["it", "its", "they"],
      correcta: "it",
    },
  ];

  const actual = ejercicios[index];

  // Guardar progreso como en Tema1_Ej1
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

  // Verificar
  const verificar = () => {
    if (!opcionSeleccionada) return;

    if (opcionSeleccionada === actual.correcta) {
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("Incorrect.");
    }
  };

  const siguiente = async () => {
    setRespuesta(null);
    setOpcionSeleccionada(null);

    await guardarProgreso();

    if (index + 1 < ejercicios.length) {
      setIndex(index + 1);
    } else {
      await manejarFinalizacion();
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

  // Texto con respuesta correcta cuando ya respondió
  const mostrarTexto = respuesta
    ? actual.pregunta.replace("___", actual.correcta)
    : actual.pregunta;

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

          <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
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
              <p>{mostrarTexto}</p>
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
                    style={{
                      fontSize: "1.2rem",
                      padding: "0.8rem 1.5rem",
                      minWidth: "180px",
                    }}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}

            {/* Feedback */}
            {respuesta && (
              <p
                className="respuesta-feedback"
                style={{
                  fontSize: "1.3rem",
                  margin: "1rem 0",
                  color: respuesta === "Correct!" ? "#32be2dff" : "#DC3545",
                }}
              >
                {respuesta}
              </p>
            )}

            {/* Botones */}
            <div className="botones-siguiente" style={{ marginTop: "1rem" }}>
              {respuesta && index < ejercicios.length - 1 && (
                <button
                  onClick={siguiente}
                  className="ejercicio-btn"
                  style={{ fontSize: "1.3rem", padding: "0.8rem 2rem" }}
                >
                  Next question
                </button>
              )}

              {respuesta && index === ejercicios.length - 1 && (
                <button
                  onClick={manejarFinalizacion}
                  className="ejercicio-btn"
                  style={{ fontSize: "1.3rem", padding: "0.8rem 2rem" }}
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
