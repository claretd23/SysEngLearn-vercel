import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
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

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ------------------ AUDIO ------------------
  const playAudio = () => audioRef.current?.play();

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Detener audio al cambiar de ejercicio
  useEffect(() => {
    stopAudio();
  }, [index]);

  // Detener audio al salir del componente
  useEffect(() => {
    return () => stopAudio();
  }, []);

  // ------------------ EJERCICIOS ------------------
  const ejercicios = [
    { texto: "Where is Sofia from?", correcta: [ "she is from mexico", "from mexico","mexico",] },
    {
      texto: "Peter is from Canada. Is he American?",
      correcta: [
        "no, he is not american",
        "no",
        "no, he isn't",
        "no, he is not",
        "no, he isn't american",
        "no, he is canadian",
      ],
    },
    { texto: "Where is Fatima from?", correcta: [ "she is from turkey", "turkey","from turkey"] },
    { texto: "Is Ali Mexican?", correcta: ["no, she isn't","no, she isn't Mexican","no", "no, she is not Mexican","no, she is not"] },
    { texto: "Is Laura Turkish?", correcta: ["no, she isn't turkish", "no, she isn't", "no, she is not"] },
    { texto: "Where is Yara from?", correcta: ["colombia", "she is from colombia", "from colombia"] },
    { texto: "Is Marco Mexican?", correcta:  ["no, he is not mexican","no, he isn't mexican", "no, he isn't"] },
    { texto: "Where is Marco from?", correcta: [ "he is from spain","spain", "from spain"] },
    { texto: "Where is Yara from?", correcta: [ "she is from colombia","colombia", "from colombia"] },
    { texto: "Is Yara Spanish?", correcta: [ "no, she isn't Spanish", "no, she is not", "no", "no, she is not Spanish", "no, she isn't"] },
  ];

  const actual = ejercicios[index];

  // ------------------ GUARDAR PROGRESO ------------------
  const guardarProgreso = async () => {
    const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");

    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
    }

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
    } catch (error) {
      console.error("Error al guardar progreso:", error);
    }
  };
const verificar = () => {
  const user = inputValue.trim().toLowerCase();
  if (!user) return;

  const esCorrecta = actual.correcta.some(
    (c) => user === c.toLowerCase()
  );

  if (esCorrecta) {
    setRespuesta("Correct");
    setCorrectas((prev) => prev + 1);
  } else {
    setRespuesta(`Incorrect \n\n Correct answer: ${actual.correcta[0]}`);
  }
};


  // ------------------ SIGUIENTE ------------------
  const siguiente = () => {
    stopAudio();
    setRespuesta(null);
    setInputValue("");
    setIndex((prev) => prev + 1);
  };

  // ------------------ FINALIZAR ------------------
  const manejarFinalizacion = async () => {
    stopAudio();
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
            <h1 className="titulo-ejercicio">EXERCISE 3</h1>
            <p className="progreso-ejercicio">
              Question {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
            {index === 0 && (
              <div className="instruccion-box">
                <p className="instruccion-ejercicio" style={{ fontSize: "1.2rem" }}>
                  Listen to the audio and answer the questions.
                </p>
              </div>
            )}

            {/* AUDIO SOLO EN EL PRIMER EJERCICIO */}
            {index === 0 && (
              <div style={{ margin: "1rem 0" }}>
                <button
                  onClick={playAudio}
                  className="btn-audio"
                  style={{ fontSize: "1.8rem", padding: "0.6rem 1rem", borderRadius: "8px" }}
                >
                  🔊
                </button>
                <audio ref={audioRef} src="/audios/sem3/anna_friends.mp3" />
              </div>
            )}

            {/* PREGUNTA */}
            <p
              className="pregunta-ejercicio"
              style={{ fontSize: "1.5rem", margin: "1rem 0", fontWeight: 500 }}
            >
              {actual.texto}
            </p>

            {/* INPUT */}
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
                  placeholder="Write your answer"
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
                  style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
                >
                  Check
                </button>
              </div>
            )}

            {/* FEEDBACK */}
            {respuesta && (
              <p
  className="respuesta-feedback"
  style={{
    fontSize: "1.2rem",
    margin: "1rem 0",
    fontWeight: "bold",
    color: respuesta.startsWith("Correct") ? "#28A745" : "#DC3545",
  }}
>
  {respuesta}
</p>

            )}

            {/* BOTONES SIGUIENTE / FINALIZAR */}
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
