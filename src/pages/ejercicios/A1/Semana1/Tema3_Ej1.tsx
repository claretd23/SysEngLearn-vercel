import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

export default function Tema3_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL; 
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios = [
    { texto: "Monday is the 1st day of the week.", correcta: "first" },
    { texto: "Sunday is the 7th day of the week.", correcta: "seventh" },
    { texto: "January is the 1st month of the year.", correcta: "first" },
    { texto: "December is the 12th month of the year.", correcta: "twelfth" },
    { texto: "My birthday is on the 3rd of March.", correcta: "third" },
    { texto: "Today is the 5th of April.", correcta: "fifth" },
    { texto: "February is the 2nd month of the year.", correcta: "second" },
    { texto: "August is the 8th month of the year.", correcta: "eighth" },
    { texto: "Tuesday is the 2nd day of the week.", correcta: "second" },
    { texto: "October is the 10th month of the year.", correcta: "tenth" },
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
      const res = await fetch(`${API_URL}/api/progreso`, { // ✅ URL actualizada
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
    const respuestaUsuario = inputValue.trim().toLowerCase();
    if (!respuestaUsuario) return;
    if (respuestaUsuario === actual.correcta.toLowerCase()) {
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect. The correct answer is "${actual.correcta}".`);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setInputValue("");
    setIndex(index + 1);
  };

  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => {
      navigate("/inicio/A1");
      window.location.reload();
    }, 3000);
  };

  return (
    <div className="ejercicio-container">
      {!finalizado ? (
        <>
          <header className="ejercicio-header">
            <h1 className="titulo-ejercicio">EXERCISE 1</h1>
            <p className="progreso-ejercicio">
              Question {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
            {index === 0 && (
              <div className="instruccion-box">
                <p className="instruccion-ejercicio" style={{ fontSize: "1.3rem" }}>
                  Write the ordinal number in words (first, second, third, etc.)
                  according to the number in the sentence.
                </p>
              </div>
            )}

            <p
              className="pregunta-ejercicio"
              style={{ fontSize: "1.5rem", margin: "1rem 0", fontWeight: 500 }}
            >
              {actual.texto}
            </p>

            {!respuesta && (
              <div
                className="opciones-ejercicio"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "stretch",
                  gap: "1rem",
                  margin: "1.5rem 0",
                }}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="input-respuesta"
                  placeholder="Write the word (e.g. first, second, third...)"
                  style={{
                    fontSize: "1.3rem",
                    padding: "0.8rem 1rem",
                    flex: 1,
                    borderRadius: "8px",
                    border: "1px solid #ccc",
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
                className="respuesta-feedback"
                style={{
                  fontSize: "1.3rem",
                  margin: "1rem 0",
                  color: respuesta.startsWith("Correct") ? "green" : "red", 
                  fontWeight: 600,
                }}
              >
                {respuesta}
              </p>
            )}

            <div className="botones-siguiente">
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
