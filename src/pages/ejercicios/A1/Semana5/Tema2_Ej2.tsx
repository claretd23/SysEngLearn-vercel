import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tema2_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios = [
    {
      pregunta: "I need ___",
      opciones: [
        "a red nice small car",
        "a small nice red car",
        "a nice small red car",
        "a red small nice car",
      ],
      correcta: "a nice small red car",
    },
    {
      pregunta: "She has ___ in her room.",
      opciones: [
        "a beautiful round small table",
        "a small round beautiful table",
        "a beautiful small round table",
        "a round beautiful small table",
      ],
      correcta: "a beautiful small round table",
    },
    {
      pregunta: "They live in ___ at the end of the street.",
      opciones: [
        "a big old white house",
        "a white big old house",
        "an old big white house",
        "an old white big house",
      ],
      correcta: "a big old white house",
    },
    {
      pregunta: "He’s wearing ___ today.",
      opciones: [
        "a black long elegant coat",
        "an elegant long black coat",
        "a long black elegant coat",
        "a long elegant black coat",
      ],
      correcta: "an elegant long black coat",
    },
    {
      pregunta: "I see ___ at the park.",
      opciones: [
        "a brown big friendly dog",
        "a friendly big brown dog",
        "a big brown friendly dog",
        "a big friendly brown dog",
      ],
      correcta: "a friendly big brown dog",
    },
    {
      pregunta: "She needs___ for the wedding.",
      opciones: [
        "a silk blue long beautiful dress",
        "a long blue beautiful silk dress",
        "a beautiful long blue silk dress",
        "a blue silk beautiful long dress",
      ],
      correcta: "a beautiful long blue silk dress",
    },
    {
      pregunta: "We will have ___.",
      opciones: [
        "a great small family dinner",
        "a small great family dinner",
        "a great small family dinner",
        "a family great small dinner",
      ],
      correcta: "a great small family dinner",
    },
    {
      pregunta: "He is going to give me ___ for my birthday.",
      opciones: [
        "a silver small cute ring",
        "a cute small silver ring",
        "a small cute silver ring",
        "a cute small silver ring",
      ],
      correcta: "a cute small silver ring",
    },
    {
      pregunta: "They are adopting ___ from the shelter.",
      opciones: [
        "a little cute white cat",
        "a cute little white cat",
        "a white cute little cat",
        "a little white cute cat",
      ],
      correcta: "a cute little white cat",
    },
    {
      pregunta: "I need ___ for the living room.",
      opciones: [
        "a big beautiful modern sofa",
        "a modern big beautiful sofa",
        "a beautiful big modern sofa",
        "a beautiful modern big sofa",
      ],
      correcta: "a beautiful big modern sofa",
    },
  ];

  const actual = ejercicios[index];

  const guardarProgreso = async () => {
    try {
      const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
      if (!completados.includes(id)) {
        completados.push(id);
        localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
      }

      const token = localStorage.getItem("token");
      if (token) {
        const res = await fetch(`${API_URL}/api/progreso`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nivel, semana, tema, ejercicio }),
        });
        if (!res.ok) console.error("Error al guardar progreso:", res.statusText);
      }
    } catch (error) {
      console.error("Error al guardar progreso:", error);
    }
  };

  const verificar = async () => {
    if (!opcionSeleccionada) return;

    if (opcionSeleccionada === actual.correcta) {
      setRespuesta("Correct");
      setCorrectas((prev) => prev + 1);
      await guardarProgreso();
    } else {
      setRespuesta("Incorrect");
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
                <p className="instruccion-ejercicio">
                  Multiple Choice: Choose the <b>correct order of words</b> to complete each sentence.
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
              <p>{respuesta ? actual.pregunta.replace("___", opcionSeleccionada || "") : actual.pregunta}</p>
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
                    style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem", minWidth: "250px" }}
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
                className={`respuesta-feedback ${respuesta === "Correct" ? "correcta" : "incorrecta"}`}
                style={{ fontSize: "1.3rem", margin: "1rem 0" }}
              >
                {respuesta}
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
