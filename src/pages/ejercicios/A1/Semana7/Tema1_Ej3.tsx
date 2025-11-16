import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import "../ejercicios.css";

export default function Tema1_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const ejercicios = useMemo(
    () => [
      {
        audio:  ["/audios/sem7/1_a.mp3", "/audios/sem7/1_b.mp3"],
        pregunta: "Which sentence is true?",
        opciones: [
          "The backpack is blue.",
          "The red backpack belongs to her.",
          "Both backpacks are hers."
        ],
        correcta: "The red backpack belongs to her."
      },
      {
        audio: ["/audios/sem7/2_a.mp3", "/audios/sem7/2_b.mp3"],
        pregunta: "Which sentence is true?",
        opciones: [
          "The black shoes are his.",
          "The black shoes are mine.",
          "Both shoes are theirs."
        ],
        correcta: "The black shoes are mine."
      },
      {
        audio: ["/audios/sem7/3_a.mp3", "/audios/sem7/3_b.mp3"],
        pregunta: "Which sentence is true?",
        opciones: [
          "The green notebook is hers.",
          "The green notebook is mine.",
          "Both notebooks are mine."
        ],
        correcta: "The green notebook is hers."
      },
      {
        audio: ["/audios/sem7/4_a.mp3", "/audios/sem7/4_b.mp3"],
        pregunta: "Which sentence is true?",
        opciones: [
          "The blue pen belongs to them.",
          "The blue pen belongs to me.",
          "Both pens are theirs."
        ],
        correcta: "The blue pen belongs to me."
      },
      {
        audio: ["/audios/sem7/5_a.mp3", "/audios/sem7/5_b.mp3"],
        pregunta: "Which sentence is true?",
        opciones: [
          "The yellow hat is mine.",
          "The yellow hat is his.",
          "Both hats are mine."
        ],
        correcta: "The yellow hat is his."
      },
      {
        audio: ["/audios/sem7/6_a.mp3", "/audios/sem7/6_b.mp3"],
        pregunta: "Which sentence is true?",
        opciones: [
          "The red keys are ours.",
          "The red keys are hers.",
          "Both keys are hers."
        ],
        correcta: "The red keys are ours."
      },
      {
        audio: ["/audios/sem7/7_a.mp3", "/audios/sem7/7_b.mp3"],
        pregunta: "Which sentence is true?",
        opciones: [
          "The black glasses are his.",
          "The black glasses are mine.",
          "Both glasses are mine."
        ],
        correcta: "The black glasses are his."
      },
      {
        audio: ["/audios/sem7/8_a.mp3", "/audios/sem7/8_b.mp3"],
        pregunta: "Which sentence is true?",
        opciones: [
          "The green jacket is yours.",
          "The green jacket is theirs.",
          "Both jackets are theirs."
        ],
        correcta: "The green jacket is yours."
      },
      {
        audio: ["/audios/sem7/9_a.mp3", "/audios/sem7/9_b.mp3"],
        pregunta: "Which sentence is true?",
        opciones: [
          "The silver laptop is mine.",
          "The silver laptop is his.",
          "Both laptops are his."
        ],
        correcta: "The silver laptop is mine."
      },
      {
        audio: ["/audios/sem7/10_a.mp3", "/audios/sem7/10_b.mp3"],
        pregunta: "Which sentence is true?",
        opciones: [
          "The blue shoes are hers.",
          "The blue shoes are ours.",
          "Both shoes are hers."
        ],
        correcta: "The blue shoes are hers."
      }
    ],
    []
  );

  const actual = ejercicios[index];
  const audioRef = useRef(new Audio());

  const playAudio = async () => {
    for (let src of actual.audio) {
      audioRef.current.src = src;
      await audioRef.current.play();

      // esperar a que termine
      await new Promise((resolve) => {
        audioRef.current.onended = resolve;
      });
    }
  };

  // ======================
  // GUARDAR PROGRESO
  // ======================
  const guardarProgreso = async () => {
    const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");

    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
    }

    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/progreso`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nivel, semana, tema, ejercicio }),
      });

      if (!res.ok) {
        console.error("Error saving progress:", res.statusText);
      }
    } catch (error) {
      console.error("Progress error:", error);
    }
  };

  // ======================
  // VERIFICAR RESPUESTA
  // ======================
  const verificar = () => {
    if (!seleccion) return;

    if (seleccion === actual.correcta) {
      setRespuesta("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect.\n\nCorrect answer: ${actual.correcta}`);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setSeleccion(null);

    if (index + 1 < ejercicios.length) {
      setIndex(index + 1);
    } else {
      finalizar();
    }
  };

  const finalizar = async () => {
    await guardarProgreso();
    setFinalizado(true);

    setTimeout(() => {
      navigate(`/inicio/${nivel}`);
      window.location.reload();
    }, 3000);
  };

  const esCorrecta = respuesta?.startsWith("Correct");

  // ======================
  // RENDER
  // ======================
  return (
    <div className="ejercicio-container">
      {!finalizado ? (
        <>
          <header className="ejercicio-header">
            <h1 className="titulo-ejercicio">EXERCISE 3</h1>
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
                  Listen to each dialogue and choose the correct possessive adjective.
                </p>
              </div>
            )}

            <button
              className="btn-audio"
              style={{ fontSize: "2rem", margin: "1rem 0" }}
              onClick={playAudio}
            >
              🔊
            </button>

            <div
              className="oracion-box"
              style={{
                backgroundColor: "#f4f6fa",
                borderLeft: "5px solid #222a5c",
                borderRadius: "8px",
                padding: "1.5rem",
                margin: "1rem auto",
                maxWidth: "600px",
                textAlign: "left",
                fontStyle: "italic",
              }}
            >
              <p>{actual.pregunta}</p>
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
                    className={`opcion-btn ${seleccion === op ? "seleccionada" : ""}`}
                    onClick={() => setSeleccion(op)}
                    style={{
                      fontSize: "1.2rem",
                      padding: "0.8rem 1.5rem",
                      minWidth: "220px",
                    }}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}

            {!respuesta && seleccion && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                style={{ fontSize: "1.3rem", padding: "0.8rem 2rem" }}
              >
                Check
              </button>
            )}

            {respuesta && (
              <p
                className={`respuesta-feedback ${esCorrecta ? "correcta" : "incorrecta"}`}
                style={{
                  fontSize: "1.3rem",
                  margin: "1rem 0",
                  color: esCorrecta ? "green" : "red",
                  fontWeight: 600,
                  whiteSpace: "pre-line",
                }}
              >
                {respuesta}
              </p>
            )}

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
                onClick={finalizar}
                className="ejercicio-btn"
                style={{ fontSize: "1.3rem", padding: "0.8rem 2rem" }}
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
            Correct answers:{" "}
            <strong>
              {correctas} / {ejercicios.length}
            </strong>
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}