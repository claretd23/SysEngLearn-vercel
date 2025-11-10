import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tema3_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [esCorrecta, setEsCorrecta] = useState<boolean | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios = [
    { pregunta: "How do you go to school?", opciones: ["by bus", "in bus", "on bus"], correcta: "by bus" },
    { pregunta: "Where is she? She’s ___ the train.", opciones: ["by", "in", "on"], correcta: "on" },
    { pregunta: "They usually travel to Japan ___ plane.", opciones: ["by", "on", "in"], correcta: "by" },
    { pregunta: "We are ___ the car, waiting for you.", opciones: ["by", "in", "on"], correcta: "in" },
    { pregunta: "Do you go to work ___ bike?", opciones: ["by", "on", "in"], correcta: "by" },
    { pregunta: "Look! The children are ___ the school bus!", opciones: ["in", "on", "by"], correcta: "on" },
    { pregunta: "My dad goes to his office ___ car every morning.", opciones: ["on", "in", "by"], correcta: "by" },
    { pregunta: "We are ___ the taxi right now.", opciones: ["on", "in", "by"], correcta: "in" },
    { pregunta: "They traveled to the island ___ boat last weekend.", opciones: ["in", "on", "by"], correcta: "by" },
    { pregunta: "He is ___ the airplane, ready for takeoff.", opciones: ["by", "in", "on"], correcta: "on" },
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

    const oracionCompletada = actual.pregunta.replace("___", opcionSeleccionada);

    if (opcionSeleccionada === actual.correcta) {
      setRespuesta(`Correct!\n\n${oracionCompletada}`);
      setEsCorrecta(true);
      setCorrectas(prev => prev + 1);
    } else {
      const oracionCorrecta = actual.pregunta.replace("___", actual.correcta);
      setRespuesta(`Incorrect.\n\n${oracionCorrecta}`);
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
            <p className="progreso-ejercicio">
              Question {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section className="tarjeta-ejercicio" style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}>
            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
                <p className="instruccion-ejercicio">
                  Complete each sentence with the correct preposition (by, on, or in).
                </p>
              </div>
            )}

            <div className="oracion-box" style={{
              backgroundColor: "#f4f6fa",
              borderLeft: "5px solid #222a5c",
              borderRadius: "8px",
              padding: "1.5rem",
              margin: "1rem auto",
              maxWidth: "650px",
              textAlign: "left",
              fontStyle: "italic",
              whiteSpace: "pre-line",
            }}>
              <p>{respuesta ? respuesta.split("\n").slice(1).join("\n") : actual.pregunta}</p>
            </div>

            {!respuesta && (
              <div className="opciones-ejercicio" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
                {actual.opciones.map((op, i) => (
                  <button
                    key={i}
                    className={`opcion-btn ${opcionSeleccionada === op ? "seleccionada" : ""}`}
                    onClick={() => setOpcionSeleccionada(op)}
                    style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem", minWidth: "150px" }}
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
              <p
                className={`respuesta-feedback ${esCorrecta ? "correcta" : "incorrecta"}`}
                style={{ fontSize: "1.3rem", margin: "1rem 0", whiteSpace: "pre-line" }}
              >
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
        </>
      ) : (
        <div className="finalizado" style={{ fontSize: "1.3rem" }}>
          <h2>You have completed the exercise!</h2>
          <p>
            Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
