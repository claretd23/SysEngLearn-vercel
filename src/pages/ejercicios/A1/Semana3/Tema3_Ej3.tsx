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

  const ejercicios = useMemo(
    () => [
      {
        audio: "/audios/sem3/prof1.mp3",
        correcta: "teacher",
      },
      {
        audio: "/audios/sem3/prof2.mp3",
        correcta: "doctor",
      },
      {
        audio: "/audios/sem3/prof3.mp3",
        correcta: "chef",
      },
      {
        audio: "/audios/sem3/prof4.mp3",
        correcta: "driver",
      },
      {
        audio: "/audios/sem3/prof5.mp3",
        correcta: "singer",
      },
      {
        audio: "/audios/sem3/prof6.mp3",
        correcta: "police officer",
      },
      {
        audio: "/audios/sem3/prof7.mp3",
        correcta: "nurse",
      },
      {
        audio: "/audios/sem3/prof8.mp3",
        correcta: "farmer",
      },
      {
        audio: "/audios/sem3/prof9.mp3",
        correcta: "engineer",
      },
      {
        audio: "/audios/sem3/prof10.mp3",
        correcta: "student",
      },
    ],
    []
  );

  const actual = ejercicios[index];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    audioRef.current?.play();
  };

  const verificar = () => {
    const respuestaNormalizada = respuestaUsuario.trim().toLowerCase();
    if (respuestaNormalizada === actual.correcta.toLowerCase()) {
      setRespuesta("✅ Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`❌ Incorrect. The answer is "${actual.correcta}".`);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setRespuestaUsuario("");
    setIndex((prev) => prev + 1);
  };

  const manejarFinalizacion = async () => {
    setFinalizado(true);
    setTimeout(() => navigate(`/inicio/${nivel}`), 2500);
  };

  if (finalizado) {
    return (
      <div className="finalizado" style={{ fontSize: "1.3rem" }}>
        <h2>✅ You have completed the exercise!</h2>
        <p>
          Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
        </p>
        <p>Redirecting to the start of the level...</p>
      </div>
    );
  }

  return (
    <div className="ejercicio-container">
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

        <p style={{ fontSize: "1.3rem", margin: "1rem 0" }}>
          {actual.descripcion}
        </p>

        {!respuesta && (
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Write your answer here..."
              value={respuestaUsuario}
              onChange={(e) => setRespuestaUsuario(e.target.value)}
              className="input-ejercicio"
              style={{
                fontSize: "1.2rem",
                padding: "0.5rem 1rem",
                width: "250px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                textAlign: "center",
              }}
            />
          </div>
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
          <p
            className={`respuesta-feedback ${respuesta.startsWith("✅") ? "correcta" : "incorrecta"}`}
            style={{ fontSize: "1.3rem", margin: "1rem 0" }}
          >
            {respuesta}
          </p>
        )}

        <div className="botones-siguiente" style={{ marginTop: "1rem" }}>
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
    </div>
  );
}
