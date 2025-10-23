import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

export default function Tema2_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios = [
    { oracion: "I have ___ orange in my bag.", correcta: "an" },
    { oracion: "She wants to buy ___ apple and ___ banana.", correcta: "an, a" },
    { oracion: "There is ___ cat on the roof.", correcta: "a" },
    { oracion: "He is ___ honest man.", correcta: "an" },
    { oracion: "I saw ___ elephant at the zoo.", correcta: "an" },
    { oracion: "We stayed at ___ hotel near the beach.", correcta: "a" },
    { oracion: "___ sun is very bright today.", correcta: "the" },
    { oracion: "I want to read ___ interesting book.", correcta: "an" },
    { oracion: "Look! ___ moon is so big tonight.", correcta: "the" },
    { oracion: "I need ___ umbrella because it’s raining.", correcta: "an" },
  ];

  const actual = ejercicios[index];

  const guardarProgreso = async () => {
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
      if (res.ok) {
        const completados = JSON.parse(
          localStorage.getItem("ejercicios_completados") || "[]"
        );
        if (!completados.includes(id)) {
          completados.push(id);
          localStorage.setItem(
            "ejercicios_completados",
            JSON.stringify(completados)
          );
        }
      }
    } catch (error) {
      console.error("Error al guardar el progreso:", error);
    }
  };

  const verificar = () => {
    if (!inputValue.trim()) return;

    // caso especial: varias respuestas (ej: "an, a")
    const respuestaUsuario = inputValue.trim().toLowerCase().replace(/\s+/g, "");
    const correcta = actual.correcta.toLowerCase().replace(/\s+/g, "");

    if (respuestaUsuario === correcta) {
      setRespuesta("✅ Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`❌ Incorrect. The correct answer is "${actual.correcta}".`);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setInputValue("");
    setIndex((prev) => prev + 1);
  };

  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => navigate(`/inicio/${nivel}`), 2500);
  };

  if (finalizado) {
    return (
      <div className="finalizado" style={{ fontSize: "1.3rem" }}>
        <h2>✅ You have completed the exercise!</h2>
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
        <h1 className="titulo-ejercicio">EXERCISE 1</h1>
        <p className="progreso-ejercicio">
          Question {index + 1} of {ejercicios.length}
        </p>
      </header>

      <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
        {index === 0 && (
          <div className="instruccion-box" style={{ fontSize: "1.3rem" }}>
            <p className="instruccion-ejercicio">
              Write the correct article (a, an, or the) in the blank space.
            </p>
          </div>
        )}

        <p
          style={{
            fontSize: "1.3rem",
            margin: "1rem 0",
            whiteSpace: "pre-line",
          }}
        >
          {actual.oracion}
        </p>

        {!respuesta && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              margin: "1.5rem 0",
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="input-respuesta"
              placeholder='Write "a", "an", or "the"...'
              style={{
                fontSize: "1.3rem",
                padding: "0.8rem 1rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "200px",
                textAlign: "center",
              }}
            />
            <button
              onClick={verificar}
              className="ejercicio-btn"
              style={{
                fontSize: "1.3rem",
                padding: "0.8rem 2rem",
                borderRadius: "8px",
              }}
            >
              Check
            </button>
          </div>
        )}

        {respuesta && (
          <p
            className={`respuesta-feedback ${
              respuesta.startsWith("✅") ? "correcta" : "incorrecta"
            }`}
            style={{ fontSize: "1.3rem", margin: "1rem 0" }}
          >
            {respuesta}
          </p>
        )}

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
