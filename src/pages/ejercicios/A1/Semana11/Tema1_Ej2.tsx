import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

interface EjercicioOpciones {
  pregunta: string;
  opciones: string[];
  correcta: string;
}

export default function Tema1_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const navigate = useNavigate();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;

  const [index, setIndex] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios: EjercicioOpciones[] = [
    {
      pregunta: "Whose phone is ringing?",
      opciones: ["It’s Sarah’s phone.", "It’s Sarah phone.", "It’s Sarahs phone."],
      correcta: "It’s Sarah’s phone.",
    },
    {
      pregunta: "Whose backpack is this on the floor?",
      opciones: ["It’s Tom’s backpack.", "It’s Toms backpack.", "It’s Tom backpack."],
      correcta: "It’s Tom’s backpack.",
    },
    {
      pregunta: "Whose shoes are these by the door?",
      opciones: ["They’re my brothers’ shoes.", "They’re my brother’s shoes.", "They’re my brother shoes."],
      correcta: "They’re my brothers’ shoes.",
    },
    {
      pregunta: "Whose house is the biggest on the street?",
      opciones: ["It’s my parents house.", "It’s my parents’ house.", "It’s my parent’s house."],
      correcta: "It’s my parents’ house.",
    },
    {
      pregunta: "Whose book is this?",
      opciones: ["It’s the teacher’s book.", "It’s the teachers book.", "It’s the teachers’ book."],
      correcta: "It’s the teacher’s book.",
    },
    {
      pregunta: "Whose dogs are barking?",
      opciones: ["They’re our neighbors’ dogs.", "They’re our neighbor’s dogs.", "They’re our neighbor dogs."],
      correcta: "They’re our neighbors’ dogs.",
    },
    {
      pregunta: "Whose car is parked in front of the school?",
      opciones: ["It’s the teachers car.", "It’s the teacher’s car.", "It’s the teachers’ car."],
      correcta: "It’s the teacher’s car.",
    },
    {
      pregunta: "Whose idea was it to travel abroad?",
      opciones: ["It was Emma’s idea.", "It was Emma idea.", "It was Emmas idea."],
      correcta: "It was Emma’s idea.",
    },
    {
      pregunta: "Whose computer is that?",
      opciones: ["It’s John’s computer.", "It’s Johns computer.", "It’s John computer."],
      correcta: "It’s John’s computer.",
    },
    {
      pregunta: "Whose jackets are those?",
      opciones: ["They’re the boys’ jackets.", "They’re the boy’s jackets.", "They’re the boys jackets."],
      correcta: "They’re the boys’ jackets.",
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
      const res = await fetch("http://localhost:5000/api/progreso", {
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

  const verificar = () => {
    if (!opcionSeleccionada) return;

    if (opcionSeleccionada === actual.correcta) {
      setRespuesta(`✅ Correct!\n\n${actual.correcta}`);
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`❌ Incorrect.\n\n${actual.correcta}`);
    }

    // Autocompletar automáticamente después de 1.2s
    setTimeout(() => {
      if (index < ejercicios.length - 1) {
        siguiente();
      } else {
        manejarFinalizacion();
      }
    }, 1200);
  };

  const siguiente = () => {
    setRespuesta(null);
    setOpcionSeleccionada(null);
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

          <section
            className="tarjeta-ejercicio"
            style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}
          >
            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
                <p className="instruccion-ejercicio" style={{ fontSize: "1.3rem" }}>
                  Read the question and choose the correct answer.
                </p>
              </div>
            )}

            <div
              className="oracion-box"
              style={{
                backgroundColor: "#f4f6fa",
                borderLeft: "5px solid #222a5c",
                borderRadius: "8px",
                padding: "1.5rem",
                margin: "1rem auto",
                maxWidth: "650px",
                textAlign: "left",
                fontStyle: "italic",
                whiteSpace: "pre-line",
              }}
            >
              <p>{respuesta ? respuesta.split("\n").slice(1).join("\n") : actual.pregunta}</p>
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
                    className={`opcion-btn ${opcionSeleccionada === op ? "seleccionada" : ""}`}
                    onClick={() => setOpcionSeleccionada(op)}
                    style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem", minWidth: "280px" }}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}

            {!respuesta && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                disabled={!opcionSeleccionada}
                style={{
                  fontSize: "1.3rem",
                  padding: "0.8rem 2rem",
                  marginBottom: "1rem",
                  borderRadius: "8px",
                }}
              >
                Check
              </button>
            )}

            {respuesta && (
              <p
                className={`respuesta-feedback ${respuesta.startsWith("✅") ? "correcta" : "incorrecta"}`}
                style={{ fontSize: "1.3rem", margin: "1rem 0" }}
              >
                {respuesta.split("\n")[0]}
              </p>
            )}
          </section>
        </>
      ) : (
        <div className="finalizado" style={{ fontSize: "1.3rem" }}>
          <h2>✅ You have completed the exercise!</h2>
          <p>
            Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
