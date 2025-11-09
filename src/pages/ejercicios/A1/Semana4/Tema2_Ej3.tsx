import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "../ejercicios.css";

export default function Tema3_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const ejercicios = [
    { pregunta: "How does Lucas feel on Monday?", opciones: ["Happy", "Tired", "Excited"], correcta: "Tired" },
    { pregunta: "Why does Lucas feel happy on Tuesday?", opciones: ["Because he finishes his homework", "Because his best friend visits him", "Because he goes to a concert"], correcta: "Because his best friend visits him" },
    { pregunta: "How does Emma feel today?", opciones: ["Worried", "Angry", "Bored"], correcta: "Worried" },
    { pregunta: "Why does Emma feel worried?", opciones: ["Because she has an exam", "Because she lost her phone", "Because she is late"], correcta: "Because she has an exam" },
    { pregunta: "What other emotion does Emma feel?", opciones: ["Excited", "Sad", "Nervous"], correcta: "Excited" },
    { pregunta: "Why does Daniel feel angry?", opciones: ["Because he can’t find his keys", "Because he’s hungry", "Because he failed a test"], correcta: "Because he can’t find his keys" },
    { pregunta: "How does Daniel feel about his work?", opciones: ["Relaxed", "Stressed", "Happy"], correcta: "Stressed" },
    { pregunta: "What do they usually do on Saturday?", opciones: ["They go shopping.", "They stay home and watch movies.", "They go to school."], correcta: "They stay home and watch movies." },
    { pregunta: "How do they feel on weekends?", opciones: ["Relaxed", "Angry", "Bored"], correcta: "Relaxed" },
    { pregunta: "Why do they feel happy on Sunday?", opciones: ["Because they spend time with their families", "Because they have no homework", "Because they go to a concert"], correcta: "Because they spend time with their families" },
  ];

  const actual = ejercicios[index];

  const playAudio = () => {
    audioRef.current?.play();
  };

  const guardarProgreso = async () => {
    const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
    }

    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/progreso`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nivel, semana, tema, ejercicio }),
      });
      if (!res.ok) console.error("Error al guardar progreso:", res.statusText);
    } catch (err) {
      console.error("Error al guardar progreso:", err);
    }
  };

  const verificar = () => {
    if (!opcionSeleccionada) return;

    if (opcionSeleccionada === actual.correcta) {
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect.\n\nCorrect answer: "${actual.correcta}"`);
    }
  };

  const siguiente = async () => {
    await guardarProgreso();
    setRespuesta(null);
    setOpcionSeleccionada(null);
    if (index + 1 < ejercicios.length) {
      setIndex(index + 1);
    } else {
      setFinalizado(true);
      setTimeout(() => navigate(`/inicio/${nivel}`), 2500);
    }
  };

  if (finalizado) {
    return (
      <div className="finalizado" style={{ fontSize: "1.3rem" }}>
        <h2>You have completed the listening exercise!</h2>
        <p>Correct answers: <strong>{correctas} / {ejercicios.length}</strong></p>
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
              Listen carefully to the audio and choose the correct answer for each question.
              <br />You can replay the audio if needed.
            </p>
          </div>
        )}

        {/* Audio */}
        <button className="btn-audio" style={{ fontSize: "2rem", margin: "1rem 0" }} onClick={playAudio}>
          🔊
        </button>
        <audio ref={audioRef} src="/audios/sem4/Listening2.mp3" />

        {/* Pregunta */}
        <h2 style={{ fontSize: "1.4rem", marginBottom: "1rem", color: "#222a5c" }}>
          {actual.pregunta}
        </h2>

        {/* Opciones */}
        {!respuesta && (
          <div className="opciones-ejercicio" style={{ display: "flex", flexDirection: "column", gap: "0.8rem", alignItems: "center", marginBottom: "1rem" }}>
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

        {/* Botón Check */}
        {!respuesta && (
          <button onClick={verificar} className="ejercicio-btn" disabled={!opcionSeleccionada} style={{ fontSize: "1.2rem", padding: "0.7rem 2rem", borderRadius: "8px" }}>
            Check
          </button>
        )}

        {/* Feedback */}
        {respuesta && (
          <p className={`respuesta-feedback ${respuesta.startsWith("Correct") ? "correcta" : "incorrecta"}`}
            style={{ fontSize: "1.2rem", margin: "1rem 0", color: respuesta.startsWith("Correct") ? "#2ecc71" : "#e74c3c", fontWeight: "bold" }}>
            {respuesta}
          </p>
        )}

        {/* Botones siguiente / finalizar */}
        {respuesta && (
          <div className="botones-siguiente" style={{ marginTop: "1rem" }}>
            <button onClick={siguiente} className="ejercicio-btn" style={{ fontSize: "1.2rem", padding: "0.7rem 2rem", borderRadius: "8px" }}>
              {index === ejercicios.length - 1 ? "Finish" : "Next question"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
