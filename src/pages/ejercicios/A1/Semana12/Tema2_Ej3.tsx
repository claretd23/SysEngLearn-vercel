import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import "../ejercicios.css";

interface MCQ {
  pregunta: string;
  opciones: string[];
  correcta: string;
  audios: string[];
}

export default function Tema2_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [audioIndex, setAudioIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const ejercicios: MCQ[] = useMemo(() => [
    {
      audios: ["/audios/sem12/11a.mp3", "/audios/sem12/11b.mp3","/audios/sem12/11c.mp3"],
      pregunta: "What is Tom going to do tomorrow?",
      opciones: ["Play football", "Walk his dog in the park", "Go to the library"],
      correcta: "Walk his dog in the park",
    },
    {
      audios: ["/audios/sem12/12a.mp3", "/audios/sem12/12b.mp3","/audios/sem12/12c.mp3"],
      pregunta: "What is Sarah going to do tonight?",
      opciones: ["Cook dinner", "Order pizza", "Watch a movie"],
      correcta: "Order pizza",
    },
    {
      audios: ["/audios/sem12/13a.mp3", "/audios/sem12/13b.mp3","/audios/sem12/13c.mp3"],
      pregunta: "Mark is going to:",
      opciones: ["Watch TV", "Study for his exam", "Visit his grandparents"],
      correcta: "Study for his exam",
    },
    {
      audios: ["/audios/sem12/14a.mp3", "/audios/sem12/14b.mp3","/audios/sem12/14c.mp3"],
      pregunta: "Lily is going to:",
      opciones: ["Visit her grandmother", "Go shopping", "Stay at home"],
      correcta: "Visit her grandmother",
    },
    {
      audios: ["/audios/sem12/15a.mp3", "/audios/sem12/15b.mp3", "/audios/sem12/15c.mp3"],
      pregunta: "Tom is going to:",
      opciones: ["Play tennis", "Watch a movie", "Play basketball"],
      correcta: "Watch a movie",
    },
    {
      audios: ["/audios/sem12/16a.mp3", "/audios/sem12/16b.mp3", "/audios/sem12/16c.mp3"],
      pregunta: "Emma is going to:",
      opciones: ["Clean her room", "Tidy the kitchen", "Go for a walk"],
      correcta: "Clean her room",
    },
    {
      audios: ["/audios/sem12/17a.mp3", "/audios/sem12/17b.mp3", "/audios/sem12/17c.mp3"],
      pregunta: "Jake is going to:",
      opciones: ["Meet his friends", "Stay home and read", "Go shopping"],
      correcta: "Stay home and read",
    },
    {
      audios: ["/audios/sem12/18a.mp3", "/audios/sem12/18b.mp3", "/audios/sem12/18c.mp3"],
      pregunta: "Anna is going to:",
      opciones: ["Run in the morning", "Swim", "Do homework"],
      correcta: "Swim",
    },
    {
      audios: ["/audios/sem12/19a.mp3", "/audios/sem12/19b.mp3", "/audios/sem12/19c.mp3"],
      pregunta: "Paul is going to:",
      opciones: ["Play football", "Visit his uncle", "Go shopping"],
      correcta: "Visit his uncle",
    },
    {
      audios: ["/audios/sem12/20a.mp3", "/audios/sem12/20b.mp3", "/audios/sem12/20c.mp3"],
      pregunta: "Sara is going to:",
      opciones: ["Buy a phone", "Buy a laptop", "Buy a tablet"],
      correcta: "Buy a phone",
    },
  ], []);

  const actual = ejercicios[index];

  const playAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.src = actual.audios[audioIndex];
    audioRef.current.play();
    audioRef.current.onended = () => {
      if (audioIndex + 1 < actual.audios.length) {
        setAudioIndex((prev) => prev + 1);
      } else {
        setAudioIndex(0);
      }
    };
  };

  const verificar = () => {
    if (!seleccion) return;
    if (seleccion === actual.correcta) {
      setRespuesta("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect.\n\nCorrect answer: ${actual.correcta}`);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setSeleccion(null);
    setAudioIndex(0);

    if (index + 1 < ejercicios.length) {
      setIndex(index + 1);
    } else {
      setFinalizado(true);
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

          <section className="tarjeta-ejercicio" style={{ textAlign: "center", padding: "2rem" }}>
            <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
              <p className="instruccion-ejercicio">
                Listen carefully to each dialogue. Choose the correct answer. Pay attention to “going to” for future plans.
              </p>
            </div>

            <button
              className="btn-audio"
              style={{ fontWeight: "bold", fontSize: "1.5rem", margin: "1rem 0" }}
              onClick={playAudio}
            >
              🔊
            </button>
            <audio ref={audioRef} />

            <div className="opciones-ejercicio" style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              {actual.opciones.map((op, i) => (
                <button
                  key={i}
                  className={`opcion-btn ${seleccion === op ? "seleccionada" : ""}`}
                  onClick={() => setSeleccion(op)}
                  style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem" }}
                >
                  {op}
                </button>
              ))}
            </div>

            {!respuesta && seleccion && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", marginTop: "1rem" }}
              >
                Check
              </button>
            )}

            {respuesta && (
              <p
                className={`respuesta-feedback ${respuesta === "Correct" ? "correcta" : "incorrecta"}`}
                style={{ fontSize: "1.3rem", margin: "1rem 0", color: respuesta === "Correct" ? "green" : "red", fontWeight: 600, whiteSpace: "pre-line" }}
              >
                {respuesta}
              </p>
            )}

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
              <div style={{ marginTop: "1rem" }}>
                <h2>You have completed the exercise!</h2>
                <p>
                  Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
                </p>
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
