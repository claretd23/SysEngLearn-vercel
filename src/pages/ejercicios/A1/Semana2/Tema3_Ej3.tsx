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

  const ejercicios = useMemo(
    () => [
      {
        audio: "/audios/sem2/q11.mp3",
        opciones: [
          "He is my English teacher at school",
          "She is my English teacher at school",
          "They are my English teachers at school",
        ],
        correcta: "He is my English teacher at school",
      },
      {
        audio: "/audios/sem2/q12.mp3",
        opciones: [
          "I am very happy today",
          "He is very happy today",
          "We are very happy today",
        ],
        correcta: "I am very happy today",
      },
      {
        audio: "/audios/sem2/q13.mp3",
        opciones: [
          "They are students in this class",
          "They is students in this class",
          "They am students in this class",
        ],
        correcta: "They are students in this class",
      },
      {
        audio: "/audios/sem2/q14.mp3",
        opciones: [
          "She is my best friend",
          "He is my best friend",
          "I am my best friend",
        ],
        correcta: "She is my best friend",
      },
      {
        audio: "/audios/sem2/q15.mp3",
        opciones: [
          "We are brothers, not cousins",
          "We is brothers, not cousins",
          "We am brothers, not cousins",
        ],
        correcta: "We are brothers, not cousins",
      },
      {
        audio: "/audios/sem2/q16.mp3",
        opciones: [
          "You are my new classmate",
          "You is my new classmate",
          "You am my new classmate",
        ],
        correcta: "You are my new classmate",
      },
      {
        audio: "/audios/sem2/q17.mp3",
        opciones: [
          "The dog is very small and cute",
          "The dogs are very small and cute",
          "The dog am very small and cute",
        ],
        correcta: "The dog is very small and cute",
      },
      {
        audio: "/audios/sem2/q18.mp3",
        opciones: [
          "I am from Spain, but I live in Mexico",
          "He is from Spain, but he lives in Mexico",
          "We are from Spain, but we live in Mexico",
        ],
        correcta: "I am from Spain, but I live in Mexico",
      },
      {
        audio: "/audios/sem2/q19.mp3",
        opciones: [
          "She is a doctor at the hospital",
          "She are a doctor at the hospital",
          "She am a doctor at the hospital",
        ],
        correcta: "She is a doctor at the hospital",
      },
      {
        audio: "/audios/sem2/q20.mp3",
        opciones: [
          "They are at school right now",
          "They is at school right now",
          "They am at school right now",
        ],
        correcta: "They are at school right now",
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

    if (opcionSeleccionada === actual.correcta) {
      setRespuesta("✅ Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(` The correct answer is \n\n"${actual.correcta}".`);
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
        <h1 className="titulo-ejercicio">EXERCISE 3 </h1>
        <p className="progreso-ejercicio">
          Question {index + 1} of {ejercicios.length}
        </p>
      </header>

      <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
        {index === 0 && (
          <div className="instruccion-box" style={{ fontSize: "1.3rem" }}>
            <p className="instruccion-ejercicio">
              Listen carefully and choose the correct sentence.
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
