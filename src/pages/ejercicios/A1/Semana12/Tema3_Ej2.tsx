import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

export default function Tema3_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  // ✅ Lista de ejercicios con will / won’t / Will (interrogativa)
  const ejercicios = [
    { texto: "I ________ (help) my sister with her homework tomorrow. [afirmativo]", correcta: ["will help"] },
    { texto: "She ________ (go) to the party if it rains. [negativo]", correcta: ["will not go", "won’t go"] },
    { texto: "________ you ________ (call) me when you arrive at the station? [interrogativa]", correcta: ["Will you call", "Will / call"] },
    { texto: "They ________ (finish) the work on time if nobody helps. [negativo]", correcta: ["will not finish", "won’t finish"] },
    { texto: "He ________ (forget) to bring his notebook. [afirmativo]", correcta: ["will forget"] },
    { texto: "I ________ (eat) the cake because I’m on a diet. [negativo]", correcta: ["will not eat", "won’t eat"] },
    { texto: "We ________ (meet) our friends at the café at 6 p.m. [afirmativo]", correcta: ["will meet"] },
    { texto: "________ she ________ (join) the English class next week? [interrogativa]", correcta: ["Will she join", "Will / join"] },
    { texto: "They ________ (buy) a new car if they don’t save enough money. [negativo]", correcta: ["will not buy", "won’t buy"] },
    { texto: "You ________ (enjoy) the film if you like comedies. [afirmativo]", correcta: ["will enjoy"] },
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

      if (!res.ok) {
        console.error("Error al guardar progreso:", res.statusText);
      }
    } catch (error) {
      console.error("Error al guardar el progreso:", error);
    }
  };

  const verificar = () => {
    const respuestaUsuario = inputValue.trim().toLowerCase();
    if (!respuestaUsuario) return;

    const esCorrecta = actual.correcta.some(
      (c) => c.toLowerCase() === respuestaUsuario
    );

    if (esCorrecta) {
      setRespuesta("✅ Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("❌ Incorrect");
      setInputValue(actual.correcta[0]);
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

  // ✅ Mostrar texto reemplazando la respuesta y eliminando guiones, paréntesis y corchetes
  const mostrarTexto = respuesta
    ? actual.texto
        .replace(/_+/g, actual.correcta[0])       // reemplaza todos los guiones consecutivos por la respuesta
        .replace(/\s*\(.*?\)/, "")                // elimina paréntesis
        .replace(/\s*\[.*?\]/, "")                // elimina corchetes
    : actual.texto;

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

          <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
            {index === 0 && (
              <div className="instruccion-box">
                <p className="instruccion-ejercicio" style={{ fontSize: "1.3rem" }}>
                  Complete the sentences using <b>will / won’t</b> as indicated.
                </p>
              </div>
            )}

            <p
              className="pregunta-ejercicio"
              style={{ fontSize: "1.5rem", margin: "1rem 0", fontWeight: 500 }}
            >
              {mostrarTexto}
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
                  placeholder="Type the correct form..."
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

            {respuesta && (
              <p
                className={`respuesta-feedback ${
                  respuesta.startsWith("✅") ? "correcta" : "incorrecta"
                }`}
                style={{ fontSize: "1.3rem", margin: "1rem 0" }}
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
