import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tema1_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios = [
    { pregunta: "A: ______ time do you get up in the morning?\nB: At 7:00 a.m.", correcta: "What" },
    { pregunta: "A: ______ is your favorite teacher?\nB: Mr. Smith.", correcta: "Who" },
    { pregunta: "A: ______ do you go to school?\nB: By bus.", correcta: "How" },
    { pregunta: "A: ______ are you sad?\nB: Because I lost my keys.", correcta: "Why" },
    { pregunta: "A: ______ is your best friend’s name?\nB: Laura.", correcta: "What" },
    { pregunta: "A: ______ apples do you want?\nB: Two, please.", correcta: "How many" },
    { pregunta: "A: ______ do you live?\nB: In London.", correcta: "Where" },
    { pregunta: "A: ______ is your brother?\nB: He’s 15 years old.", correcta: "How old" },
    { pregunta: "A: ______ do you study English?\nB: To travel abroad.", correcta: "Why" },
    { pregunta: "A: ______ money do you have?\nB: Just $10.", correcta: "How much" },
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
    const respuestaUsuario = inputValue.trim();
    if (!respuestaUsuario) return;

    if (respuestaUsuario.toLowerCase() === actual.correcta.toLowerCase()) {
      setRespuesta("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("Incorrect");
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
      navigate(`/inicio/${nivel}`);
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

          <section
            className="tarjeta-ejercicio"
            style={{
              textAlign: "center",
              fontSize: "1.3rem",
              padding: "2rem",
            }}
          >
            {/* Instrucción */}
            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
                <p className="instruccion-ejercicio">
                  Complete each question with the correct <b>Wh-word</b>:
                  <br />
                  (What, Where, When, Who, Why, How, How old, How many, How much)
                </p>
              </div>
            )}

            {/* Diálogo */}
            <div
              className="dialogo-box"
              style={{
                backgroundColor: "#f4f6fa",
                borderLeft: "5px solid #222a5c",
                borderRadius: "8px",
                padding: "1.5rem",
                margin: "1rem auto",
                maxWidth: "600px",
                textAlign: "left",
                whiteSpace: "pre-line",
              }}
            >
              <p>{actual.pregunta.replace("______", respuesta === "Correct" ? actual.correcta : "______")}</p>
            </div>

            {/* Input */}
            {!respuesta && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Write the Wh-word..."
                  className="input-respuesta"
                  style={{
                    fontSize: "1.2rem",
                    padding: "0.7rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    minWidth: "200px",
                    textAlign: "center",
                  }}
                />

                <button
                  onClick={verificar}
                  className="ejercicio-btn"
                  style={{
                    fontSize: "1.2rem",
                    padding: "0.7rem 2rem",
                    borderRadius: "8px",
                  }}
                >
                  Check
                </button>
              </div>
            )}

            {/* Feedback sin emojis */}
            {respuesta && (
              <p
                style={{
                  fontSize: "1.3rem",
                  margin: "1rem 0",
                  color: respuesta === "Correct" ? "#36aabc" : "#ff5c5c",
                  fontWeight: "bold",
                }}
              >
                {respuesta}
              </p>
            )}

            {/* Botones */}
            <div
              className="botones-siguiente"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {respuesta && index < ejercicios.length - 1 && (
                <button
                  onClick={siguiente}
                  className="ejercicio-btn"
                  style={{
                    fontSize: "1.2rem",
                    padding: "0.8rem 2rem",
                    borderRadius: "8px",
                  }}
                >
                  Next question
                </button>
              )}

              {respuesta && index === ejercicios.length - 1 && (
                <button
                  onClick={manejarFinalizacion}
                  className="ejercicio-btn"
                  style={{
                    fontSize: "1.2rem",
                    padding: "0.8rem 2rem",
                    borderRadius: "8px",
                  }}
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
