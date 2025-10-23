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

  const ejercicios = [
    { pregunta: "Are you a student? (positive)", correcta: ["yes, i am"] },
    { pregunta: "Do you have a pet? (positive)", correcta: ["yes, i do"] },
    { pregunta: "Is he from Brazil? (negative)", correcta: ["no, he isn’t", "no, he is not"] },
    { pregunta: "Does she like coffee? (positive)", correcta: ["yes, she does"] },
    { pregunta: "Are they at home? (negative)", correcta: ["no, they aren’t", "no, they are not"] },
    { pregunta: "Can you speak French? (negative)", correcta: ["no, i can’t", "no, i cannot"] },
    { pregunta: "Do you play the guitar? (negative)", correcta: ["no, i don’t", "no, i do not"] },
    { pregunta: "Is your brother a doctor? (positive)", correcta: ["yes, he is"] },
    { pregunta: "Can she drive? (negative)", correcta: ["no, she can’t", "no, she cannot"] },
    { pregunta: "Does your father cook dinner? (positive)", correcta: ["yes, he does"] },
    { pregunta: "Are we late for class? (negative)", correcta: ["no, we aren’t", "no, we are not"] },
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
    const respuestaUsuario = inputValue.trim().toLowerCase();
    if (!respuestaUsuario) return;

    const esCorrecta = actual.correcta.some(c => c.toLowerCase() === respuestaUsuario);

    if (esCorrecta) {
      setRespuesta("✅ Correct!");
      setCorrectas(prev => prev + 1);
    } else {
      setRespuesta(`❌ Incorrect. Correct answer: ${actual.correcta[0]}`);
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

  return (
    <div className="ejercicio-container">
      {!finalizado ? (
        <>
          <header className="ejercicio-header">
            <h1 className="titulo-ejercicio">EXERCISE 2 </h1>
            <p className="progreso-ejercicio">Question {index + 1} of {ejercicios.length}</p>
          </header>

          <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
            <div className="instruccion-box">
              <p className="instruccion-ejercicio">
                Write the correct short answer. Pay attention if it should be positive or negative.
              </p>
            </div>

            <p className="pregunta-ejercicio" style={{ fontSize: "1.5rem", margin: "1rem 0", fontWeight: 500 }}>
              {actual.pregunta}
            </p>

            {!respuesta && (
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", margin: "1rem 0" }}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  className="input-respuesta"
                  placeholder="Write your answer..."
                  style={{ fontSize: "1.3rem", padding: "0.8rem 1rem", borderRadius: "8px", border: "1px solid #ccc", flex: 1 }}
                />
                <button onClick={verificar} className="ejercicio-btn" style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}>
                  Check
                </button>
              </div>
            )}

            {respuesta && (
              <p className={`respuesta-feedback ${respuesta.startsWith("✅") ? "correcta" : "incorrecta"}`} style={{ fontSize: "1.3rem", margin: "1rem 0" }}>
                {respuesta}
              </p>
            )}

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
              {respuesta && index < ejercicios.length - 1 && (
                <button onClick={siguiente} className="ejercicio-btn" style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}>
                  Next question
                </button>
              )}
              {respuesta && index === ejercicios.length - 1 && (
                <button onClick={manejarFinalizacion} className="ejercicio-btn" style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}>
                  Finish
                </button>
              )}
            </div>
          </section>
        </>
      ) : (
        <div className="finalizado" style={{ fontSize: "1.3rem" }}>
          <h2>✅ You have completed the exercise!</h2>
          <p>Correct answers: <strong>{correctas} / {ejercicios.length}</strong></p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
