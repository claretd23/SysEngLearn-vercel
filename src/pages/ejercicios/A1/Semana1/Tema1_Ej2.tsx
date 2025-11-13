import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import "../ejercicios.css";

// Componente para ejercicio de spelling (complete the word) con audio
export default function Tema1_Ej2_Spelling() {
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

  const ejercicios = useMemo(() => [
    { audio: "/audios/sem1/Tema1/board.mp3", pregunta: "The teacher writes on the ______ .", correcta: "board" },
    { audio: "/audios/sem1/Tema1/window.mp3", pregunta: "The ______ is open.", correcta: "window" },
    { audio: "/audios/sem1/Tema1/kitchen.mp3", pregunta: "My mother is in the ______ .", correcta: "kitchen" },
    { audio: "/audios/sem1/Tema1/guitar.mp3", pregunta: "I play the ______ .", correcta: "guitar" },
    { audio: "/audios/sem1/Tema1/river.mp3", pregunta: "There is a ______ near my house.", correcta: "river" },
    { audio: "/audios/sem1/Tema1/pillow.mp3", pregunta: "I sleep on a ______ .", correcta: "pillow" },
    { audio: "/audios/sem1/Tema1/watch.mp3", pregunta: "I wear a ______ on my hand.", correcta: "watch" },
    { audio: "/audios/sem1/Tema1/butter.mp3", pregunta: "We eat bread with ______ .", correcta: "butter" },
  ], []);

  const actual = ejercicios[index];
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const checkProgreso = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/progreso/${nivel}/${semana}/${tema}/${ejercicio}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.completado) setYaCompletado(true);
        }
      } catch (error) {
        console.error("Error al consultar progreso:", error);
      }
    };
    checkProgreso();
  }, [id, nivel, semana, tema, ejercicio, API_URL]);

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

  const reproducirAudio = () => {
    audioRef.current?.play();
  };

  const verificar = () => {
    const respuestaUsuario = inputValue.trim().toLowerCase();
    if (!respuestaUsuario) return;
    if (respuestaUsuario === actual.correcta.toLowerCase()) {
      setRespuesta("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("Incorrect");
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

  if (yaCompletado) {
    return (
      <div className="finalizado">
        <h2>You have already completed this exercise.</h2>
        <p>You cannot answer it again.</p>
        <button onClick={() => navigate(`/inicio/${nivel}`)} className="ejercicio-btn">
          Go back to level start
        </button>
      </div>
    );
  }

  if (finalizado) {
    return (
      <div className="finalizado">
        <h2>You have completed the exercise!</h2>
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
        <h1 className="titulo-ejercicio">EXERCISE 2</h1>
        <p className="progreso-ejercicio">
          Question {index + 1} of {ejercicios.length}
        </p>
      </header>

      <section className="tarjeta-ejercicio" style={{ textAlign: "center", fontSize: "1.3rem", padding: "3rem 4rem" }}>
        {index === 0 && (
          <div className="instruccion-box" style={{ marginBottom: "1rem" }}>
            <p className="instruccion-ejercicio" style={{ fontSize: "1.1rem" }}>
              Listen to the audio and spell the missing word.
            </p>
          </div>
        )}

        <p className="pregunta-ejercicio" style={{ marginBottom: "1.5rem", fontSize: "1.4rem" }}>
          {respuesta ? actual.pregunta.replace("______", actual.correcta) : actual.pregunta}
        </p>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1.2rem", margin: "1.5rem 0" }}>
          <button className="btn-audio" style={{ fontSize: "2.5rem", padding: "0.5rem 1rem" }} onClick={reproducirAudio}>
            🔊
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="input-respuesta"
            placeholder="Write the spelled word..."
            style={{ fontSize: "1.2rem", padding: "0.6rem 1rem" }}
          />
        </div>

        <audio ref={audioRef} src={actual.audio} />

        {!respuesta && (
          <button onClick={verificar} className="ejercicio-btn" style={{ fontSize: "1.2rem", padding: "0.7rem 1.5rem" }}>
            Check
          </button>
        )}

        {respuesta && (
          <p
            className="respuesta-feedback"
            style={{
              fontSize: "1.2rem",
              marginTop: "1rem",
              color: respuesta === "Correct" ? "#28A745" : "#DC3545",
              fontWeight: "bold",
            }}
          >
            {respuesta}
          </p>
        )}

        <div className="botones-siguiente" style={{ marginTop: "1.5rem" }}>
          {respuesta && index < ejercicios.length - 1 && (
            <button onClick={siguiente} className="ejercicio-btn" style={{ fontSize: "1.2rem", padding: "0.7rem 1.5rem" }}>
              Next question
            </button>
          )}
          {respuesta && index === ejercicios.length - 1 && (
            <button onClick={manejarFinalizacion} className="ejercicio-btn" style={{ fontSize: "1.2rem", padding: "0.7rem 1.5rem" }}>
              Finish
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
