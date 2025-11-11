import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "../ejercicios.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tema2_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string | null>(null);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const ejercicios = [
    {
      audio: "/audios/sem6/ej3_1.mp3",
      pregunta: "I have a ______ dog.",
      opciones: [
        "small beautiful white dog",
        "white small beautiful dog",
        "beautiful small white dog",
      ],
      correcta: "beautiful small white dog",
    },
    {
      audio: "/audios/sem6/ej3_2.mp3",
      pregunta: "She is wearing a ______ dress.",
      opciones: [
        "long red nice dress",
        "nice long red dress",
        "red nice long dress",
      ],
      correcta: "nice long red dress",
    },
    {
      audio: "/audios/sem6/ej3_3.mp3",
      pregunta: "He lives in a ______ house.",
      opciones: [
        "yellow big house",
        "big yellow house",
        "house big yellow",
      ],
      correcta: "big yellow house",
    },
    {
      audio: "/audios/sem6/ej3_4.mp3",
      pregunta: "I bought a ______ car.",
      opciones: [
        "black new car",
        "new black car",
        "car black new",
      ],
      correcta: "new black car",
    },
    {
      audio: "/audios/sem6/ej3_5.mp3",
      pregunta: "They have a ______ baby.",
      opciones: [
        "little cute baby",
        "baby cute little",
        "cute little baby",
      ],
      correcta: "cute little baby",
    },
    {
      audio: "/audios/sem6/ej3_6.mp3",
      pregunta: "We saw a ______ park.",
      opciones: [
        "green big beautiful park",
        "big beautiful green park",
        "beautiful big green park",
      ],
      correcta: "beautiful big green park",
    },
    {
      audio: "/audios/sem6/ej3_7.mp3",
      pregunta: "She has a ______ bag.",
      opciones: [
        "nice small brown bag",
        "brown nice small bag",
        "small brown nice bag",
      ],
      correcta: "nice small brown bag",
    },
    {
      audio: "/audios/sem6/ej3_8.mp3",
      pregunta: "I want a ______ chair.",
      opciones: [
        "large comfortable blue chair",
        "comfortable large blue chair",
        "blue comfortable large chair",
      ],
      correcta: "comfortable large blue chair",
    },
    {
      audio: "/audios/sem6/ej3_9.mp3",
      pregunta: "We visited an ______ church.",
      opciones: [
        "old white church",
        "white old church",
        "church old white",
      ],
      correcta: "old white church",
    },
    {
      audio: "/audios/sem6/ej3_10.mp3",
      pregunta: "He is driving a ______ car.",
      opciones: [
        "fast red car",
        "red fast car",
        "car red fast",
      ],
      correcta: "fast red car",
    },
  ];

  const actual = ejercicios[index];

  const playAudio = () => {
    audioRef.current?.play();
  };

  const verificar = (opcion: string) => {
    setRespuestaSeleccionada(opcion);
    setRespuestaCorrecta(actual.correcta);
    if (opcion === actual.correcta) {
      setCorrectas(prev => prev + 1);
    }
  };

  const siguiente = () => {
    setRespuestaSeleccionada(null);
    setRespuestaCorrecta(null);
    setIndex(index + 1);
  };

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
                  Listen carefully to the sentence. You will hear a description that includes
                  two or three adjectives. Choose the option with the correct order of adjectives.
                </p>
              </div>
            )}

            <button
              onClick={playAudio}
              className="btn-audio"
              style={{ fontSize: "2rem", marginBottom: "1rem" }}
            >
              🔊
            </button>
            <audio ref={audioRef} src={actual.audio} />

            <p style={{ margin: "1rem 0", fontStyle: "italic" }}>{actual.pregunta}</p>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem" }}>
              {actual.opciones.map((opcion, i) => (
                <button
                  key={i}
                  className={`opcion-btn ${
                    respuestaSeleccionada
                      ? opcion === respuestaCorrecta
                        ? "correcta"
                        : opcion === respuestaSeleccionada
                        ? "incorrecta"
                        : ""
                      : ""
                  }`}
                  onClick={() => verificar(opcion)}
                  disabled={!!respuestaSeleccionada}
                  style={{
                    width: "70%",
                    fontSize: "1.1rem",
                    padding: "0.8rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                >
                  {opcion}
                </button>
              ))}
            </div>

            {respuestaSeleccionada && (
              <div style={{ marginTop: "1.5rem" }}>
                {index < ejercicios.length - 1 ? (
                  <button
                    onClick={siguiente}
                    className="ejercicio-btn"
                    style={{ fontSize: "1.2rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
                  >
                    Next question
                  </button>
                ) : (
                  <button
                    onClick={manejarFinalizacion}
                    className="ejercicio-btn"
                    style={{ fontSize: "1.2rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
                  >
                    Finish
                  </button>
                )}
              </div>
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
