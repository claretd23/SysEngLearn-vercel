import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import "../ejercicios.css";

export default function Tema2_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // === Lista de ejercicios ===
  const ejercicios = useMemo(
    () => [
      { audio: "/audios/sem2/q1.mp3", pregunta: "I need _ orange.", opciones: ["a", "an", "the"], correcta: "an" },
      { audio: "/audios/sem2/q2.mp3", pregunta: "He is _ actor.", opciones: ["a", "an", "the"], correcta: "an" },
      { audio: "/audios/sem2/q3.mp3", pregunta: "I saw _ cat in the garden.", opciones: ["the", "a", "an"], correcta: "a" },
      { audio: "/audios/sem2/q4.mp3", pregunta: "She has _ old book.", opciones: ["a", "the", "an"], correcta: "an" },
      { audio: "/audios/sem2/q5.mp3", pregunta: "They are at _ airport.", opciones: ["an", "the", "a"], correcta: "the" },
      { audio: "/audios/sem2/q6.mp3", pregunta: "Look! It’s _ elephant!", opciones: ["a", "the", "an"], correcta: "an" },
      { audio: "/audios/sem2/q7.mp3", pregunta: "We had _ amazing dinner.", opciones: ["a", "the", "an"], correcta: "an" },
      { audio: "/audios/sem2/q8.mp3", pregunta: "_ sun is shining.", opciones: ["A", "An", "The"], correcta: "The" },
      { audio: "/audios/sem2/q9.mp3", pregunta: "He bought _ umbrella.", opciones: ["a", "an", "the"], correcta: "an" },
      { audio: "/audios/sem2/q10.mp3", pregunta: "I want to watch _ movie tonight.", opciones: ["the", "a", "an"], correcta: "a" },
    ],
    []
  );

  const actual = ejercicios[index];

  // === Guardar progreso ===
  const guardarProgreso = async () => {
    const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/progreso", {
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

  // === Verificar respuesta ===
  const verificar = () => {
    if (!opcionSeleccionada) return;

    const oracionCompletada = actual.pregunta.replace("_", opcionSeleccionada);

    if (opcionSeleccionada === actual.correcta) {
      setRespuesta(`✅ Correct!\n\n${oracionCompletada}`);
      setCorrectas((prev) => prev + 1);
    } else {
      const oracionCorrecta = actual.pregunta.replace("_", actual.correcta);
      setRespuesta(`❌ Incorrect.\n\n${oracionCorrecta}`);
    }
  };

  // === Siguiente pregunta ===
  const siguiente = () => {
    setRespuesta(null);
    setOpcionSeleccionada(null);
    setIndex(index + 1);
  };

  // === Finalizar ejercicio ===
  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => {
      navigate(`/inicio/${nivel}`);
      window.location.reload();
    }, 3000);
  };

  // === Reproducir audio ===
  const reproducirAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
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
            {/* Instrucción */}
            <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
              <p className="instruccion-ejercicio">
                🎧 Listen and choose the correct article to complete the sentence.
              </p>
            </div>

            {/* Audio */}
            <div style={{ marginBottom: "1.5rem" }}>
              <audio ref={audioRef} src={actual.audio} />
              <button
                onClick={reproducirAudio}
                className="ejercicio-btn"
                style={{ fontSize: "1.1rem", padding: "0.6rem 1.5rem" }}
              >
                ▶️ Play Audio
              </button>
            </div>

            {/* Oración */}
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
              <p>{respuesta ? respuesta.split("\n").slice(1).join("\n") : actual.pregunta}</p>
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
                    style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem", minWidth: "200px" }}
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
                className={`respuesta-feedback ${respuesta.startsWith("✅") ? "correcta" : "incorrecta"}`}
                style={{ fontSize: "1.3rem", margin: "1rem 0" }}
              >
                {respuesta.split("\n")[0]}
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
          <h2>✅ You have completed the exercise!</h2>
          <p>
            Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
