import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tema1_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [preguntaCorrecta, setPreguntaCorrecta] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  // Lista de ejercicios tipo conversación
  const ejercicios = [
    {
      respuesta: "I get up at 6:30 a.m.",
      opciones: [
        "A: Where do you get up?",
        "A: When do you get up?",
        "A: What do you get up?",
      ],
      correcta: "A: When do you get up?",
    },
    {
      respuesta: "My teacher’s name is Sarah.",
      opciones: [
        "A: Who is your teacher’s name?",
        "A: What is your teacher’s name?",
        "A: Where is your teacher’s name?",
      ],
      correcta: "A: What is your teacher’s name?",
    },
    {
      respuesta: "I go to school by bike.",
      opciones: [
        "A: How do you go to school?",
        "A: What do you go to school?",
        "A: When do you go to school?",
      ],
      correcta: "A: How do you go to school?",
    },
    {
      respuesta: "Because I like animals.",
      opciones: [
        "A: Where do you like animals?",
        "A: Who likes animals?",
        "A: Why do you like animals?",
      ],
      correcta: "A: Why do you like animals?",
    },
    {
      respuesta: "In Mexico City.",
      opciones: [
        "A: What do you live?",
        "A: Where do you live?",
        "A: How do you live?",
      ],
      correcta: "A: Where do you live?",
    },
    {
      respuesta: "Two brothers.",
      opciones: [
        "A: How much brothers do you have?",
        "A: How many brothers do you have?",
        "A: What brothers do you have?",
      ],
      correcta: "A: How many brothers do you have?",
    },
    {
      respuesta: "I’m fine, thanks.",
      opciones: ["A: Who are you?", "A: How are you?", "A: What are you?"],
      correcta: "A: How are you?",
    },
    {
      respuesta: "At 8 o’clock.",
      opciones: [
        "A: What time do you sleep?",
        "A: Where do you sleep?",
        "A: When do you sleep?",
      ],
      correcta: "A: What time do you sleep?",
    },
    {
      respuesta: "She’s my sister.",
      opciones: ["A: What is she?", "A: Who is she?", "A: Where is she?"],
      correcta: "A: Who is she?",
    },
    {
      respuesta: "I want a sandwich.",
      opciones: [
        "A: What do you want?",
        "A: Why do you want?",
        "A: How do you want?",
      ],
      correcta: "A: What do you want?",
    },
  ];

  const actual = ejercicios[index];

const guardarProgreso = async () => {
    const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");

    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
    }

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

      if (!res.ok) console.error("Error al guardar progreso:", res.statusText);
    } catch (error) {
      console.error("Error al guardar el progreso:", error);
    }
  };


  // Verificar respuesta
  const verificar = () => {
    if (!opcionSeleccionada) return;

    setPreguntaCorrecta(actual.correcta);

    if (opcionSeleccionada === actual.correcta) {
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect.`);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setOpcionSeleccionada(null);
    setPreguntaCorrecta(null);
    setIndex(index + 1);
  };

  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => {
      navigate(`/inicio/${nivel}`);
      window.location.reload();
    }, 3000);
  };

  return (
    <div className="ejercicio-container">
      {!finalizado ? (
        <>
          <header className="ejercicio-header">
            <h1 className="titulo-ejercicio">EXERCISE 2</h1>
            <p className="progreso-ejercicio">
              Question {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section className="tarjeta-ejercicio" style={{ textAlign: "center", fontSize: "1.2rem" }}>
            {index === 0 && (
              <div className="instruccion-box">
                <p>Read the dialogue and choose the correct Wh-question.</p>
              </div>
            )}

            {/* 💬 Conversación */}
            <div
              className="dialogo-box"
              style={{
                backgroundColor: "#f4f6fa",
                borderLeft: "5px solid #1b2463",
                borderRadius: "8px",
                padding: "1.5rem",
                margin: "1rem auto",
                maxWidth: "600px",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  marginBottom: "0.8rem",
                  fontWeight: "bold",
                  color: respuesta?.startsWith("❌") ? "#160303ff" : "#171922ff",
                }}
              >
                {preguntaCorrecta
                  ? preguntaCorrecta
                  : opcionSeleccionada
                  ? opcionSeleccionada
                  : "A: ______"}
              </p>
              <p>B: {actual.respuesta}</p>
            </div>

            {/* Opciones */}
            {!respuesta && (
              <div className="opciones-ejercicio" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
                {actual.opciones.map((op, i) => (
                  <button
                    key={i}
                    className={`opcion-btn ${opcionSeleccionada === op ? "seleccionada" : ""}`}
                    onClick={() => setOpcionSeleccionada(op)}
                    style={{ fontSize: "1.1rem", padding: "0.8rem 1.5rem", minWidth: "300px" }}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}

            {/* Botón Check */}
            {!respuesta && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                disabled={!opcionSeleccionada}
                style={{ fontSize: "1.2rem", marginTop: "1.2rem" }}
              >
                Check
              </button>
            )}

            {/* Feedback */}
            {respuesta && (
              <p
                style={{
                  marginTop: "1rem",
                  fontSize: "1.2rem",
                  color: respuesta.startsWith("✅") ? "#2e7d32" : "#c62828",
                }}
              >
                {respuesta}
              </p>
            )}

            {/* Botones siguiente / finalizar */}
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1.5rem" }}>
              {respuesta && index < ejercicios.length - 1 && (
                <button onClick={siguiente} className="ejercicio-btn" style={{ fontSize: "1.2rem" }}>
                  Next question
                </button>
              )}
              {respuesta && index === ejercicios.length - 1 && (
                <button onClick={manejarFinalizacion} className="ejercicio-btn" style={{ fontSize: "1.2rem" }}>
                  Finish
                </button>
              )}
            </div>
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
