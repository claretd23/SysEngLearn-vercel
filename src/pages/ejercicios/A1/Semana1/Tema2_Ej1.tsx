import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

export default function Tema1_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios = [
    { texto: "My grandmother is ___ years old. (65)", correcta: "sixty-five" },
    { texto: "We have English class in our room ___. (23)", correcta: "twenty-three" },
    { texto: "There are ___ students in my class. (18)", correcta: "eighteen" },
    { texto: "The shop opens at ___ o’clock. (9)", correcta: "nine" },
    { texto: "My house has ___ windows. (12)", correcta: "twelve" },
    { texto: "The ticket costs ___ euros. (50)", correcta: "fifty" },
    { texto: "She has ___ pens in her bag. (14)", correcta: "fourteen" },
    { texto: "There are ___ chairs in the living room. (7)", correcta: "seven" },
    { texto: "I go to bed at ___ o’clock. (10)", correcta: "ten" },
    { texto: "My little sister is ___ years old. (4)", correcta: "four" },
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
    const respuestaUsuario = inputValue.trim().toLowerCase();
    if (!respuestaUsuario) return;

    if (respuestaUsuario === actual.correcta.toLowerCase()) {
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect.`);
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

  const mostrarTexto = respuesta
    ? actual.texto.replace("___", actual.correcta)
    : actual.texto;

  return (
    <div className="ejercicio-container">
      {!finalizado ? (
        <>
          <header className="ejercicio-header">
            <h1 className="titulo-ejercicio">EXERCISE 3</h1>
            <p className="progreso-ejercicio">
              Question {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section
            className="tarjeta-ejercicio"
            style={{
              textAlign: "center",
              padding: "3rem 4rem",
              fontSize: "1.3rem",
            }}
          >
            {index === 0 && (
              <div
                className="instruccion-box"
                style={{ marginBottom: "1.5rem" }}
              >
                <p
                  className="instruccion-ejercicio"
                  style={{ fontSize: "1.2rem" }}
                >
                  Complete the sentences by writing the number in words.
                </p>
              </div>
            )}

            <p
              className="pregunta-ejercicio"
              style={{
                marginBottom: "1.5rem",
                fontSize: "1.4rem",
              }}
            >
              {mostrarTexto}
            </p>

            {!respuesta && (
              <div
                className="opciones-ejercicio"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1.2rem",
                  margin: "1.5rem 0",
                }}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="input-respuesta"
                  placeholder="Write the number in words..."
                  style={{ fontSize: "1.2rem", padding: "0.6rem 1rem" }}
                />
                <button
                  onClick={verificar}
                  className="ejercicio-btn"
                  style={{ fontSize: "1.2rem", padding: "0.7rem 1.5rem" }}
                >
                  Check
                </button>
              </div>
            )}

            {respuesta && (
              <p
                className={`respuesta-feedback ${
                  respuesta.startsWith("Correct") ? "correcta" : "incorrecta"
                }`}
                style={{
                  fontSize: "1.2rem",
                  marginTop: "1rem",
                  color: respuesta.startsWith("Correct") ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {respuesta}
              </p>
            )}

            <div
              className="botones-siguiente"
              style={{ marginTop: "1.5rem" }}
            >
              {respuesta && index < ejercicios.length - 1 && (
                <button
                  onClick={siguiente}
                  className="ejercicio-btn"
                  style={{ fontSize: "1.2rem", padding: "0.7rem 1.5rem" }}
                >
                  Next question
                </button>
              )}
              {respuesta && index === ejercicios.length - 1 && (
                <button
                  onClick={manejarFinalizacion}
                  className="ejercicio-btn"
                  style={{ fontSize: "1.2rem", padding: "0.7rem 1.5rem" }}
                >
                  Finish
                </button>
              )}
            </div>
          </section>
        </>
      ) : (
        <div className="finalizado">
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
