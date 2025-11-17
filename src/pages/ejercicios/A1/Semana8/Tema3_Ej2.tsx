import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

const API_URL = import.meta.env.VITE_API_URL;

interface EjercicioOpciones {
  pregunta: string;
  opciones: string[];
  correcta: string;
}

export default function Tema3_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const navigate = useNavigate();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;

  const [index, setIndex] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState<boolean | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios: EjercicioOpciones[] = [
    { pregunta: "___ any milk in the fridge?", opciones: ["Is there", "Are there", "There are", "There is"], correcta: "Is there" },
    { pregunta: "___ a park in your neighborhood?", opciones: ["Is there", "Are there", "There are", "Is they"], correcta: "Is there" },
    { pregunta: "___ five pencils on the desk?", opciones: ["Is there", "Are there", "There is", "Is they"], correcta: "Are there" },
    { pregunta: "___ a restaurant on this corner?", opciones: ["Are there", "Is there", "There is", "Are there any"], correcta: "Is there" },
    { pregunta: "___ many people in the library today?", opciones: ["There is", "Are there", "Is there", "There"], correcta: "Are there" },
    { pregunta: "___ a movie theater in your town?", opciones: ["Is there", "Are there", "There are", "Is they"], correcta: "Is there" },
    { pregunta: "___ any questions about the lesson?", opciones: ["Are there", "Is there", "There", "There are"], correcta: "Are there" },
    { pregunta: "___ a good hotel near the beach?", opciones: ["Are there", "Is there", "There is", "There are"], correcta: "Is there" },
    { pregunta: "___ a car outside your house?", opciones: ["Is they", "Is there", "Are there", "There are"], correcta: "Is there" },
    { pregunta: "___ two dogs in the yard?", opciones: ["Is there", "There is", "Are there", "Are they"], correcta: "Are there" },
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
    setRespuestaCorrecta(esCorrecta);

    if ( esCorrecta ) setCorrectas((prev) => prev + 1);
  };

  const siguiente = () => {
    setRespuestaCorrecta(null);
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

  // Texto mostrado sin emojis y sin repetir la oración
  const textoMostrado =
    respuestaCorrecta === null
      ? actual.pregunta
      : actual.pregunta.replace("___", respuestaCorrecta ? actual.correcta : actual.correcta);

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

          <section className="tarjeta-ejercicio" style={{ textAlign: "center", padding: "2rem" }}>
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
              <p>{textoMostrado}</p>
            </div>

            {/* Opciones */}
            {respuestaCorrecta === null && (
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

            {/* Botón Check */}
            {respuestaCorrecta === null && (
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

            {/* Feedback */}
            {respuestaCorrecta !== null && (
              <p
                className={`respuesta-feedback ${
                  respuestaCorrecta ? "correcta" : "incorrecta"
                }`}
                style={{ fontSize: "1.3rem", margin: "1rem 0" }}
              >
                {respuestaCorrecta ? "Correct" : "Incorrect"}
              </p>
            )}

            {/* Botones siguiente / finalizar */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
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
