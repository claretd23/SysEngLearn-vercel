import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import "../ejercicios.css";

export default function Tema3_Ej3() {
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
        audios: ["/audios/weather/1a.mp3", "/audios/weather/1b.mp3"],
        pregunta: "What is the weather today?",
        opciones: ["Rainy", "Sunny", "Snowy"],
        correcta: "Sunny",
      },
      {
        audios: ["/audios/weather/2a.mp3", "/audios/weather/2b.mp3"],
        pregunta: "What will the weather be like this afternoon?",
        opciones: ["Rainy and windy", "Sunny", "Snowy"],
        correcta: "Rainy and windy",
      },
      {
        audios: ["/audios/weather/3a.mp3", "/audios/weather/3b.mp3"],
        pregunta: "What is the weather like in the morning?",
        opciones: ["Sunny", "Cloudy", "Snowy"],
        correcta: "Cloudy",
      },
      {
        audios: ["/audios/weather/4a.mp3", "/audios/weather/4b.mp3"],
        pregunta: "What is the temperature today?",
        opciones: ["0°C", "20°C", "10°C"],
        correcta: "0°C",
      },
      {
        audios: ["/audios/weather/5a.mp3", "/audios/weather/5b.mp3"],
        pregunta: "What is the weather like today?",
        opciones: ["Hot", "Cold", "Rainy"],
        correcta: "Hot",
      },
      {
        audios: ["/audios/weather/6a.mp3", "/audios/weather/6b.mp3"],
        pregunta: "What is the weather condition?",
        opciones: ["Foggy", "Sunny", "Windy"],
        correcta: "Foggy",
      },
      {
        audios: ["/audios/weather/7a.mp3", "/audios/weather/7b.mp3"],
        pregunta: "What is the weather like this afternoon?",
        opciones: ["Sunny", "Windy", "Rainy"],
        correcta: "Windy",
      },
      {
        audios: ["/audios/weather/8a.mp3", "/audios/weather/8b.mp3"],
        pregunta: "What will happen this evening?",
        opciones: ["Thunderstorm", "Sunny", "Fog"],
        correcta: "Thunderstorm",
      },
      {
        audios: ["/audios/weather/9a.mp3", "/audios/weather/9b.mp3"],
        pregunta: "What is the weather now?",
        opciones: ["Snowy", "Light rain", "Sunny"],
        correcta: "Light rain",
      },
      {
        audios: ["/audios/weather/10a.mp3", "/audios/weather/10b.mp3"],
        pregunta: "What is the temperature today?",
        opciones: ["0°C", "-2°C", "5°C"],
        correcta: "-2°C",
      },
    ],
    []
  );

  const actual = ejercicios[index];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioIndex, setAudioIndex] = useState(0);

  // Reproduce ambos audios en secuencia
  const playAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.src = actual.audios[audioIndex];
    audioRef.current.play();
    audioRef.current.onended = () => {
      if (audioIndex + 1 < actual.audios.length) {
        setAudioIndex((prev) => prev + 1);
      } else {
        setAudioIndex(0);
      }
    };
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

      if (!res.ok) console.error("Error saving progress:", res.statusText);
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
    setRespuesta(null);
    setSeleccion(null);
    setAudioIndex(0);

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
                  Listen carefully to each dialogue or forecast. Choose the correct answer (a, b, or c) based on the weather description. Focus on weather vocabulary: sunny, rainy, windy, cloudy, hot, cold, snow, fog, thunderstorm.
                </p>
              </div>
            )}

            <button
              className="btn-audio"
              style={{ fontWeight: "bold", fontSize: "1.5rem", margin: "1rem 0" }}
              onClick={playAudio}
            >
              Audio
            </button>
            <audio ref={audioRef} />

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
                    style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem", minWidth: "220px" }}
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
