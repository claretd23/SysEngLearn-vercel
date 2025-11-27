import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

export default function Tema2_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const navigate = useNavigate();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const API_URL = import.meta.env.VITE_API_URL;

  // === ESTADOS ===
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [mostrarOracionCompleta, setMostrarOracionCompleta] = useState(false);

  // === LISTA DE EJERCICIOS ===
  const ejercicios = [
    { oracion: "I have ___ orange in my bag.", correcta: "an" },
    { oracion: "She wants to buy ___ apple and banana.", correcta: "an" },
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

  // === VERIFICAR RESPUESTA ===
  const verificar = () => {
    if (!inputValue.trim()) return;

    const respuestaUsuario = inputValue.trim().toLowerCase().replace(/\s+/g, "");
    const correcta = actual.correcta.toLowerCase().replace(/\s+/g, "");

    setMostrarOracionCompleta(true);

    if (respuestaUsuario === correcta) {
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("Incorrect.");
    }
  };

  // === SIGUIENTE ===
  const siguiente = () => {
    setRespuesta(null);
    setInputValue("");
    setIndex((prev) => prev + 1);
    setMostrarOracionCompleta(false);
  };

  // === FINALIZAR ===
  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => navigate(`/inicio/${nivel}`), 2500);
  };

  // === MENSAJE FINAL ===
  if (finalizado) {
    return (
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
    );
  }

  // === MOSTRAR ORACIÓN CON RESPUESTA ===
  const oracionMostrada = mostrarOracionCompleta
    ? actual.oracion.replace(/___/g, actual.correcta)
    : actual.oracion;

  // === INTERFAZ ===
  return (
    <div className="ejercicio-container">
      {/* Header */}
      <header className="ejercicio-header">
        <h1 className="titulo-ejercicio">EXERCISE 1</h1>
        <p className="progreso-ejercicio">
          Question {index + 1} of {ejercicios.length}
        </p>
      </header>

      {/* Tarjeta */}
      <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
        {/* Instrucción inicial */}
        {index === 0 && (
          <div className="instruccion-box" style={{ fontSize: "1.3rem" }}>
            <p className="instruccion-ejercicio">
              Write the correct article (<strong>a</strong>,{" "}
              <strong>an</strong>, or <strong>the</strong>) in the blank space.
            </p>
          </div>
        )}

        {/* Oración */}
        <p
          style={{
            fontSize: "1.3rem",
            margin: "1rem 0",
            whiteSpace: "pre-line",
          }}
        >
          {oracionMostrada}
        </p>

        {/* Input y botón */}
        {!respuesta && (
          <div
          className="open-answer-wrapper"
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

        {/* Feedback */}
        {respuesta && (
          <p
            className={`respuesta-feedback ${
              respuesta === "Correct!" ? "correcta" : "incorrecta"
            }`}
            style={{ fontSize: "1.3rem", margin: "1rem 0" }}
          >
            {respuesta}
          </p>
        )}

        {/* Botones de navegación */}
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
