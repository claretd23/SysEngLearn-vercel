import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

export default function Tema3_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios = [
    { pregunta: "Are you a student?", opciones: ["Yes, I do.", "Yes, I am.", "No, I have."], correcta: "Yes, I am." },
    { pregunta: "Is he from Mexico?", opciones: ["No, he isn’t.", "No, he does.", "Yes, he do."], correcta: "No, he isn’t." },
    { pregunta: "Do they play football?", opciones: ["No, they aren’t.", "Yes, they do.", "No, they is."], correcta: "Yes, they do." },
    { pregunta: "Does she like pizza?", opciones: ["Yes, she likes.", "No, she do.", "Yes, she does."], correcta: "Yes, she does." },
    { pregunta: "Are we late?", opciones: ["No, we aren’t.", "No, we do.", "Yes, we don’t."], correcta: "No, we aren’t." },
    { pregunta: "Can you swim?", opciones: ["Yes, I can.", "No, I am.", "Yes, I do."], correcta: "Yes, I can." },
    { pregunta: "Is it raining?", opciones: ["Yes, it is.", "No, it does.", "Yes, it rains."], correcta: "Yes, it is." },
    { pregunta: "Do you have a dog?", opciones: ["No, I am.", "No, I don’t.", "Yes, I have."], correcta: "No, I don’t." },
    { pregunta: "Are they from Spain?", opciones: ["Yes, they are.", "No, they can.", "No, they does."], correcta: "Yes, they are." },
    { pregunta: "Does he work in a hospital?", opciones: ["No, he doesn’t.", "Yes, he is.", "Yes, he do."], correcta: "No, he doesn’t." },
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
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect.\n\nCorrect answer: "${actual.correcta}"`);
    }
  };

  const siguiente = async () => {
    await guardarProgreso();
    setRespuesta(null);
    setOpcionSeleccionada(null);
    if (index + 1 < ejercicios.length) {
      setIndex(index + 1);
    } else {
      setFinalizado(true);
      setTimeout(() => navigate(`/inicio/${nivel}`), 2500);
    }
  };

  if (finalizado) {
    return (
      <div className="finalizado" style={{ fontSize: "1.3rem" }}>
        <h2>You have completed the exercise!</h2>
        <p>Correct answers: <strong>{correctas} / {ejercicios.length}</strong></p>
        <p>Redirecting to the start of the level...</p>
      </div>
    );
  }

  return (
    <div className="ejercicio-container">
      <header className="ejercicio-header">
        <h1 className="titulo-ejercicio">EXERCISE 1</h1>
        <p className="progreso-ejercicio">Question {index + 1} of {ejercicios.length}</p>
      </header>

      <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
        <div className="instruccion-box" style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}>
          <p>Choose the correct short answer to complete the question.</p>
        </div>

        <p style={{ fontSize: "1.5rem", margin: "1rem 0", fontWeight: 500 }}>{actual.pregunta}</p>

        {!respuesta && (
          <div className="opciones-ejercicio" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
            {actual.opciones.map((op, i) => (
              <button
                key={i}
                className={`opcion-btn ${opcionSeleccionada === op ? "seleccionada" : ""}`}
                onClick={() => setOpcionSeleccionada(op)}
                style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem", minWidth: "200px", borderRadius: "8px", border: "1px solid #ccc", cursor: "pointer" }}
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
            className={`respuesta-feedback ${respuesta.startsWith("Correct") ? "correcta" : "incorrecta"}`}
            style={{ fontSize: "1.2rem", margin: "1rem 0", color: respuesta.startsWith("Correct") ? "#2ecc71" : "#e74c3c", fontWeight: "bold" }}
          >
            {respuesta.split("\n")[0]}
          </p>
        )}

        {respuesta && (
          <div className="botones-siguiente" style={{ marginTop: "1rem" }}>
            <button onClick={siguiente} className="ejercicio-btn" style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}>
              {index === ejercicios.length - 1 ? "Finish" : "Next question"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
