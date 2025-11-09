import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import "../ejercicios.css";

export default function Tema1_Ej3() {
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
      { audio: "/audios/sem4/order1.mp3", correcta: "Anna drinks tea in the kitchen every morning" },
      { audio: "/audios/sem4/order2.mp3", correcta: "Tom plays football in the park on Sunday" },
      { audio: "/audios/sem4/order3.mp3", correcta: "She studies English at school every day" },
      { audio: "/audios/sem4/order4.mp3", correcta: "Peter watches TV in his room at night" },
      { audio: "/audios/sem4/order5.mp3", correcta: "My mom cooks dinner in the kitchen every evening" },
      { audio: "/audios/sem4/order6.mp3", correcta: "We listen to music at school on Monday" },
      { audio: "/audios/sem4/order7.mp3", correcta: "Paul does homework in his room every afternoon" },
      { audio: "/audios/sem4/order8.mp3", correcta: "Emma reads a book in the garden every day" },
      { audio: "/audios/sem4/order9.mp3", correcta: "The teacher teaches math in the classroom every morning" },
      { audio: "/audios/sem4/order10.mp3", correcta: "My dad drinks coffee in the living room every morning" },
    ],
    []
  );

  const actual = ejercicios[index];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    audioRef.current?.play();
  };

  const verificar = () => {
    // Normalizamos ambas respuestas para ignorar mayúsculas/minúsculas y espacios extra
    const respuestaNormalizada = respuestaUsuario.trim().toLowerCase().replace(/\s+/g, " ");
    const correctaNormalizada = actual.correcta.trim().toLowerCase().replace(/\s+/g, " ");

    if (respuestaNormalizada === correctaNormalizada) {
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("Incorrect.");
    }

    // Autocompletar con la oración correcta para mostrarla
    setRespuestaUsuario(actual.correcta);
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
        <h2>You have completed the exercise!</h2>
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
              Listen to the audio. The words are mixed. Write them in the correct order:
              <br /> <strong>S + V + O + Place + Time</strong>.
            </p>
          </div>
        )}

        {/* Botón de audio */}
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
            placeholder="Write the correct sentence..."
            value={respuestaUsuario}
            onChange={(e) => setRespuestaUsuario(e.target.value)}
            className="input-ejercicio"
            style={{
              fontSize: "1.2rem",
              padding: "0.5rem 1rem",
              width: "450px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              textAlign: "center",
            }}
            onKeyDown={(e) => e.key === "Enter" && verificar()}
          />
        </div>

        {respuesta && (
          <p
            className={`respuesta-feedback ${
              respuesta.startsWith("Correct") ? "correcta" : "incorrecta"
            }`}
            style={{
              fontSize: "1.2rem",
              margin: "0.5rem 0 1rem 0",
              color: respuesta.startsWith("Correct") ? "#2ecc71" : "#e74c3c",
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
