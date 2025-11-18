import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
import "../ejercicios.css";

export default function Tema2_Ej3() {
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

  const audioRef = useRef<HTMLAudioElement>(new Audio());

  const stopAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  // Se detiene audio al desmontar el componente (salir de la página)
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const fullDialogue = [
    "/audios/sem8/A1.mp3",
    "/audios/sem8/B1.mp3",
    "/audios/sem8/A2.mp3",
    "/audios/sem8/B2.mp3",
    "/audios/sem8/A3.mp3",
    "/audios/sem8/B3.mp3",
    "/audios/sem8/A4.mp3",
    "/audios/sem8/B4.mp3",
    "/audios/sem8/A5.mp3",
    "/audios/sem8/B5.mp3",
    "/audios/sem8/A6.mp3",
    "/audios/sem8/B6.mp3",
    "/audios/sem8/A7.mp3",
    "/audios/sem8/B7.mp3",
    "/audios/sem8/A8.mp3",
    "/audios/sem8/B8.mp3",
    "/audios/sem8/A9.mp3",
    "/audios/sem8/B9.mp3",
    "/audios/sem8/A10.mp3",
    "/audios/sem8/B10.mp3"
  ];

  const ejercicios = useMemo(
    () => [
      {
        audio: fullDialogue,
        pregunta: "How many chairs are in the kitchen?",
        opciones: ["Three", "Four", "Five"],
        correcta: "Four"
      },
      {
        audio: fullDialogue,
        pregunta: "Are there any plates?",
        opciones: ["Yes", "No"],
        correcta: "No"
      },
      {
        audio: fullDialogue,
        pregunta: "How many cups does B have?",
        opciones: ["Six", "Four", "Five"],
        correcta: "Six"
      },
      {
        audio: fullDialogue,
        pregunta: "How many forks are there?",
        opciones: ["Three", "Four", "Five"],
        correcta: "Three"
      },
      {
        audio: fullDialogue,
        pregunta: "Are there any knives?",
        opciones: ["Yes", "No"],
        correcta: "No"
      },
      {
        audio: fullDialogue,
        pregunta: "How many glasses are on the table?",
        opciones: ["Four", "Five", "Six"],
        correcta: "Five"
      },
      {
        audio: fullDialogue,
        pregunta: "Are there any bowls?",
        opciones: ["Yes", "No"],
        correcta: "Yes"
      },
      {
        audio: fullDialogue,
        pregunta: "How many spoons are there?",
        opciones: ["Three", "Four", "Five"],
        correcta: "Four"
      },
      {
        audio: fullDialogue,
        pregunta: "Are there any napkins?",
        opciones: ["Yes", "No"],
        correcta: "No"
      },
      {
        audio: fullDialogue,
        pregunta: "How many bottles of water are there?",
        opciones: ["Two", "Three", "Four"],
        correcta: "Three"
      }
    ],
    []
  );

  const actual = ejercicios[index];

  // -------------------------
  // AUDIO — SOLO en index 0
  // -------------------------
  const playAudio = async () => {
    stopAudio();

    if (index !== 0) return; // 🔥 solo primer ejercicio

    for (let src of actual.audio) {
      audioRef.current.src = src;
      await audioRef.current.play();
      await new Promise(resolve => (audioRef.current.onended = resolve));
    }
  };

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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nivel, semana, tema, ejercicio })
      });

      if (!res.ok) console.error("Error saving:", res.statusText);
    } catch (error) {
      console.error("Progress error:", error);
    }
  };

  const verificar = () => {
    if (!seleccion) return;

    if (seleccion === actual.correcta) {
      setRespuesta("Correct");
      setCorrectas(prev => prev + 1);
    } else {
      setRespuesta(`Incorrect.\n\nCorrect answer: ${actual.correcta}`);
    }
  };

  const siguiente = () => {
    stopAudio(); // 🔥 Detener audio al cambiar pregunta
    setRespuesta(null);
    setSeleccion(null);

    if (index + 1 < ejercicios.length) setIndex(index + 1);
    else finalizar();
  };

  const finalizar = async () => {
    stopAudio(); // 🔥 detener audio al finalizar
    await guardarProgreso();
    setFinalizado(true);

    setTimeout(() => {
      stopAudio();
      navigate(`/inicio/${nivel}`);
      window.location.reload();
    }, 3000);
  };

  const esCorrecta = respuesta?.startsWith("Correct");

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
            {/* AUDIO SOLO EN LA PRIMERA PREGUNTA */}
            {index === 0 && (
              <>
                <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
                  <p className="instruccion-ejercicio">
                    Listen to the full dialogue and answer the questions.
                  </p>
                </div>

                <button
                  className="btn-audio"
                  style={{ fontSize: "2rem", margin: "1rem 0" }}
                  onClick={playAudio}
                >
                  🔊
                </button>
              </>
            )}

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
                fontStyle: "italic"
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
                  marginBottom: "1rem"
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
                      minWidth: "220px"
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
                  whiteSpace: "pre-line"
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
          <p>Redirecting...</p>
        </div>
      )}
    </div>
  );
}
