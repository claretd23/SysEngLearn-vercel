import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import "../ejercicios.css";

export default function Tema1_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const ejercicios = useMemo(
    () => [
      {
        audio: "/audios/sem2/e3_1.mp3",
        pregunta: "Where is the bank?",
        opciones: ["Behind the supermarket", "Next to the supermarket", "In front of the school"],
        correcta: "Next to the supermarket",
      },
      {
        audio: "/audios/sem2/e3_2.mp3",
        pregunta: "Where is the cat?",
        opciones: ["On the table", "Under the table", "Behind the sofa"],
        correcta: "Under the table",
      },
      {
        audio: "/audios/sem2/e3_3.mp3",
        pregunta: "Where is the tree?",
        opciones: ["Behind the house", "Between the houses", "In front of the house"],
        correcta: "In front of the house",
      },
      {
        audio: "/audios/sem2/e3_4.mp3",
        pregunta: "Where are the shoes?",
        opciones: ["Under the bed", "On the box", "Behind the door"],
        correcta: "Under the bed",
      },
      {
        audio: "/audios/sem2/e3_5.mp3",
        pregunta: "Where is the park?",
        opciones: ["Next to the supermarket", "Between the library and the school", "In front of the school"],
        correcta: "Between the library and the school",
      },
      {
        audio: "/audios/sem2/e3_6.mp3",
        pregunta: "Where is the bus stop?",
        opciones: ["Behind the hospital", "In front of the hospital", "Between the hospital and the park"],
        correcta: "In front of the hospital",
      },
      {
        audio: "/audios/sem2/e3_7.mp3",
        pregunta: "Where is the dog?",
        opciones: ["Behind the sofa", "On the sofa", "Under the chair"],
        correcta: "Behind the sofa",
      },
      {
        audio: "/audios/sem2/e3_8.mp3",
        pregunta: "Where is the restaurant?",
        opciones: ["Between the bank and the school", "Next to the movie theater", "In front of the park"],
        correcta: "Next to the movie theater",
      },
      {
        audio: "/audios/sem2/e3_9.mp3",
        pregunta: "Where are the toys?",
        opciones: ["In the box", "On the chair", "Between the boxes"],
        correcta: "In the box",
      },
      {
        audio: "/audios/sem2/e3_10.mp3",
        pregunta: "Where is the car?",
        opciones: ["In front of the house", "Behind the house", "On the street"],
        correcta: "Behind the house",
      },
    ],
    []
  );

  const actual = ejercicios[index];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    audioRef.current?.play();
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
      setRespuesta("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect.\n\nCorrect answer: ${actual.correcta}`);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setOpcionSeleccionada(null);

    if (index + 1 < ejercicios.length) {
      setIndex(index + 1);
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
            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
                <p className="instruccion-ejercicio">
                  Listen carefully to each sentence and choose the correct place.
                </p>
              </div>
            )}

            {/* AUDIO */}
            <button
              className="btn-audio"
              style={{ fontSize: "2rem", margin: "1rem 0" }}
              onClick={playAudio}
            >
              🔊
            </button>
            <audio ref={audioRef} src={actual.audio} />

            {/* Pregunta */}
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
                whiteSpace: "pre-line",
              }}
            >
              <p>{actual.pregunta}</p>
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
                    className={`opcion-btn ${
                      opcionSeleccionada === op ? "seleccionada" : ""
                    }`}
                    onClick={() => setOpcionSeleccionada(op)}
                    style={{
                      fontSize: "1.2rem",
                      padding: "0.8rem 1.5rem",
                      minWidth: "200px",
                    }}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}

            {/* Botón Check */}
            {!respuesta && opcionSeleccionada && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                style={{
                  fontSize: "1.3rem",
                  padding: "0.8rem 2rem",
                  marginBottom: "1rem",
                }}
              >
                Check
              </button>
            )}
              {respuesta && (
                <p
                  className={`respuesta-feedback ${
                    esCorrecta ? "correcta" : "incorrecta"
                  }`}
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
            {/* Next / Finish */}
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
