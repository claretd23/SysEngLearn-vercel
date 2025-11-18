import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
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

  const audioRef = useRef(new Audio());

  const stopAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const ejercicios = useMemo(
    () => [
      {
        audio: ["/audios/sem8/1_a.mp3", "/audios/sem8/1_b.mp3"],
        pregunta: "How much is the apple?",
        opciones: ["One dollar", "Two dollars", "Three dollars"],
        correcta: "Two dollars"
      },
      {
        audio: ["/audios/sem8/2_a.mp3", "/audios/sem8/2_b.mp3"],
        pregunta: "How much milk is in the fridge?",
        opciones: ["One liter", "Two liters", "Three liters"],
        correcta: "Two liters"
      },
      {
        audio: ["/audios/sem8/3_a.mp3", "/audios/sem8/3_b.mp3"],
        pregunta: "How much is the sandwich?",
        opciones: ["Three dollars", "Four dollars", "Two dollars"],
        correcta: "Three dollars"
      },
      {
        audio: ["/audios/sem8/4_a.mp3", "/audios/sem8/4_b.mp3"],
        pregunta: "How much water is in the bottle?",
        opciones: ["One liter", "Two liters", "Three liters"],
        correcta: "One liter"
      },
      {
        audio: ["/audios/sem8/5_a.mp3", "/audios/sem8/5_b.mp3"],
        pregunta: "How much cheese is in the fridge?",
        opciones: ["300 grams", "500 grams", "700 grams"],
        correcta: "500 grams"
      },
      {
        audio: ["/audios/sem8/6_a.mp3", "/audios/sem8/6_b.mp3"],
        pregunta: "How much is the chocolate?",
        opciones: ["Two dollars", "Three dollars", "Four dollars"],
        correcta: "Two dollars"
      },
      {
        audio: ["/audios/sem8/7_a.mp3", "/audios/sem8/7_b.mp3"],
        pregunta: "How much bread is on the table?",
        opciones: ["Two slices", "Three slices", "Four slices"],
        correcta: "Three slices"
      },
      {
        audio: ["/audios/sem8/8_a.mp3", "/audios/sem8/8_b.mp3"],
        pregunta: "How much juice is in the glass?",
        opciones: ["One glass", "Two glasses", "Three glasses"],
        correcta: "One glass"
      },
      {
        audio: ["/audios/sem8/9_a.mp3", "/audios/sem8/9_b.mp3"],
        pregunta: "How much is the pizza?",
        opciones: ["Five dollars", "Six dollars", "Seven dollars"],
        correcta: "Six dollars"
      },
      {
        audio: ["/audios/sem8/10_a.mp3", "/audios/sem8/10_b.mp3"],
        pregunta: "How much sugar is in the jar?",
        opciones: ["Half a kilogram", "One kilogram", "One and a half kilograms"],
        correcta: "Half a kilogram"
      }
    ],
    []
  );

  const actual = ejercicios[index];

  const playAudio = async () => {
    stopAudio(); // detener audio previo

    for (let src of actual.audio) {
      audioRef.current.src = src;
      await audioRef.current.play();
      await new Promise((resolve) => {
        audioRef.current.onended = resolve;
      });
    }
  };

  // 🔴 DETENER AUDIO CUANDO CAMBIA LA PREGUNTA
  useEffect(() => {
    stopAudio();
  }, [index]);

  // 🔴 DETENER AUDIO AL SALIR DEL COMPONENTE
  useEffect(() => {
    return () => stopAudio();
  }, []);

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
    stopAudio(); // detener audio antes del cambio
    setRespuesta(null);
    setSeleccion(null);

    if (index + 1 < ejercicios.length) {
      setIndex(index + 1);
    } else {
      finalizar();
    }
  };

  const finalizar = async () => {
    stopAudio(); // detener audio al finalizar
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
                  Listen to each dialogue and choose the correct answer.
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
