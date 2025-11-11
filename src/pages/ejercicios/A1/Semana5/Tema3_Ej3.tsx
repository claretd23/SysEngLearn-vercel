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

  // === EJERCICIOS ===
  const ejercicios = [
    {
      texto: "I usually go to school ___ bus every morning.",
      correcta: ["by"],
      audio: "/audios/sem5/ej3_21.mp3",
    },
    {
      texto: "She is sitting ___ the car with her friends.",
      correcta: ["in"],
      audio: "/audios/sem2/sem5/ej3_22.mp3",
    },
    {
      texto: "We travel ___ train to visit our grandparents.",
      correcta: ["by"],
      audio: "/audios/sem5/ej3_23.mp3",
    },
    {
      texto: "He is standing ___ the bus stop waiting for the bus.",
      correcta: ["at"],
      audio: "/audios/sem5/ej3_24.mp3",
    },
    {
      texto: "They are walking ___ the street to get to the park.",
      correcta: ["on"],
      audio: "/audios/sem5/ej3_25.mp3",
    },
    {
      texto: "I always put my bag ___ the taxi.",
      correcta: ["in"],
      audio: "/audios/sem5/ej3_26.mp3",
    },
    {
      texto: "She rides her bicycle ___ school every day.",
      correcta: ["to"],
      audio: "/audios/sem5/ej3_27.mp3",
    },
    {
      texto: "We are going to London ___ plane next week.",
      correcta: ["by"],
      audio: "/audios/sem5/ej3_28.mp3",
    },
    {
      texto: "He sits ___ the front seat of the car.",
      correcta: ["in"],
      audio: "/audios/sem5/ej3_29.mp3",
    },
    {
      texto: "The passengers are waiting ___ the train platform.",
      correcta: ["on"],
      audio: "/audios/sem5/ej3_30.mp3",
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
      setInputValue(actual.correcta[0]);
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
    ? actual.texto.replace("___", actual.correcta[0])
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
                  Listen to the sentence and write the preposition you hear related to transportation or movement.
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
              <audio ref={audioRef} src={actual.audio} />
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
                  placeholder="Type the preposition"
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

            {/* === RETROALIMENTACIÓN === */}
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
