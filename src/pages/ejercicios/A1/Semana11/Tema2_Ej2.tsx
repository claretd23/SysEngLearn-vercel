import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

export default function Tema2_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const ejercicios = [
    { pregunta: "Your mother’s mother is your", opciones: ["aunt", "grandmother", "cousin"], correcta: "grandmother" },
    { pregunta: "Your father’s son is your", opciones: ["cousin", "brother", "uncle"], correcta: "brother" },
    { pregunta: "Your aunt’s daughter is your", opciones: ["niece", "cousin", "sister"], correcta: "cousin" },
    { pregunta: "Your mother’s husband is your", opciones: ["uncle", "father", "brother"], correcta: "father" },
    { pregunta: "Your brother’s daughter is your", opciones: ["niece", "cousin", "sister"], correcta: "niece" },
    { pregunta: "Your father’s brother is your", opciones: ["uncle", "cousin", "grandfather"], correcta: "uncle" },
    { pregunta: "Your parents’ parents are your", opciones: ["uncles", "cousins", "grandparents"], correcta: "grandparents" },
    { pregunta: "Your son’s wife is your", opciones: ["daughter-in-law", "niece", "cousin"], correcta: "daughter-in-law" },
    { pregunta: "Your daughter’s husband is your", opciones: ["cousin", "son-in-law", "nephew"], correcta: "son-in-law" },
    { pregunta: "Your brother’s wife is your", opciones: ["sister-in-law", "aunt", "niece"], correcta: "sister-in-law" },
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

    const esCorrecta = opcionSeleccionada === actual.correcta;

    if (esCorrecta) {
      setRespuesta("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("Incorrect");
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

  const textoMostrado =
    respuesta === null
      ? actual.pregunta
      : `${actual.pregunta} ${actual.correcta}`;

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

          <section
            className="tarjeta-ejercicio"
            style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}
          >
            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
                <p className="instruccion-ejercicio">Choose the correct answer.</p>
              </div>
            )}

            <p
              style={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                marginBottom: "1.5rem",
                color: "black",
              }}
            >
              {textoMostrado}
            </p>

            {!respuesta && (
              <div
                className="opciones-ejercicio"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                {actual.opciones.map((op, i) => (
                  <button
                    key={i}
                    className={`opcion-btn ${
                      opcionSeleccionada === op ? "seleccionada" : ""
                    }`}
                    onClick={() => setOpcionSeleccionada(op)}
                    style={{
                      fontSize: "1.2rem",
                      padding: "0.8rem 1.5rem",
                      minWidth: "200px",
                    }}
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
                style={{
                  fontSize: "1.3rem",
                  padding: "0.8rem 2rem",
                  marginBottom: "1rem",
                  borderRadius: "8px",
                }}
              >
                Check
              </button>
            )}

            {respuesta && (
              <p
                style={{
                  fontSize: "1.3rem",
                  margin: "1rem 0",
                  color: respuesta === "Correct" ? "#19ba1bff" : "#ff5c5c",
                  fontWeight: "bold",
                }}
              >
                {respuesta}
              </p>
            )}

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
