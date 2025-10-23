import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

interface EjercicioMuch {
  oracion: string;
  correcta: string;
}

export default function Tema1_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const navigate = useNavigate();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;

  const [index, setIndex] = useState(0);
  const [respuesta, setRespuesta] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [oracionMostrada, setOracionMostrada] = useState("");

  const ejercicios: EjercicioMuch[] = [
    { oracion: "_______ water do you drink every day?", correcta: "Yes" },
    { oracion: "_______ apples are there in the basket?", correcta: "No" },
    { oracion: "_______ money do you have in your wallet?", correcta: "Yes" },
    { oracion: "_______ chairs are in the room?", correcta: "No" },
    { oracion: "_______ time do we have before the movie starts?", correcta: "Yes" },
    { oracion: "_______ bottles of milk do you need?", correcta: "No" },
    { oracion: "_______ rice should I cook for dinner?", correcta: "Yes" },
    { oracion: "_______ books are on the table?", correcta: "No" },
    { oracion: "_______ coffee do you want?", correcta: "Yes" },
  ];

  const actual = ejercicios[index];

  useState(() => {
    setOracionMostrada(actual.oracion);
  });

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
    const esCorrecta = respuesta.trim().toLowerCase() === actual.correcta.toLowerCase();

    // ✅ Si es correcta, reemplaza el espacio por "How much"
    if (esCorrecta) {
      setOracionMostrada(actual.oracion.replace("_______", "How much"));
      setFeedback("✅ Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      // ❌ Si es incorrecta, deja la oración sin completar
      setOracionMostrada(actual.oracion);
      setFeedback("❌ Incorrect.");
    }
  };

  const siguiente = () => {
    setFeedback(null);
    setRespuesta("");
    if (index < ejercicios.length - 1) {
      const nuevoIndex = index + 1;
      setIndex(nuevoIndex);
      setOracionMostrada(ejercicios[nuevoIndex].oracion);
    } else {
      manejarFinalizacion();
    }
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
              Sentence {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section
            className="tarjeta-ejercicio"
            style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}
          >
            {/* Instrucción */}
            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1rem" }}>
                <p className="instruccion-ejercicio" style={{ fontSize: "1.1rem" }}>
                  Read each sentence and choose if you can use <b>HOW MUCH</b> or not. <br />
                  Write <b>Yes</b> if “how much” is correct, and <b>No</b> if it isn’t.
                </p>
              </div>
            )}

            {/* Oración */}
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
              }}
            >
              <p>{oracionMostrada}</p>
            </div>

            {/* Input */}
            {!feedback && (
              <input
                type="text"
                placeholder="Yes or No"
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                style={{
                  fontSize: "1.2rem",
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginBottom: "1rem",
                  textAlign: "center",
                  minWidth: "150px",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && respuesta.trim()) verificar();
                }}
              />
            )}

            {/* Botón Check */}
            {!feedback && (
              <div>
                <button
                  onClick={verificar}
                  className="ejercicio-btn"
                  disabled={!respuesta.trim()}
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
            {feedback && (
              <p
                style={{
                  fontSize: "1.3rem",
                  color: feedback.startsWith("✅") ? "green" : "red",
                  margin: "1rem 0",
                }}
              >
                {feedback}
              </p>
            )}

            {/* Botón siguiente */}
            {feedback && (
              <button
                onClick={siguiente}
                className="ejercicio-btn"
                style={{
                  fontSize: "1.3rem",
                  padding: "0.8rem 2rem",
                  borderRadius: "8px",
                }}
              >
                {index === ejercicios.length - 1 ? "Finish" : "Next"}
              </button>
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
