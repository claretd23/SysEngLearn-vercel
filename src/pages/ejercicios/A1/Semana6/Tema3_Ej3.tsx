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
      {
        audio: "/audios/sem6/e3_1.mp3",
        opciones: ["In the car", "On the bus", "At the bus stop"],
        correcta: "At the bus stop",
      },
      {
        audio: "/audios/sem6/e3_2.mp3",
        opciones: ["In the bag", "On the desk", "At school"],
        correcta: "On the desk",
      },
      {
        audio: "/audios/sem6/e3_3.mp3",
        opciones: ["In the kitchen", "On the balcony", "At the park"],
        correcta: "In the kitchen",
      },
      {
        audio: "/audios/sem6/e3_4.mp3",
        opciones: ["At the airport", "In the plane", "On the bus"],
        correcta: "At the airport",
      },
      {
        audio: "/audios/sem6/e3_5.mp3",
        opciones: ["On the bed", "In the drawer", "At the table"],
        correcta: "On the bed",
      },
      {
        audio: "/audios/sem6/e3_6.mp3",
        opciones: ["In the box", "On the chair", "At the door"],
        correcta: "In the box",
      },
      {
        audio: "/audios/sem6/e3_7.mp3",
        opciones: ["In the park", "At school", "On the bus"],
        correcta: "In the park",
      },
      {
        audio: "/audios/sem6/e3_8.mp3",
        opciones: ["On the sofa", "In the room", "At work"],
        correcta: "On the sofa",
      },
      {
        audio: "/audios/sem6/e3_9.mp3",
        opciones: ["In the classroom", "On the chair", "At the door"],
        correcta: "At the door",
      },
      {
        audio: "/audios/sem6/e3_10.mp3",
        opciones: ["In the fridge", "On the table", "At the store"],
        correcta: "In the fridge",
      },
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
              Listen carefully to each sentence. You will hear where a person, animal, or thing is located.
              Choose the correct answer that shows the right preposition of place: in, on, or at.
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
              whiteSpace: "pre-line",
            }}
          >
            {respuesta}
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
