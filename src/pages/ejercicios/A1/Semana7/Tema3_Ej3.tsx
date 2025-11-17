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
        audio: ["/audios/sem7/aa.mp3", "/audios/sem7/ab.mp3"],
        pregunta: "Who did they see?",
        opciones: ["You", "Maria", "Me"],
        correcta: "Maria",
      },
      {
        audio: ["/audios/sem7/ba.mp3", "/audios/sem7/bb.mp3"],
        pregunta: "Who does he help?",
        opciones: ["John", "Me", "You"],
        correcta: "John",
      },
      {
        audio: ["/audios/sem7/ca.mp3", "/audios/sem7/cb.mp3"],
        pregunta: "What is 'it' referring to?",
        opciones: ["The cat", "The dog", "The bird"],
        correcta: "The dog",
      },
      {
        audio: ["/audios/sem7/da.mp3", "/audios/sem7/db.mp3"],
        pregunta: "Who does he call?",
        opciones: ["Her friend", "His mom", "You"],
        correcta: "His mom",
      },
      {
        audio: ["/audios/sem7/ea.mp3", "/audios/sem7/eb.mp3"],
        pregunta: "What does 'it' refer to?",
        opciones: ["The movie", "The book", "The song"],
        correcta: "The movie",
      },
      {
        audio: ["/audios/sem7/fa.mp3", "/audios/sem7/fb.mp3"],
        pregunta: "Who do you see?",
        opciones: ["Alex", "Maria", "You"],
        correcta: "Alex",
      },
      {
        audio: ["/audios/sem7/ga.mp3", "/audios/sem7/gb.mp3"],
        pregunta: "Who will they invite?",
        opciones: ["Lisa", "Me", "Him"],
        correcta: "Lisa",
      },
      {
        audio: ["/audios/sem7/ha.mp3", "/audios/sem7/hb.mp3"],
        pregunta: "What does he see?",
        opciones: ["A book", "Your bag", "The key"],
        correcta: "Your bag",
      },
      {
        audio: ["/audios/sem7/ia.mp3", "/audios/sem7/ib.mp3"],
        pregunta: "Who does B ask for help?",
        opciones: ["Tom", "Maria", "You"],
        correcta: "Tom",
      },
      {
        audio: ["/audios/sem7/ja.mp3", "/audios/sem7/jb.mp3"],
        pregunta: "Who is he playing with?",
        opciones: ["The children", "The parents", "The dogs"],
        correcta: "The children",
      },
    ],
    []
  );

  const actual = ejercicios[index];
  const audioRef = useRef(new Audio());

  const playAudio = async () => {
    for (let src of actual.audio) {
      audioRef.current.src = src;
      await audioRef.current.play();

      await new Promise((resolve) => {
        audioRef.current.onended = resolve;
      });
    }
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

  // ======================
  // VERIFICAR RESPUESTA
  // ======================
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

  // ======================
  // RENDER
  // ======================
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
                  Listen to each dialogue, focus on the object pronoun, and choose the correct answer.
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
                    style={{
                      fontSize: "1.2rem",
                      padding: "0.8rem 1.5rem",
                      minWidth: "220px",
                    }}
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
