import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tema3_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const conversaciones = [
    {
      audios: [
        "/audios/imperatives1a.mp3",
        "/audios/imperatives1b.mp3",
      ],
      text: "After 100 metres, ________ right.",
      answer: "turn",
    },
    {
      audios: [
        "/audios/imperatives2a.mp3",
        "/audios/imperatives2b.mp3",
      ],
      text: "Please, ________ your books on page 10.",
      answer: "open",
    },
    {
      audios: [
        "/audios/imperatives3a.mp3",
        "/audios/imperatives3b.mp3",
      ],
      text: "________ so close to the fire.",
      answer: "Don't stand",
    },
    {
      audios: [
        "/audios/imperatives4a.mp3",
        "/audios/imperatives4b.mp3",
      ],
      text: "________ faster, we’re almost there!",
      answer: "Run",
    },
    {
      audios: [
        "/audios/imperatives5a.mp3",
        "/audios/imperatives5b.mp3",
      ],
      text: "________ this medicine twice a day.",
      answer: "Take",
    },
  ];

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [correcto, setCorrecto] = useState(false);
  const [incorrecto, setIncorrecto] = useState(false);
  const [finalizado, setFinalizado] = useState(false);

  const verificarRespuesta = async () => {
    const respuestaUsuario = input.trim().toLowerCase();
    const respuestaCorrecta = conversaciones[index].answer.trim().toLowerCase();

    if (respuestaUsuario === respuestaCorrecta) {
      setCorrecto(true);
      setIncorrecto(false);

      try {
        await fetch(`${API_URL}/progreso`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idEjercicio: id,
            completado: true,
          }),
        });
      } catch (error) {
        console.error("Error al guardar progreso:", error);
      }

      setTimeout(() => {
        if (index < conversaciones.length - 1) {
          setIndex(index + 1);
          setInput("");
          setCorrecto(false);
        } else {
          setFinalizado(true);
        }
      }, 1200);
    } else {
      setIncorrecto(true);
      setCorrecto(false);
    }
  };

  const siguienteEjercicio = () => {
    navigate(`/ejercicio/${nivel}/${semana}-${tema}-4`);
  };

  return (
    <div className="ejercicio-container">
      <h2>Exercise 3: Imperatives</h2>
      {!finalizado ? (
        <div className="card-ejercicio">
          <p>
            <strong>Instruction:</strong> Listen to both audios and complete
            the sentence with the correct imperative form.
          </p>

          <div className="audio-group">
            {conversaciones[index].audios.map((audio, i) => (
              <audio key={i} controls src={audio}></audio>
            ))}
          </div>

          <p className="sentence">{conversaciones[index].text}</p>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write your answer here"
          />

          <button onClick={verificarRespuesta}>Check</button>

          {correcto && <p className="correcto">Correct!</p>}
          {incorrecto && <p className="incorrecto">Try again.</p>}

          <p className="progress">
            Conversation {index + 1} of {conversaciones.length}
          </p>
        </div>
      ) : (
        <div className="card-ejercicio">
          <p>Excellent work! You completed all the conversations.</p>
          <button onClick={siguienteEjercicio}>Next exercise</button>
        </div>
      )}
    </div>
  );
}
