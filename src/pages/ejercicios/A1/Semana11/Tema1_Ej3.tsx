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
    {
      pregunta: "Whose notebook is it?",
      opciones: ["The teacher’s", "Lisa’s", "Anna’s"],
      correcta: "Lisa’s",
      audios: [
        "/audios/sem11/6_1.mp3",
        "/audios/sem11/6_2.mp3",
        "/audios/sem11/6_3.mp3",
        "/audios/sem11/6_4.mp3",
      ],
    },
    {
      pregunta: "Whose jacket is on the chair?",
      opciones: ["Emma’s", "Emma’s brother’s", "Mark’s"],
      correcta: "Emma’s brother’s",
      audios: [
        "/audios/sem11/7_1.mp3",
        "/audios/sem11/7_2.mp3",
        "/audios/sem11/7_3.mp3",
        "/audios/sem11/7_4.mp3",
      ],
    },
    {
      pregunta: "Whose water bottle is red?",
      opciones: ["Mia’s", "Jake’s", "Anna’s"],
      correcta: "Jake’s",
      audios: [
        "/audios/sem11/8_1.mp3",
        "/audios/sem11/8_2.mp3",
        "/audios/sem11/8_3.mp3",
        "/audios/sem11/8_4.mp3",
      ],
    },
    {
      pregunta: "Whose car is outside?",
      opciones: ["Tom’s", "His uncle’s", "His dad’s"],
      correcta: "His uncle’s",
      audios: [
        "/audios/sem11/9_1.mp3",
        "/audios/sem11/9_2.mp3",
        "/audios/sem11/9_3.mp3",
        "/audios/sem11/9_4.mp3",
      ],
    },
    {
      pregunta: "Whose dog is in the garden?",
      opciones: ["Sam’s", "Lara’s", "The neighbor’s"],
      correcta: "The neighbor’s",
      audios: [
        "/audios/sem11/10_1.mp3",
        "/audios/sem11/10_2.mp3",
        "/audios/sem11/10_3.mp3",
        "/audios/sem11/10_4.mp3",
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
  };

  const playAudio = async () => {
    stopAudio();

    for (let src of actual.audios) {
      audioRef.current.src = src;
      await audioRef.current.play();

      await new Promise((resolve) => {
        audioRef.current.onended = resolve;
      });
    }
  };

  useEffect(() => {
    stopAudio();
  }, [index]);

  useEffect(() => {
    return () => stopAudio();
  }, []);

  function checkAnswer() {
    if (!seleccion) return;
    if (seleccion === actual.correcta) setRespuesta("Correct");
    else setRespuesta("Incorrect");
  }

  function nextQuestion() {
    setSeleccion(null);
    setRespuesta(null);
    stopAudio();

    if (index < data.length - 1) {
      setIndex(index + 1);
    } else {
      navigate(`/fin/${id}`);
    }
  }

  return (
    <div className="ejercicio-container">
      <h2>Listening – Exercise 3 ({index + 1}/{data.length})</h2>

      {/* 🔊 Un solo botón */}
      <button className="audio-button" onClick={playAudio}>
        🔊 Listen
      </button>

      <p className="pregunta">{actual.pregunta}</p>

      <div className="opciones-container">
        {actual.opciones.map((opc) => (
          <label
            key={opc}
            className={`opcion ${seleccion === opc ? "opcion-seleccionada" : ""}`}
          >
            <input
              type="radio"
              name="opcion"
              value={opc}
              checked={seleccion === opc}
              onChange={() => setSeleccion(opc)}
              disabled={!!respuesta}
            />
            {opc}
          </label>
        ))}
      </div>

      {!respuesta && (
        <button className="check-button" onClick={checkAnswer}>
          Check
        </button>
      )}

      {respuesta && (
        <>
          <p
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: respuesta === "Correct" ? "#28A745" : "#DC3545",
            }}
          >
            {respuesta}
          </p>

          {respuesta === "Incorrect" && (
            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "1.1rem",
                fontWeight: "bold",
                color: "#DC3545",
              }}
            >
              Correct answer:{" "}
              <span style={{ color: "#000" }}>{actual.correcta}</span>
            </p>
          )}

          <button className="next-button" onClick={nextQuestion}>
            Next
          </button>
        </>
      )}
    </div>
  );
}
