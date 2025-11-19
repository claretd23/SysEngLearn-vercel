import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import "../ejercicios.css";

export default function Tema3_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [yaCompletado, setYaCompletado] = useState(false);

  const ejercicios = useMemo(
    () => [
      {
        imagen: "/img/9.1.png",
        audio: "/audios/sem9/9.1.mp3",
        pregunta: "____ is an apple.",
        correcta: "this",
      },
      {
        imagen: "/img/9.2.jpg",
        audio: "/audios/sem9/9.2.mp3",
        pregunta: "____ are bananas.",
        correcta: "these",
      },
      {
        imagen: "/img/9.3.jpg",
        audio: "/audios/sem9/9.3.mp3",
        pregunta: "____ is a dog.",
        correcta: "that",
      },
      {
        imagen: "/img/9.4.jpg",
        audio: "/audios/sem9/9.4.mp3",
        pregunta: "____ are birds.",
        correcta: "those",
      },
      {
        imagen: "/img/9.5.jpg",
        audio: "/audios/sem9/9.5.mp3",
        pregunta: "____ is my pen.",
        correcta: "this",
      },
      {
        imagen: "/img/9.6.jpg",
        audio: "/audios/sem9/9.6.mp3",
        pregunta: "____ are my books.",
        correcta: "these",
      },
      {
        imagen: "/img/9.7.jpg",
        audio: "/audios/sem9/9.7.mp3",
        pregunta: "____ is a red car.",
        correcta: "that",
      },
      {
        imagen: "/img/9.8.jpg",
        audio: "/audios/sem9/9.8.mp3",
        pregunta: "____ are chairs.",
        correcta: "those",
      },
      {
        imagen: "/img/9.9.jpg",
        audio: "/audios/sem9/9.9.mp3",
        pregunta: "____ is my phone.",
        correcta: "this",
      },
      {
        imagen: "/img/9.10.jpg",
        audio: "/audios/sem9/9.10.mp3",
        pregunta: "____ are pencils.",
        correcta: "those",
      },
    ],
    []
  );

  const actual = ejercicios[index];

  //Verificar si el alumno ya completó este ejercicio
  useEffect(() => {
    const checkProgreso = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API_URL}/api/progreso/${nivel}/${semana}/${tema}/${ejercicio}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data.completado) setYaCompletado(true);
        }
      } catch (error) {
        console.error("Error al consultar progreso:", error);
      }
    };
    checkProgreso();
  }, [API_URL, nivel, semana, tema, ejercicio]);

  // 🔹 Guardar progreso
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
      console.error("Error al guardar progreso", error);
    }
  };

  //  Verificar respuesta
  const verificar = () => {
    const usuario = inputValue.trim().toLowerCase();
    if (!usuario) return;

    if (usuario === actual.correcta) {
      setRespuesta("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect.`);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setInputValue("");
    setIndex((prev) => prev + 1);
  };

  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => navigate(`/inicio/${nivel}`), 2500);
  };

  // Si ya completó el ejercicio
  if (yaCompletado) {
    return (
      <div className="finalizado">
        <h2>You have already completed this exercise.</h2>
        <button onClick={() => navigate(`/inicio/${nivel}`)} className="ejercicio-btn">
          Go back
        </button>
      </div>
    );
  }

  //  Pantalla final
  if (finalizado) {
    return (
      <div className="finalizado">
        <h2>Exercise completed!</h2>
        <p>
          Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
        </p>
        <p>Redirecting...</p>
      </div>
    );
  }

  // Pantalla del ejercicio
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
          <div className="instruccion-box">
            <p className="instruccion-ejercicio">
              Listen and complete the sentence with: This / These / That / Those.
            </p>
          </div>
        )}

<button
  className="btn-audio"
  onClick={() => {
    const audio = new Audio(actual.audio);
    audio.play();
  }}
>
  🔊
</button>

        <img src={actual.imagen} alt="Exercise" className="imagen-completa" />

        <p className="pregunta-ejercicio">
          {respuesta ? actual.pregunta.replace("____", actual.correcta) : actual.pregunta}
        </p>

        <div className="input-contenedor">
          <input
            type="text"
            className="input-respuesta"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Write your answer..."
          />

          {!respuesta && (
            <button onClick={verificar} className="ejercicio-btn">
              Check
            </button>
          )}
        </div>

        {respuesta && (
          <p
            className={`respuesta-feedback ${
              respuesta === "Correct" ? "correcta" : "incorrecta"
            }`}
          >
            {respuesta}
          </p>
        )}

        <div className="botones-siguiente">
          {respuesta && index < ejercicios.length - 1 && (
            <button onClick={siguiente} className="ejercicio-btn">
              Next question
            </button>
          )}

          {respuesta && index === ejercicios.length - 1 && (
            <button onClick={manejarFinalizacion} className="ejercicio-btn">
              Finish
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
