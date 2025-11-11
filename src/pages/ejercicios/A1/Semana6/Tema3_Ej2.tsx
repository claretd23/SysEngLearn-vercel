import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tema3_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [mostrarPreguntas, setMostrarPreguntas] = useState(false);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const texto = `Hello! My name is Daniel, and I live in a small apartment in Guadalajara. My apartment is on the third floor of a tall building. From my window, I can see a park in front of the supermarket.
I work at a big company in the city center. Every morning, I wait at the bus stop near my house and take the bus to work. In the office, my desk is next to the window, and my computer is on the desk. My boss sits in his office, and we usually have meetings in the conference room.
At lunchtime, I eat in the cafeteria with my coworkers. After work, I stop at the gym for an hour, and then I go back home. When I get home, I like to relax on the sofa and watch TV in the living room. My cat, Luna, loves sleeping on my bed.
On weekends, I spend time at my parents’ house or meet my friends in a café in the city center. I really like living in Guadalajara because everything I need is close by!`;

  const ejercicios = [
    { pregunta: "Where does Daniel live?", opciones: ["In Guadalajara", "At Guadalajara"], correcta: "In Guadalajara" },
    { pregunta: "Where is his apartment?", opciones: ["In the basement", "On the third floor"], correcta: "On the third floor" },
    { pregunta: "Where does Daniel wait for the bus?", opciones: ["At the bus stop", "In the bus stop"], correcta: "At the bus stop" },
    { pregunta: "Where is Daniel’s desk at work?", opciones: ["Next to the window", "On the window"], correcta: "Next to the window" },
    { pregunta: "Where does Daniel have meetings?", opciones: ["In the conference room", "At the desk"], correcta: "In the conference room" },
    { pregunta: "Where does Daniel eat lunch?", opciones: ["On the cafeteria", "In the cafeteria"], correcta: "In the cafeteria" },
    { pregunta: "Where does Daniel go after work?", opciones: ["At the gym", "To the gym"], correcta: "To the gym" },
    { pregunta: "Where does Daniel watch TV?", opciones: ["In the living room", "At the living room"], correcta: "In the living room" },
    { pregunta: "Where does his cat sleep?", opciones: ["On his bed", "In his bed"], correcta: "On his bed" },
    { pregunta: "Where does Daniel meet his friends on weekends?", opciones: ["In a café in the city center", "At a café on the park"], correcta: "In a café in the city center" },
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
      setCorrectas(prev => prev + 1);
    } else {
      setRespuesta(`Incorrect.\n\nCorrect answer: ${actual.correcta}`);
    }
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
            {!mostrarPreguntas && <p className="progreso-ejercicio">Reading Activity</p>}
            {mostrarPreguntas && <p className="progreso-ejercicio">Question {index + 1} of {ejercicios.length}</p>}
          </header>

          {!mostrarPreguntas ? (
            <section className="tarjeta-ejercicio" style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}>
              <p style={{ marginBottom: "1.5rem", fontWeight: "500" }}>
                <strong>Read the text carefully. Then press “Next” to answer the questions.</strong>
              </p>
              <div className="texto-lectura" style={{ backgroundColor: "#f4f6fa", padding: "1.5rem", borderRadius: "8px", textAlign: "left" }}>
                <p style={{ whiteSpace: "pre-line" }}>{texto}</p>
              </div>
              <button onClick={() => setMostrarPreguntas(true)} className="ejercicio-btn" style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", marginTop: "2rem", borderRadius: "8px" }}>
                Next
              </button>
            </section>
          ) : (
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
                <button onClick={verificar} className="ejercicio-btn" disabled={!opcionSeleccionada} style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", marginBottom: "1rem", borderRadius: "8px" }}>
                  Check
                </button>
              )}

              {respuesta && (
                <p className={`respuesta-feedback ${respuesta.startsWith("Correct") ? "correcta" : "incorrecta"}`} style={{ fontSize: "1.3rem", margin: "1rem 0" }}>
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
          <h2>Well done! You have completed the exercise.</h2>
          <p>Correct answers: <strong>{correctas} / {ejercicios.length}</strong></p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
