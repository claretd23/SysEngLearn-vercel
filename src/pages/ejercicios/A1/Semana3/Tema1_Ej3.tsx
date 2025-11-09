import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "../ejercicios.css";

export default function Tema3_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    audioRef.current?.play();
  };

  const ejercicios = [
    {
      pregunta: "What is the man’s name?",
      opciones: ["Mark", "Carlos", "David"],
      correcta: "Carlos",
    },
    {
      pregunta: "Where is Carlos from?",
      opciones: ["Mexico", "Canada", "The United States"],
      correcta: "Mexico",
    },
    {
      pregunta: "Where does Carlos live?",
      opciones: ["In Mexico City", "In Guadalajara", "In Monterrey"],
      correcta: "In Guadalajara",
    },
    {
      pregunta: "How old is Carlos?",
      opciones: ["20", "25", "30"],
      correcta: "25",
    },
    {
      pregunta: "What is his job or occupation?",
      opciones: ["He is a teacher.", "He is a university student.", "He is a doctor."],
      correcta: "He is a university student.",
    },
    {
      pregunta: "What does Carlos like to do in his free time?",
      opciones: ["Listening to music and chatting online", "Running in the park", "Reading books"],
      correcta: "Listening to music and chatting online",
    },
    {
      pregunta: "What is his sister’s name?",
      opciones: ["Maria", "Ana", "Julia"],
      correcta: "Ana",
    },
    {
      pregunta: "What does Ana do?",
      opciones: ["She is a teacher.", "She is a student.", "She is a nurse."],
      correcta: "She is a teacher.",
    },
    {
      pregunta: "Where is Carlos’s best friend from?",
      opciones: ["The U.S.", "Mexico", "Canada"],
      correcta: "Canada",
    },
    {
      pregunta: "Why are Carlos and Mark studying English?",
      opciones: [
        "Because they want to travel to the U.S.",
        "Because they like English music",
        "Because their teacher told them to",
      ],
      correcta: "Because they want to travel to the U.S.",
    },
  ];

  const actual = ejercicios[index];

  const verificar = () => {
    if (!opcionSeleccionada) return;

    if (opcionSeleccionada === actual.correcta) {
      setRespuesta(" Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Correct answer: "${actual.correcta}".`);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setOpcionSeleccionada(null);
    setIndex((prev) => prev + 1);
  };

  const manejarFinalizacion = async () => {
    setFinalizado(true);
    setTimeout(() => navigate(`/inicio/${nivel}`), 3000);
  };

  if (finalizado) {
    return (
      <div className="finalizado" style={{ fontSize: "1.3rem" }}>
        <h2> You have completed the listening exercise!</h2>
        <p>
          Correct answers:{" "}
          <strong>
            {correctas} / {ejercicios.length}
          </strong>
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
          <div className="instruccion-box" style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
            <p>
              🎧 Listen carefully to the audio and choose the correct answer for each question.
              <br />
              You can replay the audio if needed.
            </p>
          </div>
        )}

        {/* === AUDIO === */}
        <button
          className="btn-audio"
          style={{ fontSize: "2rem", margin: "1rem 0" }}
          onClick={playAudio}
        >
          🔊
        </button>
        <audio ref={audioRef} src="/audios/sem3/carlos.mp3" />

        {/* === PREGUNTA === */}
        <h2 style={{ fontSize: "1.4rem", marginBottom: "1rem", color: "#222a5c" }}>
          {actual.pregunta}
        </h2>

        {/* === OPCIONES === */}
        {!respuesta && (
          <div
            className="opciones-ejercicio"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.8rem",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            {actual.opciones.map((op, i) => (
              <button
                key={i}
                className={`opcion-btn ${opcionSeleccionada === op ? "seleccionada" : ""}`}
                onClick={() => setOpcionSeleccionada(op)}
                style={{ fontSize: "1.1rem", padding: "0.6rem 1.4rem", minWidth: "280px" }}
              >
                {op}
              </button>
            ))}
          </div>
        )}

        {/* === BOTÓN CHECK === */}
        {!respuesta && (
          <button
            onClick={verificar}
            className="ejercicio-btn"
            disabled={!opcionSeleccionada}
            style={{ fontSize: "1.2rem", padding: "0.7rem 2rem", borderRadius: "8px" }}
          >
            Check
          </button>
        )}

        {/* === FEEDBACK === */}
        {respuesta && (
          <p
            className={`respuesta-feedback ${
              respuesta.startsWith("✅") ? "correcta" : "incorrecta"
            }`}
            style={{ fontSize: "1.2rem", margin: "1rem 0" }}
          >
            {respuesta}
          </p>
        )}

        {/* === BOTONES SIGUIENTE / FINALIZAR === */}
        <div className="botones-siguiente" style={{ marginTop: "1rem" }}>
          {respuesta && index < ejercicios.length - 1 && (
            <button
              onClick={siguiente}
              className="ejercicio-btn"
              style={{ fontSize: "1.2rem", padding: "0.7rem 2rem" }}
            >
              Next question
            </button>
          )}
          {respuesta && index === ejercicios.length - 1 && (
            <button
              onClick={manejarFinalizacion}
              className="ejercicio-btn"
              style={{ fontSize: "1.2rem", padding: "0.7rem 2rem" }}
            >
              Finish
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
