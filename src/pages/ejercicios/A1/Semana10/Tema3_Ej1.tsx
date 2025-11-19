import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

interface EjercicioOpciones {
  pregunta: string;
  opciones: string[];
  correcta: string;
}

export default function Tema3_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const navigate = useNavigate();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;

  const [index, setIndex] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState<"Correct" | "Incorrect" | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const ejercicios: EjercicioOpciones[] = [
    { pregunta: "I can swim very fast.", opciones: ["Ability", "Possibility", "Permission"], correcta: "Ability" },
    { pregunta: "We can go to the park if it doesn’t rain.", opciones: ["Ability", "Possibility", "Permission"], correcta: "Possibility" },
    { pregunta: "You can use my computer.", opciones: ["Ability", "Possibility", "Permission"], correcta: "Permission" },
    { pregunta: "She can speak three languages.", opciones: ["Ability", "Possibility", "Permission"], correcta: "Ability" },
    { pregunta: "They can come to the party tomorrow.", opciones: ["Ability", "Possibility", "Permission"], correcta: "Possibility" },
    { pregunta: "Students can borrow books from the library.", opciones: ["Ability", "Possibility", "Permission"], correcta: "Permission" },
    { pregunta: "He can play the guitar very well.", opciones: ["Ability", "Possibility", "Permission"], correcta: "Ability" },
    { pregunta: "We can see the stars tonight because the sky is clear.", opciones: ["Ability", "Possibility", "Permission"], correcta: "Possibility" },
    { pregunta: "You can sit here if you want.", opciones: ["Ability", "Possibility", "Permission"], correcta: "Permission" },
    { pregunta: "I can run 10 kilometers without stopping.", opciones: ["Ability", "Possibility", "Permission"], correcta: "Ability" },
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

    if (opcionSeleccionada === actual.correcta) {
      setRespuesta("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("Incorrect");
      setOpcionSeleccionada(actual.correcta);
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
            style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}
          >
            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
                <p className="instruccion-ejercicio" style={{ fontSize: "1.3rem" }}>
                  Read each sentence and choose the correct type: <b>Ability</b>, <b>Possibility</b>, or <b>Permission</b>.
                </p>
              </div>
            )}

            {/* ORACIÓN MOSTRADA */}
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
                whiteSpace: "pre-line",
              }}
            >
              <p>
                {respuesta === null
                  ? actual.pregunta
                  : respuesta === "Correct"
                  ? actual.pregunta
                  : `${actual.pregunta} → ${actual.correcta}`}
              </p>
            </div>

            {/* OPCIONES */}
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
                    className={`opcion-btn ${opcionSeleccionada === op ? "seleccionada" : ""}`}
                    onClick={() => setOpcionSeleccionada(op)}
                    style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem", minWidth: "180px" }}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}

            {/* BOTÓN CHECK */}
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

            {/* FEEDBACK */}
            {respuesta && (
              <p
                style={{
                  fontSize: "1.3rem",
                  margin: "1rem 0",
                  color: respuesta === "Correct" ? "#19ba1bff" : "#ff5c5c",
                  fontWeight: "bold",
                }}
              >
                {respuesta === "Correct" ? "Correct!" : "Incorrect."}
              </p>
            )}

            {/* BOTONES NEXT / FINISH */}
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
                  style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
                >
                  Next question
                </button>
              )}
              {respuesta && index === ejercicios.length - 1 && (
                <button
                  onClick={manejarFinalizacion}
                  className="ejercicio-btn"
                  style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
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
