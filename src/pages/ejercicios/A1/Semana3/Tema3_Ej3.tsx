import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import "../ejercicios.css";

export default function Tema3_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuestaUsuario, setRespuestaUsuario] = useState<string>("");
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const ejercicios = useMemo(
    () => [
      { audio: "/audios/sem3/prof1.mp3", correcta: "teacher" },
      { audio: "/audios/sem3/prof2.mp3", correcta: "doctor" },
      { audio: "/audios/sem3/prof3.mp3", correcta: "chef" },
      { audio: "/audios/sem3/prof4.mp3", correcta: "driver" },
      { audio: "/audios/sem3/prof5.mp3", correcta: "singer" },
      { audio: "/audios/sem3/prof6.mp3", correcta: "police officer" },
      { audio: "/audios/sem3/prof7.mp3", correcta: "nurse" },
      { audio: "/audios/sem3/prof8.mp3", correcta: "farmer" },
      { audio: "/audios/sem3/prof9.mp3", correcta: "engineer" },
      { audio: "/audios/sem3/prof10.mp3", correcta: "student" },
    ],
    []
  );

  const actual = ejercicios[index];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    audioRef.current?.play();
  };

  const guardarProgreso = async () => {
    // Guardar en localStorage
    const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
    }

    // Guardar en backend
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
    } catch (err) {
      console.error("Error al guardar progreso:", err);
    }
  };

  const verificar = () => {
    const normalizada = respuestaUsuario.trim().toLowerCase();
    const correcta = actual.correcta.trim().toLowerCase();

    if (normalizada === correcta) {
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("Incorrect.");
    }

    // Mostrar la respuesta correcta después
    setRespuestaUsuario(actual.correcta);
  };

  const siguiente = async () => {
    setRespuesta(null);
    setRespuestaUsuario("");
    await guardarProgreso();

    if (index + 1 < ejercicios.length) {
      setIndex(index + 1);
    } else {
      setFinalizado(true);
      setTimeout(() => {
        navigate(`/inicio/${nivel}`);
        window.location.reload();
      }, 2500);
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

          <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
            {index === 0 && (
              <div className="instruccion-box" style={{ fontSize: "1.3rem" }}>
                <p className="instruccion-ejercicio">
                  Listen to the audio and type the correct profession.
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
            <audio ref={audioRef} src={actual.audio} />

            <div style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Write the profession..."
                value={respuestaUsuario}
                onChange={(e) => setRespuestaUsuario(e.target.value)}
                className="input-ejercicio"
                style={{
                  fontSize: "1.2rem",
                  padding: "0.5rem 1rem",
                  width: "300px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  textAlign: "center",
                }}
                onKeyDown={(e) => e.key === "Enter" && verificar()}
              />
            </div>

            {respuesta && (
              <p
                className={`respuesta-feedback ${respuesta.startsWith("Correct") ? "correcta" : "incorrecta"}`}
                style={{
                  fontSize: "1.2rem",
                  margin: "0.5rem 0 1rem 0",
                  color: respuesta.startsWith("Correct") ? "#28A745" : "#DC3545", // Verde / Rojo
                  fontWeight: "bold",
                  minHeight: "1.5rem",
                }}
              >
                {respuesta}
              </p>
            )}

            {!respuesta && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                disabled={!respuestaUsuario.trim()}
                style={{ fontSize: "1.3rem", padding: "0.8rem 2rem" }}
              >
                Check
              </button>
            )}

            {respuesta && (
              <button
                onClick={siguiente}
                className="ejercicio-btn"
                style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", marginTop: "1rem" }}
              >
                {index === ejercicios.length - 1 ? "Finish" : "Next question"}
              </button>
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
