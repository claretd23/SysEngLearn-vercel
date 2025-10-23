import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

export default function Tema1_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios = [
    { pregunta: "I ______ go to bed early on weekdays.", opciones: ["never", "always", "sometimes"], correcta: "always" },
    { pregunta: "She ______ eats breakfast before work.", opciones: ["usually", "rarely", "never"], correcta: "usually" },
    { pregunta: "They ______ go to the gym after work.", opciones: ["often", "always", "never"], correcta: "often" },
    { pregunta: "He ______ drinks coffee. He doesn’t like it.", opciones: ["sometimes", "rarely", "always"], correcta: "rarely" },
    { pregunta: "We ______ watch TV during the week. We prefer reading.", opciones: ["often", "always", "never"], correcta: "never" },
    { pregunta: "I ______ take a shower in the morning.", opciones: ["usually", "sometimes", "rarely"], correcta: "usually" },
    { pregunta: "My parents ______ go to the cinema on weekends.", opciones: ["often", "never", "always"], correcta: "often" },
    { pregunta: "She ______ eats fast food. She prefers cooking.", opciones: ["rarely", "usually", "always"], correcta: "rarely" },
    { pregunta: "We ______ have English class on Mondays.", opciones: ["always", "sometimes", "rarely"], correcta: "always" },
    { pregunta: "I ______ visit my grandparents.", opciones: ["often", "never", "always"], correcta: "often" },
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

    const oracionCompletada = actual.pregunta.replace("______", opcionSeleccionada);

    if (opcionSeleccionada === actual.correcta) {
      setRespuesta(`✅ Correct!\n\n${oracionCompletada}`);
      setCorrectas(prev => prev + 1);
    } else {
      const oracionCorrecta = actual.pregunta.replace("______", actual.correcta);
      setRespuesta(`❌ Incorrect.\n\n${oracionCorrecta}`);
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
            <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
              <p className="instruccion-ejercicio">
                Choose the correct frequency adverb to complete the sentence.
              </p>
            </div>

            <p
              className="pregunta-ejercicio"
              style={{ fontSize: "1.5rem", margin: "1rem 0", fontWeight: 500 }}
            >
              {respuesta ? respuesta.split("\n").slice(1).join("\n") : actual.pregunta}
            </p>

            {!respuesta && (
              <div
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
                    style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem", minWidth: "200px" }}
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
                style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", marginBottom: "1rem", borderRadius: "8px" }}
              >
                Check
              </button>
            )}

            {respuesta && (
              <p
                className={`respuesta-feedback ${respuesta.startsWith("✅") ? "correcta" : "incorrecta"}`}
                style={{ fontSize: "1.3rem", margin: "1rem 0" }}
              >
                {respuesta.split("\n")[0]}
              </p>
            )}

            <div
              style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}
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
