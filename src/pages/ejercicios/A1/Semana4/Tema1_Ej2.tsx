import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

export default function Tema1_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL; // Variable de entorno para backend
  const token = localStorage.getItem("token");

  const ejercicios = [
    { texto: "She ______ English at school every day.", correcta: ["studies"] },
    { texto: "They ______ football in the park on Saturdays.", correcta: ["play"] },
    { texto: "My mom ______ dinner in the kitchen every night.", correcta: ["cooks"] },
    { texto: "He ______ the guitar in his room in the evening.", correcta: ["plays"] },
    { texto: "We ______ homework at the library after class.", correcta: ["do"] },
    { texto: "I ______ coffee at the café every morning.", correcta: ["drink"] },
    { texto: "The teacher ______ the lesson in the classroom at 9 o’clock.", correcta: ["teaches"] },
    { texto: "My dad ______ the newspaper in the living room every night.", correcta: ["reads"] },
    { texto: "We ______ music at school on Mondays.", correcta: ["listen to"] },
    { texto: "She ______ TV at home in the evening.", correcta: ["watches"] },
  ];

  const actual = ejercicios[index];

  const guardarProgreso = async () => {
    // Guardar localmente
    const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
    }

    // Guardar en backend
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/progreso`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nivel, semana, tema, ejercicio }),
      });
      if (!res.ok) console.error("Error al guardar progreso:", res.statusText);
    } catch (err) {
      console.error("Error al guardar progreso:", err);
    }
  };

  const verificar = () => {
    const respuestaUsuario = inputValue.trim().toLowerCase();
    if (!respuestaUsuario) return;

    const esCorrecta = actual.correcta.some(
      (c) => c.toLowerCase() === respuestaUsuario
    );

    if (esCorrecta) {
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("Incorrect.");
      setInputValue(actual.correcta[0]); // mostrar la respuesta correcta
    }
  };

  const siguiente = async () => {
    setRespuesta(null);
    setInputValue("");
    await guardarProgreso(); // guardar después de cada ejercicio
    if (index + 1 < ejercicios.length) {
      setIndex(index + 1);
    } else {
      setFinalizado(true);
      setTimeout(() => {
        navigate(`/inicio/${nivel}`);
        window.location.reload();
      }, 3000);
    }
  };

  const mostrarTexto = respuesta
    ? actual.texto.replace("______", actual.correcta[0])
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
                  Complete the sentences with the correct <b>verb</b> to keep the word order:
                  <br />
                  <b>(Subject + Verb + Object + Place + Time)</b>
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
  className="open-answer-wrapper"
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
                  placeholder="Type the verb..."
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
                  respuesta === "Correct!" ? "correcta" : "incorrecta"
                }`}
                style={{
                  fontSize: "1.3rem",
                  margin: "1rem 0",
                  color: respuesta === "Correct!" ? "#0D6EFD" : "#DC3545",
                }}
              >
                {respuesta}
              </p>
            )}

            {respuesta && (
              <button
                onClick={siguiente}
                className="ejercicio-btn"
                style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", marginTop: "1rem" }}
              >
                {index === ejercicios.length - 1 ? "Finish" : "Next question"}
              </button>
            )}
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
