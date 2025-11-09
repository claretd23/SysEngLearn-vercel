import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

export default function Tema1_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const ejercicios = [
    { pregunta: "What’s your name?", opciones: ["I’m 14 years old.", "My name is Anna.", "I’m from Spain."], correcta: "My name is Anna." },
    { pregunta: "How old are you?", opciones: ["I’m 13 years old.", "I’m fine, thank you.", "My favorite color is blue."], correcta: "I’m 13 years old." },
    { pregunta: "Where are you from?", opciones: ["I live in Mexico City.", "I’m from Brazil.", "I’m good, thanks."], correcta: "I’m from Brazil." },
    { pregunta: "Where do you live?", opciones: ["I live at 32 Park Street.", "I’m 15 years old.", "My name is Robert."], correcta: "I live at 32 Park Street." },
    { pregunta: "When’s your birthday?", opciones: ["My birthday is on July 20th.", "My favorite singer is Taylor Swift.", "I’m from Canada."], correcta: "My birthday is on July 20th." },
    { pregunta: "What’s your phone number?", opciones: ["It’s 4567-8923.", "I’m fine, thank you.", "I live in Madrid."], correcta: "It’s 4567-8923." },
    { pregunta: "What’s your address?", opciones: ["I live at 15 Green Avenue.", "I’m 16 years old.", "My favorite sport is basketball."], correcta: "I live at 15 Green Avenue." },
    { pregunta: "What’s your favorite hobby?", opciones: ["My favorite hobby is reading.", "I’m from Brazil.", "I live at 20 Main Street."], correcta: "My favourite hobby is reading." },
    { pregunta: "Who’s your favorite singer?", opciones: ["My favorite singer is Billie Eillish.", "I’m fine, thanks.", "I’m 12 years old."], correcta: "My favourite singer is Billie Eillish." },
    { pregunta: "Hello. How are you?", opciones: ["My birthday is in December.", "I’m fine, thank you.", "My name is Michael."], correcta: "I’m fine, thank you." },
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
    if (!opcionSeleccionada) return;

    // Mensaje correcto o incorrecto
    if (opcionSeleccionada === actual.correcta) {
      setMensaje(" Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setMensaje(" Incorrect");
    }
  };

  const siguiente = () => {
    setMensaje(null);
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
            <h1 className="titulo-ejercicio">EXERCISE 2</h1>
            <p className="progreso-ejercicio">
              Question {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section className="tarjeta-ejercicio" style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}>
            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
                <p className="instruccion-ejercicio">Choose the correct answer for each question.</p>
              </div>
            )}

            {/* Pregunta */}
            <div
              className="pregunta-box"
              style={{
                backgroundColor: "#f4f6fa",
                borderLeft: "5px solid #222a5c",
                borderRadius: "8px",
                padding: "1.5rem",
                margin: "1rem auto",
                maxWidth: "600px",
                textAlign: "left",
                fontStyle: "italic",
              }}
            >
              <p>{actual.pregunta}</p>
            </div>

            {/* Opciones */}
            {!mensaje && (
              <div
                className="opciones-ejercicio"
                style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}
              >
                {actual.opciones.map((op, i) => (
                  <button
                    key={i}
                    className={`opcion-btn ${opcionSeleccionada === op ? "seleccionada" : ""}`}
                    onClick={() => setOpcionSeleccionada(op)}
                    style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem", minWidth: "200px" }}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}

            {/* Botón Check */}
            {!mensaje && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                disabled={!opcionSeleccionada}
                style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", marginBottom: "1rem", borderRadius: "8px" }}
              >
                Check
              </button>
            )}

            {/* Feedback */}
            {mensaje && (
              <>
                <p
                  className={`respuesta-feedback ${mensaje.startsWith("✅") ? "correcta" : "incorrecta"}`}
                  style={{ fontSize: "1.3rem", margin: "1rem 0" }}
                >
                  {mensaje}
                </p>
                {/* Mostrar la respuesta correcta solo si fallaste */}
                {opcionSeleccionada !== actual.correcta && (
                  <p style={{ fontSize: "1.2rem", color: "#222a5c", fontWeight: "bold" }}>
                    Correct answer: {actual.correcta}
                  </p>
                )}
              </>
            )}

            {/* Botones siguiente / finalizar */}
            <div
              className="botones-siguiente"
              style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}
            >
              {mensaje && index < ejercicios.length - 1 && (
                <button
                  onClick={siguiente}
                  className="ejercicio-btn"
                  style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
                >
                  Next question
                </button>
              )}
              {mensaje && index === ejercicios.length - 1 && (
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
          <h2> You have completed the exercise!</h2>
          <p>
            Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
