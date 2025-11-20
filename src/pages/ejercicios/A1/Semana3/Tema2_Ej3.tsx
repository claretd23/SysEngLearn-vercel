import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "../ejercicios.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "../ejercicios.css";

export default function Tema3_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    audioRef.current?.play();
  };

  const ejercicios = [
    {
      texto: "Where is Sofia from?",
      correcta: ["Mexico", "She is from Mexico"],
    },
    {
      texto: "Peter is from Canada. Is he American?",
      correcta: ["No", "No, he isn't","No, he is Canadian", "No, he isn´t american", "no, he is not american" ],
    },
    {
      texto: "Where is Fatima from?",
      correcta: ["Turkey", "She is from Turkey"],
    },
    {
      texto: "Is Ali Mexican?",
      correcta: ["No", "No, he isn't"],
    },
    {
      texto: "Is Laura Turkish?",
      correcta: ["No", "No, she isn't"],
    },
    {
      texto: "Where is Yara from?",
      correcta: ["Colombia", "She is from Colombia"],
    },
    {
      texto: "Is Marco Mexican?",
      correcta: ["No", "No, he isn't"],
    },
    {
      texto: "Where is Marco from?",
      correcta: ["Spain", "He is from Spain"],
    },
    {
      texto: "Where is Yara from?",
      correcta: ["Colombia", "She is from Colombia"],
    },
    {
      texto: "Is Yara Spanish?",
      correcta: ["No", "No, she isn't"],
    },
  ];

  const actual = ejercicios[index];
  // === GUARDAR PROGRESO ===
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
        console.error("Error al guardar progreso:", res.statusText);
      }
    } catch (error) {
      console.error("Error al guardar el progreso:", error);
    }
  };

  // === VERIFICAR RESPUESTA ===
  const verificar = () => {
    const respuestaUsuario = inputValue.trim().toLowerCase();
    if (!respuestaUsuario) return;

    const esCorrecta = actual.correcta.some(
      (c) => c.toLowerCase() === respuestaUsuario
    );

    if (esCorrecta) {
      setRespuesta("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("Incorrect");
      setInputValue(actual.correcta[0]); // muestra una correcta
    }
  };

  // === SIGUIENTE ===
  const siguiente = () => {
    setRespuesta(null);
    setInputValue("");
    setIndex(index + 1);
  };

  // === FINALIZAR ===
  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => {
      navigate(`/inicio/${nivel}`);
      window.location.reload();
    }, 3000);
  };

  const mostrarTexto = respuesta
    ? actual.texto
    : actual.texto;

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

          <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
            {index === 0 && (
              <div className="instruccion-box">
                <p className="instruccion-ejercicio" style={{ fontSize: "1.2rem" }}>
                  🎧 Listen to the audio and answer the questions.
                </p>
              </div>
            )}

            {/* === AUDIO === */}
            <div style={{ margin: "1rem 0" }}>
              <button
                onClick={playAudio}
                className="btn-audio"
                style={{
                  fontSize: "1.8rem",
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                }}
              >
                🔊
              </button>
              <audio ref={audioRef} src="/audios/sem3/anna_friends.mp3" />
            </div>

            {/* === PREGUNTA === */}
            <p
              className="pregunta-ejercicio"
              style={{
                fontSize: "1.5rem",
                margin: "1rem 0",
                fontWeight: 500,
              }}
            >
              {mostrarTexto}
            </p>

            {/* === INPUT === */}
            {!respuesta && (
              <div
                className="opciones-ejercicio"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                  margin: "1.5rem 0",
                }}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="input-respuesta"
                  placeholder="Write your answer"
                  style={{
                    fontSize: "1.3rem",
                    padding: "0.8rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
                <button
                  onClick={verificar}
                  className="ejercicio-btn"
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

            {/* === FEEDBACK === */}
            {respuesta && (
              <p
                className="respuesta-feedback"
                style={{
                  fontSize: "1.2rem",
                  margin: "1rem 0",
                  fontWeight: "bold",
                  color: respuesta === "Correct" ? "#28A745" : "#DC3545",
                }}
              >
                {respuesta}
              </p>
            )}

            {/* === NAVEGACIÓN === */}
            <div className="botones-siguiente">
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