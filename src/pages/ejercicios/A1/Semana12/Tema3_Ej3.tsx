import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
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
  const [audioIndex, setAudioIndex] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  // Solo 5 audios
  const fullDialogue = [
    "/audios/sem11/21.mp3",
    "/audios/sem11/22.mp3",
    "/audios/sem11/23.mp3",
    "/audios/sem11/24.mp3",
    "/audios/sem11/25.mp3",
  ];

  const ejercicios = [
    {
      audio: fullDialogue,
      pregunta: "What will Tom do tomorrow?",
      opciones: [
        "He will go to the park and take his dog",
        "He will stay home and watch TV",
        "He will go shopping and play football",
      ],
      correcta: "He will go to the park and take his dog",
    },
    {
      audio: fullDialogue,
      pregunta: "Will Tom stay at home all day?",
      opciones: [
        "Yes, and he will read a book",
        "No, he will go to the park and maybe meet Paul",
        "No, he will go swimming and clean his room",
      ],
      correcta: "No, he will go to the park and maybe meet Paul",
    },
    {
      audio: fullDialogue,
      pregunta: "What will Tom take to the park?",
      opciones: [
        "His football and his backpack",
        "His dog and maybe meet Paul",
        "His sister and his bike",
      ],
      correcta: "His dog and maybe meet Paul",
    },
    {
      audio: fullDialogue,
      pregunta: "Will Tom play football if it rains?",
      opciones: [
        "Yes, he will play with Paul",
        "No, he won’t play and the football will stay at home",
        "Maybe, he will play later in the evening",
      ],
      correcta: "No, he won’t play and the football will stay at home",
    },
    {
      audio: fullDialogue,
      pregunta: "Where will Emma go tomorrow?",
      opciones: [
        "To the library and she will do her homework",
        "To the park and she will play football",
        "To the cinema and she will meet Paul",
      ],
      correcta: "To the library and she will do her homework",
    },
  ];

  const actual = ejercicios[index];

  // Reproducción automática de audios en secuencia (solo en la primera pregunta)
  const playAudio = () => {
    if (index !== 0 || !audioRef.current) return;
    setAudioIndex(0);
  };

  useEffect(() => {
    if (!audioRef.current || index !== 0) return;
    const currentSrc = actual.audio[audioIndex];
    if (!currentSrc) return;

    audioRef.current.src = currentSrc;
    audioRef.current.play().catch(() => {});

    const handleEnded = () => {
      if (audioIndex + 1 < actual.audio.length) {
        setAudioIndex(audioIndex + 1);
      }
    };

    audioRef.current.addEventListener("ended", handleEnded);
    return () => {
      audioRef.current?.removeEventListener("ended", handleEnded);
    };
  }, [audioIndex, index, actual.audio]);

  const guardarProgreso = async () => {
    const completados = JSON.parse(
      localStorage.getItem("ejercicios_completados") || "[]"
    );

    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem(
        "ejercicios_completados",
        JSON.stringify(completados)
      );
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

      if (!res.ok) console.error("Error saving:", res.statusText);
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
    stopAudio();
    setRespuesta(null);
    setSeleccion(null);
    setAudioIndex(0);

    if (index + 1 < ejercicios.length) setIndex(index + 1);
    else finalizar();
  };

  const finalizar = async () => {
    stopAudio();
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
                    Listen to the dialogue carefully and answer the questions.
                  </p>
                </div>

                <button
                  className="btn-audio"
                  style={{ fontSize: "2rem", margin: "1rem 0" }}
                  onClick={playAudio}
                >
                  🔊
                </button>
                <audio ref={audioRef} />
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
          <p>Redirecting...</p>
        </div>
      )}
    </div>
  );
}
