import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

export default function Tema1_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  // variable de entorno para la URL base del backend
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // Lista de ejercicios de possessive adjectives
  const ejercicios = [
    { texto: "I have a brother. ___ name is Tom.", correcta: ["His"] },
    { texto: "She has a cat. ___ fur is white.", correcta: ["Its"] },
    { texto: "We live in London. ___ house is very big.", correcta: ["Our"] },
    { texto: "He has a new bike. ___ bike is blue.", correcta: ["His"] },
    { texto: "You have a book. Is that ___?", correcta: ["Your"] },
    { texto: "They have two children. ___ names are Anna and John.", correcta: ["Their"] },
    { texto: "I have a car. ___ color is red.", correcta: ["My"] },
    { texto: "She has a sister. ___ name is Lucy.", correcta: ["Her"] },
    { texto: "We have a dog. ___ name is Max.", correcta: ["Our"] },
    { texto: "You have a phone. ___ battery is low.", correcta: ["Your"] },
  ];

  const actual = ejercicios[index];

  // Guardar progreso local y en la API (usa API_URL)
  const guardarProgreso = async () => {
    const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
    }

    if (!API_URL || !token) return; // si falta API_URL o token no intentamos llamar
    try {
      const res = await fetch(`${API_URL}/api/progreso`, {
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

  // Verificar respuesta del usuario
  const verificar = () => {
    const respuestaUsuario = inputValue.trim();
    if (!respuestaUsuario) return;

    const esCorrecta = actual.correcta.some(
      (c) => c.toLowerCase() === respuestaUsuario.toLowerCase()
    );

    if (esCorrecta) {
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("Incorrect.");
      setInputValue(actual.correcta[0]);
    }
  };

  // Pasar a la siguiente pregunta (guarda progreso antes de avanzar)
  const siguiente = async () => {
    setRespuesta(null);
    setInputValue("");
    await guardarProgreso();
    if (index + 1 < ejercicios.length) {
      setIndex(index + 1);
    } else {
      // si se terminó, usar la misma rutina que manejarFinalizacion
      await manejarFinalizacion();
    }
  };

  // Finalizar el ejercicio (guarda progreso y redirige)
  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => {
      navigate(`/inicio/${nivel}`);
      window.location.reload();
    }, 3000);
  };

  // Mostrar la oración con la respuesta correcta si ya se verificó
  const mostrarTexto = respuesta
    ? actual.texto.replace("___", actual.correcta[0])
    : actual.texto;

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

          <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
            {/* Instrucción solo en la primera pregunta */}
            {index === 0 && (
              <div className="instruccion-box">
                <p className="instruccion-ejercicio" style={{ fontSize: "1.3rem" }}>
                  Complete each sentence with the correct <b>possessive adjective</b>.
                </p>
              </div>
            )}

            {/* Texto de la oración */}
            <p
              className="pregunta-ejercicio"
              style={{ fontSize: "1.5rem", margin: "1rem 0", fontWeight: 500 }}
            >
              {mostrarTexto}
            </p>

            {/* Input y botón Check */}
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
                  placeholder="Type the possessive adjective..."
                  style={{
                    fontSize: "1.3rem",
                    padding: "0.8rem 1rem",
                    width: "250px",
                    borderRadius: "8px",
                    border: "2px solid #222a5c",
                    outline: "none",
                    textAlign: "center",
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

            {/* Feedback */}
            {respuesta && (
              <p
                className={`respuesta-feedback ${
                  respuesta.startsWith("Correct") ? "correcta" : "incorrecta"
                }`}
                style={{
                  fontSize: "1.3rem",
                  margin: "1rem 0",
                  color: respuesta.startsWith("Correct") ? "#32be2dff" : "#DC3545",
                }}
              >
                {respuesta}
              </p>
            )}

            {/* Botones siguiente / finalizar */}
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
