import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import "../ejercicios.css";

export default function Tema3_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  // === NUEVOS DATOS DEL EJERCICIO ===
  const preguntas = useMemo(
    () => [
      {
        pregunta: "What is Emma’s job?",
        opciones: ["She is a doctor.", "She is a teacher.", "She is an engineer."],
        correcta: "She is a teacher.",
      },
      {
        pregunta: "Where does Emma work?",
        opciones: ["At a hospital.", "At a restaurant.", "At a school."],
        correcta: "At a school.",
      },
      {
        pregunta: "What is Tom’s job?",
        opciones: ["He is a doctor.", "He is a teacher.", "He is a student."],
        correcta: "He is a doctor.",
      },
      {
        pregunta: "Where does Tom work?",
        opciones: ["At a school.", "At a hospital.", "At a company."],
        correcta: "At a hospital.",
      },
      {
        pregunta: "What does Lucy do?",
        opciones: ["She is a chef.", "She is a nurse.", "She is a driver."],
        correcta: "She is a chef.",
      },
      {
        pregunta: "Where does Lucy work?",
        opciones: ["At a restaurant.", "At a hospital.", "At a company."],
        correcta: "At a restaurant.",
      },
      {
        pregunta: "How old is David?",
        opciones: ["He is 20 years old.", "He is 25 years old.", "He is 18 years old."],
        correcta: "He is 20 years old.",
      },
      {
        pregunta: "What do Emma’s parents do?",
        opciones: ["They are doctors.", "They are engineers.", "They are teachers."],
        correcta: "They are engineers.",
      },
      {
        pregunta: "Where do Emma’s parents work?",
        opciones: ["In a big company.", "In a restaurant.", "In a hospital."],
        correcta: "In a big company.",
      },
      {
        pregunta: "What does Mr. Brown do?",
        opciones: ["He is a driver.", "He is a chef.", "He is a student."],
        correcta: "He is a driver.",
      },
    ],
    []
  );

  const actual = preguntas[index];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    audioRef.current?.play();
  };

  const verificar = () => {
    if (!opcionSeleccionada) return;

    if (opcionSeleccionada === actual.correcta) {
      setRespuesta("✅ Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`❌ The correct answer is:\n"${actual.correcta}"`);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setOpcionSeleccionada(null);
    setIndex((prev) => prev + 1);
  };

  const manejarFinalizacion = () => {
    setFinalizado(true);
    setTimeout(() => navigate(`/inicio/${nivel}`), 2500);
  };

  if (finalizado) {
    return (
      <div className="finalizado" style={{ fontSize: "1.3rem" }}>
        <h2>✅ You have completed the exercise!</h2>
        <p>
          Correct answers: <strong>{correctas} / {preguntas.length}</strong>
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
          Question {index + 1} of {preguntas.length}
        </p>
      </header>

      <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
        {/* Instrucciones y audio solo la primera vez */}
        {index === 0 && (
          <div className="instruccion-box" style={{ fontSize: "1.3rem" }}>
            <p className="instruccion-ejercicio">
              Listen to the audio and answer the questions.
            </p>
          </div>
        )}

        {index === 0 && (
          <button
            className="btn-audio"
            style={{ fontSize: "2rem", margin: "1rem 0" }}
            onClick={playAudio}
          >
            🔊
          </button>
        )}

        {index === 0 && (
          <audio ref={audioRef} src="/audios/sem2/emma-story.mp3" />
        )}

        <h2 style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>{actual.pregunta}</h2>

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
                style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem", minWidth: "280px" }}
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
            style={{ fontSize: "1.3rem", margin: "1rem 0", whiteSpace: "pre-line" }}
          >
            {respuesta}
          </p>
        )}

        <div className="botones-siguiente" style={{ marginTop: "1rem" }}>
          {respuesta && index < preguntas.length - 1 && (
            <button
              onClick={siguiente}
              className="ejercicio-btn"
              style={{ fontSize: "1.3rem", padding: "0.8rem 2rem" }}
            >
              Next question
            </button>
          )}
          {respuesta && index === preguntas.length - 1 && (
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
