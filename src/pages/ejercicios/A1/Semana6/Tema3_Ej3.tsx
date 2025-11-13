import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import "../ejercicios.css";

export default function Tema3_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // === LISTA DE EJERCICIOS ===
  const ejercicios = useMemo(
    () => [
      {
        audio: "/audios/sem3/ej3_1.mp3",
        pregunta: "Where is the speaker?",
        opciones: ["In the car", "On the bus", "At the bus stop"],
        correcta: "At the bus stop",
      },
      {
        audio: "/audios/sem3/ej3_2.mp3",
        pregunta: "Where are the books?",
        opciones: ["In the bag", "On the desk", "At school"],
        correcta: "On the desk",
      },
      {
        audio: "/audios/sem3/ej3_3.mp3",
        pregunta: "Where are the parents?",
        opciones: ["In the kitchen", "On the balcony", "At the park"],
        correcta: "In the kitchen",
      },
      {
        audio: "/audios/sem3/ej3_4.mp3",
        pregunta: "Where are they?",
        opciones: ["At the airport", "In the plane", "On the bus"],
        correcta: "At the airport",
      },
      {
        audio: "/audios/sem3/ej3_5.mp3",
        pregunta: "Where is the phone?",
        opciones: ["On the bed", "In the drawer", "At the table"],
        correcta: "On the bed",
      },
      {
        audio: "/audios/sem3/ej3_6.mp3",
        pregunta: "Where is the cat?",
        opciones: ["In the box", "On the chair", "At the door"],
        correcta: "In the box",
      },
      {
        audio: "/audios/sem3/ej3_7.mp3",
        pregunta: "Where are the children?",
        opciones: ["In the park", "At school", "On the bus"],
        correcta: "In the park",
      },
      {
        audio: "/audios/sem3/ej3_8.mp3",
        pregunta: "Where is the speaker?",
        opciones: ["On the sofa", "In the room", "At work"],
        correcta: "On the sofa",
      },
      {
        audio: "/audios/sem3/ej3_9.mp3",
        pregunta: "Where is the teacher?",
        opciones: ["In the classroom", "On the chair", "At the door"],
        correcta: "At the door",
      },
      {
        audio: "/audios/sem3/ej3_10.mp3",
        pregunta: "Where are the apples?",
        opciones: ["In the fridge", "On the table", "At the store"],
        correcta: "In the fridge",
      },
    ],
    []
  );

  const actual = ejercicios[index];

  // === AUDIO ===
  const playAudio = () => {
    audioRef.current?.play();
  };

  // === GUARDAR PROGRESO ===
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

  // === VERIFICAR RESPUESTA ===
  const verificar = (op: string) => {
    setOpcionSeleccionada(op);
    if (op === actual.correcta) {
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("Incorrect!");
    }
  };

  // === SIGUIENTE ===
  const siguiente = () => {
    setRespuesta(null);
    setOpcionSeleccionada(null);
    setIndex((prev) => prev + 1);
  };

  // === FINALIZAR ===
  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => navigate(`/inicio/${nivel}`), 2500);
  };

  // === FINALIZADO ===
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

  // === RENDER ===
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
              Listen carefully to each sentence. Choose the correct answer that shows the right preposition of place: <strong>in, on, or at</strong>.
            </p>
          </div>
        )}

        {/* AUDIO */}
        <button
          className="btn-audio"
          style={{ fontSize: "2rem", margin: "1rem 0" }}
          onClick={playAudio}
        >
          🔊
        </button>
        <audio ref={audioRef} src={actual.audio} />

        {/* PREGUNTA */}
        <p style={{ fontSize: "1.3rem", margin: "1rem 0" }}>{actual.pregunta}</p>

        {/* OPCIONES */}
        <div
          className="opciones-ejercicio"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          {actual.opciones.map((op, i) => {
            // clases condicionales para resaltar correct/incorrect después de responder
            let clase = "opcion-btn";
            if (respuesta) {
              if (op === actual.correcta) clase += " correcta";
              else if (op === opcionSeleccionada) clase += " incorrecta";
              else clase += " neutral";
            }

            return (
              <button
                key={i}
                className={clase}
                onClick={() => !respuesta && verificar(op)}
                style={{
                  fontSize: "1.2rem",
                  padding: "0.8rem 1.5rem",
                  minWidth: "250px",
                }}
                disabled={!!respuesta}
              >
                {op}
              </button>
            );
          })}
        </div>

        {/* FEEDBACK (muestra también cuál es la respuesta correcta) */}
        {respuesta && (
          <div style={{ margin: "1rem 0", fontSize: "1.3rem" }}>
            <p
              className={`respuesta-feedback ${
                respuesta === "Correct!" ? "correcta" : "incorrecta"
              }`}
              style={{ marginBottom: "0.5rem" }}
            >
              {respuesta}
            </p>
            <p>
              Respuesta correcta: <strong>{actual.correcta}</strong>
            </p>
          </div>
        )}

        {/* BOTONES SIGUIENTE / FINALIZAR */}
        <div className="botones-siguiente" style={{ marginTop: "1rem" }}>
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
            <button
              onClick={manejarFinalizacion}
              className="ejercicio-btn"
              style={{ fontSize: "1.3rem", padding: "0.8rem 2rem" }}
            >
              Finish
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
