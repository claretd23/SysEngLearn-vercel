import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "../ejercicios.css";

export default function Tema1_Ej3_Listening() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL; 

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios = [
    { audio: "/audios/sem1/Tema2/28.mp3", correcta: "28" },
    { audio: "/audios/sem1/Tema2/46.mp3", correcta: "46" },
    { audio: "/audios/sem1/Tema2/99.mp3", correcta: "99" },
    { audio: "/audios/sem1/Tema2/105.mp3", correcta: "105" },
    { audio: "/audios/sem1/Tema2/67.mp3", correcta: "67" },
    { audio: "/audios/sem1/Tema2/34.mp3", correcta: "34" },
    { audio: "/audios/sem1/Tema2/82.mp3", correcta: "82" },
    { audio: "/audios/sem1/Tema2/120.mp3", correcta: "120" },
    { audio: "/audios/sem1/Tema2/75.mp3", correcta: "75" },
    { audio: "/audios/sem1/Tema2/150.mp3", correcta: "150" },
  ];

  const actual = ejercicios[index];
  const audioRef = useRef<HTMLAudioElement>(null);

  const reproducirAudio = () => {
    audioRef.current?.play();
  };

  const guardarProgreso = async () => {
    const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/progreso`, { // ✅ URL corregida
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
    const respuestaUsuario = inputValue.trim().toLowerCase();
    if (!respuestaUsuario) return;
    if (respuestaUsuario === actual.correcta.toLowerCase()) {
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect. The correct answer is "${actual.correcta}".`);
    }
  };

  const siguiente = () => {
    setInputValue("");
    setRespuesta(null);
    setIndex(index + 1);
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

          <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
            {index === 0 && (
              <div className="instruccion-box">
                <p className="instruccion-ejercicio">
                  Listen to the audio and write the number in numerals.
                </p>
              </div>
            )}

            {/* Botón de audio */}
            <audio ref={audioRef} src={actual.audio} />
            <div style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
              <button
                className="btn-audio"
                onClick={reproducirAudio}
                style={{ fontSize: "2rem", marginBottom: "1rem" }}
              >
                🔊
              </button>
            </div>

            {/* Campo de texto y botón Check */}
            {!respuesta && (
              <div
                className="opciones-ejercicio"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "stretch",
                  gap: "1rem",
                  margin: "1rem 0",
                }}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="input-respuesta"
                  placeholder="Write the number..."
                  style={{
                    fontSize: "1.2rem",
                    padding: "0.6rem 1rem",
                    flex: 1,
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    textAlign: "center",
                  }}
                />
                <button
                  onClick={verificar}
                  className="ejercicio-btn"
                  style={{
                    fontSize: "1.2rem",
                    padding: "0.6rem 1.5rem",
                    borderRadius: "8px",
                  }}
                >
                  Check
                </button>
              </div>
            )}

            {/* Feedback sin emojis, con color */}
            {respuesta && (
              <p
                className="respuesta-feedback"
                style={{
                  fontSize: "1.3rem",
                  margin: "1rem 0",
                  fontWeight: 600,
                  color: respuesta.startsWith("Correct") ? "green" : "red", // 
                }}
              >
                {respuesta}
              </p>
            )}

            {/* Botones de siguiente o finalizar */}
            <div className="botones-siguiente">
              {respuesta && index < ejercicios.length - 1 && (
                <button onClick={siguiente} className="ejercicio-btn">
                  Next question
                </button>
              )}
              {respuesta && index === ejercicios.length - 1 && (
                <button onClick={manejarFinalizacion} className="ejercicio-btn">
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
            Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
