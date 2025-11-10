import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tema1_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [mostrarPreguntas, setMostrarPreguntas] = useState(false);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [esCorrecta, setEsCorrecta] = useState<boolean | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const texto = `Emma is a student, and she has a very busy life. She usually wakes up at 6:30 in the morning. She always takes a shower and eats breakfast before going to school. She sometimes goes to school by bus, but she often walks when the weather is nice.
At school, Emma always pays attention in class and takes notes. During lunch, she usually eats with her best friend, Lisa. They sometimes go to the cafeteria and sometimes eat outside in the garden.
After school, Emma rarely watches TV because she prefers to do her homework. In the evening, she often helps her mom cook dinner. Emma never goes to bed late because she gets tired easily. She always sleeps around 9:30 p.m.`;

  const ejercicios = [
    { pregunta: "What time does Emma usually wake up?", opciones: ["She always wakes up at 9:30.", "She usually wakes up at 6:30."], correcta: "She usually wakes up at 6:30." },
    { pregunta: "What does Emma always do before going to school?", opciones: ["She takes a shower and eats breakfast.", "She never eats breakfast."], correcta: "She takes a shower and eats breakfast." },
    { pregunta: "How does Emma go to school?", opciones: ["She sometimes goes by bus.", "She always drives her car."], correcta: "She sometimes goes by bus." },
    { pregunta: "What does Emma always do in class?", opciones: ["She always pays attention.", "She rarely listens to her teacher."], correcta: "She always pays attention." },
    { pregunta: "Who does Emma usually eat lunch with?", opciones: ["She eats alone.", "She usually eats with her best friend, Lisa."], correcta: "She usually eats with her best friend, Lisa." },
    { pregunta: "Where do Emma and Lisa sometimes eat?", opciones: ["In the garden.", "In the gym."], correcta: "In the garden." },
    { pregunta: "What does Emma rarely do after school?", opciones: ["She rarely watches TV.", "She always plays video games."], correcta: "She rarely watches TV." },
    { pregunta: "What does Emma often do in the evening?", opciones: ["She often helps her mom cook dinner.", "She never helps her mom."], correcta: "She often helps her mom cook dinner." },
    { pregunta: "Why does Emma never go to bed late?", opciones: ["Because she gets tired easily.", "Because she loves watching movies."], correcta: "Because she gets tired easily." },
    { pregunta: "What time does Emma always sleep?", opciones: ["She always sleeps around 9:30 p.m.", "She sometimes sleeps at midnight."], correcta: "She always sleeps around 9:30 p.m." },
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

  const verificar = () => {
    if (!opcionSeleccionada) return;
    if (opcionSeleccionada === actual.correcta) {
      setRespuesta(`Correct!\n\n${opcionSeleccionada}`);
      setEsCorrecta(true);
      setCorrectas(prev => prev + 1);
    } else {
      setRespuesta(`Incorrect.\n\nCorrect answer: ${actual.correcta}`);
      setEsCorrecta(false);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setEsCorrecta(null);
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
            {!mostrarPreguntas && <p className="progreso-ejercicio">Reading Activity</p>}
            {mostrarPreguntas && <p className="progreso-ejercicio">Question {index + 1} of {ejercicios.length}</p>}
          </header>

          {/* === PARTE 1: SOLO LECTURA === */}
          {!mostrarPreguntas ? (
            <section className="tarjeta-ejercicio" style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}>
              <p style={{ marginBottom: "1.5rem", fontWeight: "500" }}>
                <strong>Read the text carefully. Then press “Next” to answer the questions.</strong>
              </p>
              <div className="texto-lectura" style={{ backgroundColor: "#f4f6fa", padding: "1.5rem", borderRadius: "8px", textAlign: "left" }}>
                <p style={{ whiteSpace: "pre-line" }}>{texto}</p>
              </div>
              <button
                onClick={() => setMostrarPreguntas(true)}
                className="ejercicio-btn"
                style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", marginTop: "2rem", borderRadius: "8px" }}
              >
                Next
              </button>
            </section>
          ) : (
            // === PARTE 2: PREGUNTAS ===
            <section className="tarjeta-ejercicio" style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}>
              <p className="pregunta-ejercicio" style={{ fontSize: "1.5rem", margin: "1rem 0", fontWeight: 500 }}>
                {actual.pregunta}
              </p>

              {!respuesta && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
                  {actual.opciones.map((op, i) => (
                    <button
                      key={i}
                      className={`opcion-btn ${opcionSeleccionada === op ? "seleccionada" : ""}`}
                      onClick={() => setOpcionSeleccionada(op)}
                      style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem", minWidth: "250px" }}
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
                  style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", marginBottom: "1rem", borderRadius: "8px" }}
                >
                  Check
                </button>
              )}

              {respuesta && (
                <p className={`respuesta-feedback ${esCorrecta ? "correcta" : "incorrecta"}`} style={{ fontSize: "1.3rem", margin: "1rem 0", whiteSpace: "pre-line" }}>
                  {respuesta.split("\n")[0]}
                </p>
              )}

              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
                {respuesta && index < ejercicios.length - 1 && (
                  <button onClick={siguiente} className="ejercicio-btn" style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}>
                    Next question
                  </button>
                )}
                {respuesta && index === ejercicios.length - 1 && (
                  <button onClick={manejarFinalizacion} className="ejercicio-btn" style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}>
                    Finish
                  </button>
                )}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="finalizado" style={{ fontSize: "1.3rem" }}>
          <h2>You have completed the exercise!</h2>
          <p>Correct answers: <strong>{correctas} / {ejercicios.length}</strong></p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
