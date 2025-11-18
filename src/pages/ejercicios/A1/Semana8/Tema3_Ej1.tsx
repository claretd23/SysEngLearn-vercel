import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tema3_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuestaCorrecta, setRespuestaCorrecta] = useState<boolean | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  // Lista de ejercicios “Is there / Are there”
  const ejercicios = [
    { texto: "___ any students in the classroom?", correcta: "Are there" },
    { texto: "___ a bank near here?", correcta: "Is there" },
    { texto: "___ two apples on the table?", correcta: "Are there" },
    { texto: "___ a supermarket on this street?", correcta: "Is there" },
    { texto: "___ many chairs in the living room?", correcta: "Are there" },
    { texto: "___ a cat under the bed?", correcta: "Is there" },
    { texto: "___ any books on the shelf?", correcta: "Are there" },
    { texto: "___ a post office nearby?", correcta: "Is there" },
    { texto: "___ any mistakes in this text?", correcta: "Are there" },
    { texto: "___ a hospital close to your house?", correcta: "Is there" },
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

      if (!res.ok) console.error("Error saving progress:", res.statusText);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const verificar = () => {
    const resp = inputValue.trim().toLowerCase();
    if (!resp) return;

    const esCorrecta = resp === actual.correcta.toLowerCase();

    if (esCorrecta) {
      setRespuestaCorrecta(true);
      setCorrectas((p) => p + 1);
    } else {
      setRespuestaCorrecta(false);
    }

    // Autocompletar SIEMPRE con la correcta
    setInputValue(actual.correcta);
  };

  const siguiente = () => {
    setRespuestaCorrecta(null);
    setInputValue("");
    setIndex((i) => i + 1);
  };

  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => {
      navigate(`/inicio/${nivel}`);
      window.location.reload();
    }, 3000);
  };

  // Mostrar texto con respuesta correcta solo cuando ya se verificó
  const textoMostrado =
    respuestaCorrecta !== null
      ? actual.texto.replace("___", actual.correcta)
      : actual.texto;

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
                  Complete each sentence with <b>Is there</b> or <b>Are there</b>.
                </p>
              </div>
            )}

            <p
              className="pregunta-ejercicio"
              style={{ fontSize: "1.5rem", margin: "1rem 0", fontWeight: 500 }}
            >
              {textoMostrado}
            </p>

            {respuestaCorrecta === null && (
              <div
                className="opciones-ejercicio"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                  alignItems: "stretch",
                  margin: "1.5rem 0",
                }}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="input-respuesta"
                  placeholder="Write your answer..."
                  style={{
                    fontSize: "1.3rem",
                    padding: "0.8rem 1rem",
                    flex: 1,
                    borderRadius: "8px",
                    border: "1px solid #ccc",
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

            {respuestaCorrecta !== null && (
              <p
                className={`respuesta-feedback ${respuestaCorrecta ? "correcta" : "incorrecta"}`}
                style={{
                  fontSize: "1.3rem",
                  margin: "1rem 0",
                }}
              >
                {respuestaCorrecta ? "Correct" : "Incorrect"}
              </p>
            )}

            <div className="botones-siguiente" style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              {respuestaCorrecta !== null && index < ejercicios.length - 1 && (
                <button
                  onClick={siguiente}
                  className="ejercicio-btn"
                  style={{ fontSize: "1.3rem", padding: "0.8rem 2rem" }}
                >
                  Next question
                </button>
              )}

              {respuestaCorrecta !== null && index === ejercicios.length - 1 && (
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
          <h2 className="correcta">You have completed the exercise!</h2>
          <p>
            Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
