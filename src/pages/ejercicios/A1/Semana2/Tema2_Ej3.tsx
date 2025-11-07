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

  const ejercicios = useMemo(
    () => [
      {
        audio: "/audios/sem2/q1.mp3",
        pregunta: "I need _ orange.",
        opciones: ["a", "an", "the"],
        correcta: "an",
      },
      {
        audio: "/audios/sem2/q2.mp3",
        pregunta: "He is _ actor.",
        opciones: ["a", "an", "the"],
        correcta: "an",
      },
      {
        audio: "/audios/sem2/q3.mp3",
        pregunta: "I saw _ cat in the garden.",
        opciones: ["the", "a", "an"],
        correcta: "a",
      },
      {
        audio: "/audios/sem2/q4.mp3",
        pregunta: "She has _ old book.",
        opciones: ["a", "the", "an"],
        correcta: "an",
      },
      {
        audio: "/audios/sem2/q5.mp3",
        pregunta: "They are at _ airport.",
        opciones: ["an", "the", "a"],
        correcta: "the",
      },
      {
        audio: "/audios/sem2/q6.mp3",
        pregunta: "Look! It’s _ elephant!",
        opciones: ["a", "the", "an"],
        correcta: "an",
      },
      {
        audio: "/audios/sem2/q7.mp3",
        pregunta: "We had _ amazing dinner.",
        opciones: ["a", "the", "an"],
        correcta: "an",
      },
      {
        audio: "/audios/sem2/q8.mp3",
        pregunta: "_ sun is shining.",
        opciones: ["A", "An", "The"],
        correcta: "The",
      },
      {
        audio: "/audios/sem2/q9.mp3",
        pregunta: "He bought _ umbrella.",
        opciones: ["a", "an", "the"],
        correcta: "an",
      },
      {
        audio: "/audios/sem2/q10.mp3",
        pregunta: "I want to watch _ movie tonight.",
        opciones: ["the", "a", "an"],
        correcta: "a",
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
  if (!opcionSeleccionada) return;

  // Completar la oración con la opción correcta (no con la seleccionada)
  const oracionCompletada = actual.pregunta.replace("_", actual.correcta);

  if (opcionSeleccionada === actual.correcta) {
    setRespuesta(`✅ Correct! ${oracionCompletada}`);
    setCorrectas((prev) => prev + 1);
  } else {
    setRespuesta(`❌ Incorrect. The correct answer is "${actual.correcta}".\n${oracionCompletada}`);
  }
};

  const siguiente = () => {
    setRespuesta(null);
    setOpcionSeleccionada(null);
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
              Listen carefully and choose the correct article (a, an, the).
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

        <p style={{ fontSize: "1.3rem", margin: "1rem 0" }}>{actual.pregunta}</p>

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
                style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem", minWidth: "220px" }}
              >
                {op}
              </button>
            ))}
          </div>
        )}

        {!respuesta && (
          <button
            onClick={verificar}
            className="ejercicio-btn"
            disabled={!opcionSeleccionada}
            style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
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
