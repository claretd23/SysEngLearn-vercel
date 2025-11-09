import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import "../ejercicios.css";

export default function Tema3_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const ejercicios = useMemo(
    () => [
      { audio: "/audios/sem4/mc1.mp3", opciones: ["Yes, I am.", "No, he isn’t.", "Yes, she does."], correcta: "Yes, I am." },
      { audio: "/audios/sem4/mc2.mp3", opciones: ["Yes, he is.", "No, he isn’t.", "No, they aren’t."], correcta: "No, he isn’t." },
      { audio: "/audios/sem4/mc3.mp3", opciones: ["Yes, I do.", "No, I don’t.", "No, I’m not."], correcta: "No, I don’t." },
      { audio: "/audios/sem4/mc4.mp3", opciones: ["Yes, she is.", "No, she doesn’t.", "Yes, he does."], correcta: "Yes, she is." },
      { audio: "/audios/sem4/mc5.mp3", opciones: ["No, they aren’t.", "No, they don’t.", "Yes, they are."], correcta: "No, they don’t." },
      { audio: "/audios/sem4/mc6.mp3", opciones: ["Yes, they do.", "No, they don’t.", "Yes, they are."], correcta: "Yes, they are." },
      { audio: "/audios/sem4/mc7.mp3", opciones: ["Yes, she does.", "No, she isn’t.", "Yes, she is."], correcta: "Yes, she does." },
      { audio: "/audios/sem4/mc8.mp3", opciones: ["Yes, I do.", "No, I’m not.", "Yes, I does."], correcta: "No, I’m not." },
      { audio: "/audios/sem4/mc9.mp3", opciones: ["Yes, I am.", "No, I’m not.", "Yes, I do."], correcta: "Yes, I do." },
      { audio: "/audios/sem4/mc10.mp3", opciones: ["Yes, it is.", "No, it isn’t.", "Yes, they are."], correcta: "No, it isn’t." },
    ],
    []
  );

  const actual = ejercicios[index];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    audioRef.current?.play();
  };

  const guardarProgreso = async () => {
    // Guardar en localStorage
    const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
    }

    // Guardar en backend
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
    if (!seleccion) return;

    if (seleccion === actual.correcta) {
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect.\nCorrect answer: ${actual.correcta}`);
    }
  };

  const siguiente = async () => {
    setRespuesta(null);
    setSeleccion(null);
    await guardarProgreso();
    if (index + 1 < ejercicios.length) {
      setIndex(index + 1);
    } else {
      setFinalizado(true);
      setTimeout(() => {
        navigate(`/inicio/${nivel}`);
        window.location.reload();
      }, 2500);
    }
  };

  if (finalizado) {
    return (
      <div className="finalizado" style={{ fontSize: "1.3rem" }}>
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
        <h1 className="titulo-ejercicio">EXERCISE 3</h1>
        <p className="progreso-ejercicio">
          Question {index + 1} of {ejercicios.length}
        </p>
      </header>

      <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
        {index === 0 && (
          <div className="instruccion-box" style={{ fontSize: "1.3rem" }}>
            <p className="instruccion-ejercicio">
              🎧 Listen to the audio and choose the correct answer.
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

        <div
          className="opciones-container"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          {actual.opciones.map((opcion) => (
            <button
              key={opcion}
              onClick={() => setSeleccion(opcion)}
              className={`opcion-btn ${seleccion === opcion ? "seleccionada" : ""}`}
              disabled={!!respuesta}
              style={{
                fontSize: "1.2rem",
                padding: "0.5rem 1rem",
                width: "250px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                textAlign: "center",
              }}
            >
              {opcion}
            </button>
          ))}
        </div>

        {respuesta && (
          <p
            className={`respuesta-feedback ${respuesta.startsWith("Correct") ? "correcta" : "incorrecta"}`}
            style={{
              fontSize: "1.2rem",
              margin: "1rem 0",
              color: respuesta.startsWith("Correct") ? "#0D6EFD" : "#DC3545",
              fontWeight: "bold",
              minHeight: "1.5rem",
            }}
          >
            {respuesta.split("\n")[0]}
          </p>
        )}

        {!respuesta && seleccion && (
          <button
            onClick={verificar}
            className="ejercicio-btn"
            style={{ fontSize: "1.3rem", padding: "0.8rem 2rem" }}
          >
            Check
          </button>
        )}

        {respuesta && (
          <button
            onClick={siguiente}
            className="ejercicio-btn"
            style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", marginTop: "1rem" }}
          >
            {index === ejercicios.length - 1 ? "Finish" : "Next question"}
          </button>
        )}
      </section>
    </div>
  );
}
