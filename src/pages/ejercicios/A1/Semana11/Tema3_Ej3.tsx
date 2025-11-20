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
        audio: "/audios/sem11/11.mp3",
        pregunta: "Who are Anna and Max?",
        opciones: ["Emma’s sisters", "Emma’s cousins", "Emma’s grandparents"],
        correcta: "Emma’s cousins",
      },
      {
        audio: "/audios/sem11/12.mp3",
        pregunta: "Who is Kate?",
        opciones: ["Ben’s cousin", "Ben’s sister", "Ben’s aunt"],
        correcta: "Ben’s sister",
      },
      {
        audio: "/audios/sem11/13.mp3",
        pregunta: "Who is Mia?",
        opciones: ["Lily’s cousin", "Lily’s sister", "Lily’s aunt"],
        correcta: "Lily’s cousin",
      },
      {
        audio: "/audios/sem11/14.mp3",
        pregunta: "Who is Ben?",
        opciones: ["Tom’s brother", "Tom’s cousin", "Tom’s father"],
        correcta: "Tom’s brother",
      },
      {
        audio: "/audios/sem11/15.mp3",
        pregunta: "Who is older, Sara or Emma?",
        opciones: ["Sara", "Emma", "Leo"],
        correcta: "Emma",
      },
      {
        audio: "/audios/sem11/16.mp3",
        pregunta: "Who is Lucas’ uncle?",
        opciones: ["John", "Paul", "Kate"],
        correcta: "Paul",
      },
      {
        audio: "/audios/sem11/17.mp3",
        pregunta: "Who is Alex?",
        opciones: ["Anna’s cousin", "Anna’s brother", "Anna’s uncle"],
        correcta: "Anna’s cousin",
      },
      {
        audio: "/audios/sem11/18.mp3",
        pregunta: "Who is Rachel?",
        opciones: ["Paul’s cousin", "Paul’s aunt", "Paul’s grandmother"],
        correcta: "Paul’s aunt",
      },
      {
        audio: "/audios/sem11/19.mp3",
        pregunta: "Who is Max?",
        opciones: ["Mia’s brother", "Mia’s cousin", "Mia’s uncle"],
        correcta: "Mia’s cousin",
      },
      {
        audio: "/audios/sem11/20.mp3",
        pregunta: "Who is Lily?",
        opciones: ["Jake’s sister", "Jake’s cousin", "Jake’s aunt"],
        correcta: "Jake’s sister",
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

      if (!res.ok) {
        console.error("Error saving progress:", res.statusText);
      }
    } catch (error) {
      console.error("Progress error:", error);
    }
  };

  const verificar = () => {
    if (!seleccion) return;

    if (seleccion === actual.correcta) {
      setRespuesta("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect.\n\nCorrect answer: ${actual.correcta}`);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setSeleccion(null);

    if (index + 1 < ejercicios.length) {
      setIndex(index + 1);
    } else {
      finalizar();
    }
  };

  const finalizar = async () => {
    await guardarProgreso();
    setFinalizado(true);

    setTimeout(() => {
      navigate(`/inicio/${nivel}`);
      window.location.reload();
    }, 3000);
  };

  const esCorrecta = respuesta?.startsWith("Correct");

  return (
    <div className="ejercicio-container">
      {!finalizado ? (
        <>
          <header className="ejercicio-header">
            <h1 className="titulo-ejercicio">EXERCISE 3</h1>
            <p className="progreso-ejercicio">
              Question {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section
            className="tarjeta-ejercicio"
            style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}
          >
            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
                <p className="instruccion-ejercicio">
                  Listen carefully to each dialogue. Choose the correct answer (a, b, or c) to show who each person is in the family.
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
              className="oracion-box"
              style={{
                backgroundColor: "#f4f6fa",
                borderLeft: "5px solid #222a5c",
                borderRadius: "8px",
                padding: "1.5rem",
                margin: "1rem auto",
                maxWidth: "600px",
                textAlign: "left",
                fontStyle: "italic",
              }}
            >
              <p>{actual.pregunta}</p>
            </div>

            {!respuesta && (
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
                {actual.opciones.map((op, i) => (
                  <button
                    key={i}
                    className={`opcion-btn ${seleccion === op ? "seleccionada" : ""}`}
                    onClick={() => setSeleccion(op)}
                    style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem", minWidth: "220px" }}
                  >
                    {op}
                  </button>
                ))}
              </div>
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
              <p
                className={`respuesta-feedback ${esCorrecta ? "correcta" : "incorrecta"}`}
                style={{
                  fontSize: "1.3rem",
                  margin: "1rem 0",
                  color: esCorrecta ? "green" : "red",
                  fontWeight: 600,
                  whiteSpace: "pre-line",
                }}
              >
                {respuesta}
              </p>
            )}

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
                onClick={finalizar}
                className="ejercicio-btn"
                style={{ fontSize: "1.3rem", padding: "0.8rem 2rem" }}
              >
                Finish
              </button>
            )}
          </section>
        </>
      ) : (
        <div className="finalizado" style={{ fontSize: "1.3rem" }}>
          <h2>You have completed the exercise!</h2>
          <p>
            Correct answers:{" "}
            <strong>
              {correctas} / {ejercicios.length}
            </strong>
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
