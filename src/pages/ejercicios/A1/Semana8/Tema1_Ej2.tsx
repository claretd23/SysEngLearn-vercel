import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../ejercicios.css";

interface EjercicioMuch {
  oracion: string;
  correcta: string;
}

const API_URL = import.meta.env.VITE_API_URL;

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
    { oracion: "_______ water do you drink every day?", correcta: "yes" },
    { oracion: "_______ apples are there in the basket?", correcta: "no" },
    { oracion: "_______ money do you have in your wallet?", correcta: "yes" },
    { oracion: "_______ chairs are in the room?", correcta: "no" },
    { oracion: "_______ time do we have before the movie starts?", correcta: "yes" },
    { oracion: "_______ bottles of milk do you need?", correcta: "no" },
    { oracion: "_______ rice should I cook for dinner?", correcta: "yes" },
    { oracion: "_______ books are on the table?", correcta: "no" },
    { oracion: "_______ coffee do you want?", correcta: "yes" },
  ];

  const actual = ejercicios[index];

  useEffect(() => {
    setOracionMostrada(actual.oracion);
  }, [index]);

  // === GUARDAR PROGRESO ===
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

  // === VERIFICAR ===
  const verificar = () => {
    const user = respuesta.trim().toLowerCase();
    const esCorrecta = user === actual.correcta;

    if (esCorrecta) {
      setOracionMostrada(actual.oracion.replace("_______", "How much"));
      setFeedback("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setOracionMostrada(actual.oracion);
      setFeedback("Incorrect");
    }
  };

  // === SIGUIENTE ===
  const siguiente = () => {
    setFeedback(null);
    setRespuesta("");

    if (index < ejercicios.length - 1) {
      setIndex(index + 1);
    } else {
      manejarFinalizacion();
    }
  };

  // === FINALIZAR ===
  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => {
      navigate(`/inicio/${nivel}`);
      window.location.reload();
    }, 3000);
  };

  // === RENDER ===
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
            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1rem" }}>
                <p className="instruccion-ejercicio">
                  Read each sentence and decide if you can use <b>HOW MUCH</b>.
                  <br />
                  Write <b>Yes</b> if it is correct, and <b>No</b> if it is not.
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

            {/* INPUT */}
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

            {/* BOTÓN CHECK */}
            {!feedback && (
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
            )}

            {/* FEEDBACK */}
            {feedback && (
              <p
                style={{
                  fontSize: "1.3rem",
                  color: feedback === "Correct" ? "green" : "red",
                  marginTop: "1rem",
                }}
              >
                {feedback}
              </p>
            )}

            {/* BOTÓN SIGUIENTE / FIN */}
            {feedback && (
              <button
                onClick={siguiente}
                className="ejercicio-btn"
                style={{
                  fontSize: "1.3rem",
                  padding: "0.8rem 2rem",
                  marginTop: "1rem",
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
