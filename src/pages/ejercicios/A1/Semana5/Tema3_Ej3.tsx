import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "../ejercicios.css";

export default function Tema3_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [index, setIndex] = useState(0);
  const [respuesta, setRespuesta] = useState("");
  const [resultado, setResultado] = useState<string | null>(null);
  const [autocompletada, setAutocompletada] = useState(false);
  const [correctas, setCorrectas] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const ejercicios = [
    {
      audio: "/audios/sem7/ej3_1.mp3",
      oracion: "I usually go to school ___ bus every morning.",
      correcta: "by",
    },
    {
      audio: "/audios/sem7/ej3_2.mp3",
      oracion: "She is sitting ___ the car with her friends.",
      correcta: "in",
    },
    {
      audio: "/audios/sem7/ej3_3.mp3",
      oracion: "We travel ___ train to visit our grandparents.",
      correcta: "by",
    },
    {
      audio: "/audios/sem7/ej3_4.mp3",
      oracion: "He is standing ___ the bus stop waiting for the bus.",
      correcta: "at",
    },
    {
      audio: "/audios/sem7/ej3_5.mp3",
      oracion: "They are walking ___ the street to get to the park.",
      correcta: "on",
    },
    {
      audio: "/audios/sem7/ej3_6.mp3",
      oracion: "I always put my bag ___ the taxi.",
      correcta: "in",
    },
    {
      audio: "/audios/sem7/ej3_7.mp3",
      oracion: "She rides her bicycle ___ school every day.",
      correcta: "to",
    },
    {
      audio: "/audios/sem7/ej3_8.mp3",
      oracion: "We are going to London ___ plane next week.",
      correcta: "by",
    },
    {
      audio: "/audios/sem7/ej3_9.mp3",
      oracion: "He sits ___ the front seat of the car.",
      correcta: "in",
    },
    {
      audio: "/audios/sem7/ej3_10.mp3",
      oracion: "The passengers are waiting ___ the train platform.",
      correcta: "on",
    },
  ];

  const actual = ejercicios[index];

  const playAudio = () => {
    audioRef.current?.play();
  };

  const verificarRespuesta = () => {
    const correcta = actual.correcta.toLowerCase().trim();
    const respuestaUsuario = respuesta.toLowerCase().trim();

    if (respuestaUsuario === correcta) {
      setResultado("Correct");
      setCorrectas(correctas + 1);
    } else {
      setResultado("Incorrect");
    }

    setAutocompletada(true);
  };

  const siguiente = async () => {
    if (index < ejercicios.length - 1) {
      setIndex(index + 1);
      setRespuesta("");
      setResultado(null);
      setAutocompletada(false);
    } else {
      await guardarProgreso();
      setResultado(`Exercise completed! You got ${correctas + (resultado === "Correct" ? 1 : 0)} / ${ejercicios.length}`);
    }
  };

  const guardarProgreso = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/progreso`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nivel, semana, tema, ejercicio }),
      });

      if (res.ok) {
        const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
        if (!completados.includes(id)) {
          completados.push(id);
          localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
        }
      }
    } catch (error) {
      console.error("Error al guardar el progreso:", error);
    }
  };

  return (
    <div className="ejercicio-container">
      <h2>Exercise 3</h2>
      <p>Listen carefully and write the preposition you hear.</p>

      <audio ref={audioRef} src={actual.audio} controls className="audio-player" />

      <div className="pregunta">
        {autocompletada
          ? actual.oracion.replace("___", actual.correcta)
          : actual.oracion}
      </div>

      {!autocompletada && (
        <div className="input-section">
          <input
            type="text"
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            placeholder="Write the preposition..."
            className="respuesta-input"
          />
          <button onClick={verificarRespuesta} className="verificar-btn">
            Check
          </button>
        </div>
      )}

      {resultado && (
        <p
          className={`resultado ${
            resultado === "Correct" ? "correct" : "incorrect"
          }`}
        >
          {resultado}
        </p>
      )}

      {autocompletada && (
        <button onClick={siguiente} className="siguiente-btn">
          Next
        </button>
      )}
    </div>
  );
}
