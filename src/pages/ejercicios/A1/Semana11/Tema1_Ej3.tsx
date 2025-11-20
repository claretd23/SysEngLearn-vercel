import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "../ejercicios.css";

interface MCQ {
  pregunta: string;
  opciones: string[];
  correcta: string;
  audios: string[];
}

export default function Tema1_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const data: MCQ[] = [
    {
      pregunta: "Whose pencil is it?",
      opciones: ["Lily’s", "Mark’s", "The teacher’s"],
      correcta: "Mark’s",
      audios: [
        "/audios/sem11/1_1.mp3",
        "/audios/sem11/1_2.mp3",
        "/audios/sem11/1_3.mp3",
        "/audios/sem11/1_4.mp3",
      ],
    },
    {
      pregunta: "Whose phone is on the table?",
      opciones: ["Sara’s", "Emma’s", "Tom’s"],
      correcta: "Emma’s",
      audios: [
        "/audios/sem11/2_1.mp3",
        "/audios/sem11/2_2.mp3",
        "/audios/sem11/2_3.mp3",
        "/audios/sem11/2_4.mp3",
      ],
    },
    {
      pregunta: "Whose shoes are by the door?",
      opciones: ["Amy’s", "Mom’s", "Dad’s"],
      correcta: "Dad’s",
      audios: [
        "/audios/sem11/3_1.mp3",
        "/audios/sem11/3_2.mp3",
        "/audios/sem11/3_3.mp3",
        "/audios/sem11/3_4.mp3",
      ],
    },
    {
      pregunta: "Whose backpack is blue?",
      opciones: ["Nina’s", "Ben’s", "No one’s"],
      correcta: "Ben’s",
      audios: [
        "/audios/sem11/4_1.mp3",
        "/audios/sem11/4_2.mp3",
        "/audios/sem11/4_3.mp3",
        "/audios/sem11/4_4.mp3",
      ],
    },
    {
      pregunta: "Whose sandwich is it?",
      opciones: ["Paul’s", "Jane’s", "Jack’s"],
      correcta: "Jack’s",
      audios: [
        "/audios/sem11/5_1.mp3",
        "/audios/sem11/5_2.mp3",
        "/audios/sem11/5_3.mp3",
        "/audios/sem11/5_4.mp3",
      ],
    },
  ];

  const [index, setIndex] = useState(0);
  const actual = data[index];

  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState<string | null>(null);

  const audioRef = useRef(new Audio());

  const stopAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.onended = null;
  };

  const playAudio = async () => {
    stopAudio();
    try {
      for (let src of actual.audios) {
        audioRef.current.src = src;

        await audioRef.current.play();

        await new Promise((resolve) => {
          audioRef.current.onended = resolve;
        });
      }
    } catch (e) {
      console.error("Audio error:", e);
    }
  };

  useEffect(() => {
    stopAudio();
  }, [index]);

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const checkAnswer = () => {
    if (!seleccion) return;
    if (seleccion === actual.correcta) setRespuesta("Correct");
    else setRespuesta(`Incorrect. Correct answer: ${actual.correcta}`);
  };

  const nextQuestion = () => {
    stopAudio();
    setRespuesta(null);
    setSeleccion(null);

    if (index < data.length - 1) {
      setIndex(index + 1);
    } else {
      navigate(`/fin/${id}`);
    }
  };

  const esCorrecta = respuesta?.startsWith("Correct");

  return (
    <div className="ejercicio-container">
      <h1 className="titulo-ejercicio">EXERCISE 3 — Listening</h1>
      <p className="progreso-ejercicio">
        Question {index + 1} of {data.length}
      </p>

      {/* Botón de audio — solo uno */}
      {!respuesta && (
        <button className="btn-audio" onClick={playAudio}>
          🔊 Listen
        </button>
      )}

      <section className="tarjeta-ejercicio" style={{ padding: "1.5rem" }}>
        <p className="pregunta-texto">{actual.pregunta}</p>

        {/* OPCIONES */}
        {!respuesta && (
          <div className="opciones-container">
            {actual.opciones.map((op) => (
              <button
                key={op}
                className={`opcion-btn ${seleccion === op ? "seleccionada" : ""}`}
                onClick={() => setSeleccion(op)}
              >
                {op}
              </button>
            ))}
          </div>
        )}

        {/* BOTÓN CHECK */}
        {!respuesta && seleccion && (
          <button
            className="ejercicio-btn"
            onClick={checkAnswer}
            style={{ marginTop: "1rem" }}
          >
            Check
          </button>
        )}

        {/* RESULTADO */}
        {respuesta && (
          <p
            className={`respuesta-feedback ${esCorrecta ? "correcta" : "incorrecta"}`}
            style={{
              marginTop: "1.2rem",
              color: esCorrecta ? "green" : "red",
              fontWeight: 700,
              whiteSpace: "pre-line",
            }}
          >
            {respuesta}
          </p>
        )}

        {/* NEXT o FINISH */}
        {respuesta && index < data.length - 1 && (
          <button
            className="ejercicio-btn"
            onClick={nextQuestion}
            style={{ marginTop: "1rem" }}
          >
            Next
          </button>
        )}

        {respuesta && index === data.length - 1 && (
          <button
            className="ejercicio-btn"
            onClick={nextQuestion}
            style={{ marginTop: "1rem" }}
          >
            Finish
          </button>
        )}
      </section>
    </div>
  );
}
