import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "../ejercicios.css";

export default function Tema3_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  // Referencia al audio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Función para reproducir el audio
  const playAudio = () => {
    audioRef.current?.play();
  };

  // Ejercicios (nacionalidades)
  const ejercicios = [
    { texto: "Sofia is from Mexico. She is ______.", correcta: ["Mexican"] },
    { texto: "Peter is from Canada. He is ______.", correcta: ["Canadian"] },
    { texto: "Fatima is from Turkey. She is ______.", correcta: ["Turkish"] },
    { texto: "Ali is from India. He is ______.", correcta: ["Indian"] },
    { texto: "Laura is from Italy. She is ______.", correcta: ["Italian"] },
    { texto: "Yara is from Colombia. She is ______.", correcta: ["Colombian"] },
  ];

  const actual = ejercicios[index];

  // Guardar progreso
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

  // Verificar respuesta
  const verificar = () => {
    const respuestaUsuario = inputValue.trim().toLowerCase();
    if (!respuestaUsuario) return;

    const esCorrecta = actual.correcta.some(
      (c) => c.toLowerCase() === respuestaUsuario
    );

    if (esCorrecta) {
      setRespuesta(" Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect".`);
      setInputValue(actual.correcta[0]);
    }
  };

  // Siguiente pregunta
  const siguiente = () => {
    setRespuesta(null);
    setInputValue("");
    setIndex(index + 1);
  };

  // Finalización
  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => {
      navigate(`/inicio/${nivel}`);
      window.location.reload();
    }, 3000);
  };

  // Mostrar texto con o sin respuesta
  const mostrarTexto = respuesta
    ? actual.texto.replace("______", actual.correcta[0])
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

          <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
            {index === 0 && (
              <div className="instruccion-box">
                <p className="instruccion-ejercicio" style={{ fontSize: "1.2rem" }}>
                  🎧 Listen to the audio and complete the sentences with the correct nationality.
                </p>
              </div>
            )}

            {/* === BOTÓN Y AUDIO === */}
            <div style={{ margin: "1rem 0" }}>
              <button
                onClick={playAudio}
                className="btn-audio"
                style={{
                  fontSize: "1.8rem",
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                }}
              >
                🔊
              </button>
              <audio ref={audioRef} src="/audios/sem3/anna_friends.mp3" />
            </div>

            {/* === TEXTO === */}
            <p
              className="pregunta-ejercicio"
              style={{
                fontSize: "1.5rem",
                margin: "1rem 0",
                fontWeight: 500,
              }}
            >
              {mostrarTexto}
            </p>

            {/* === INPUT Y BOTÓN === */}
            {!respuesta && (
              <div
                className="opciones-ejercicio"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                  margin: "1.5rem 0",
                }}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="input-respuesta"
                  placeholder="Type the nationality"
                  style={{
                    fontSize: "1.3rem",
                    padding: "0.8rem 1rem",
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

            {/* === RETROALIMENTACIÓN === */}
            {respuesta && (
              <p
                className={`respuesta-feedback ${
                  respuesta.startsWith("✅") ? "correcta" : "incorrecta"
                }`}
                style={{ fontSize: "1.2rem", margin: "1rem 0" }}
              >
                {respuesta}
              </p>
            )}

            {/* === BOTONES DE NAVEGACIÓN === */}
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
          <h2> You have completed the exercise!</h2>
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
