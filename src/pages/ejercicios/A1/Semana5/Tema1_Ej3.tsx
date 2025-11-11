import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "../ejercicios.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tema1_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [esCorrecta, setEsCorrecta] = useState<boolean | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const ejercicios = [
    { pregunta: "I ________ get up early on weekdays.", correcta: "always", audio: "/audios/sem5/ej3_1.mp3" },
    { pregunta: "She ________ eats vegetables. She doesn’t like them.", correcta: "rarely", audio: "/audios/sem5/ej3_2.mp3" },
    { pregunta: "We ________ go to the park when it’s sunny.", correcta: "sometimes", audio: "/audios/sem5/ej3_3.mp3" },
    { pregunta: "He ________ helps his friends with homework.", correcta: "usually", audio: "/audios/sem5/ej3_4.mp3" },
    { pregunta: "They ________ watch TV after dinner.", correcta: "often", audio: "/audios/sem5/ej3_5.mp3" },
    { pregunta: "I ________ drink coffee. I prefer tea.", correcta: "never", audio: "/audios/sem5/ej3_6.mp3" },
    { pregunta: "My parents ________ travel in summer.", correcta: "always", audio: "/audios/sem5/ej3_7.mp3" },
    { pregunta: "He ________ goes to bed before 11 p.m.", correcta: "usually", audio: "/audios/sem5/ej3_8.mp3" },
    { pregunta: "We ________ eat fast food because it’s expensive.", correcta: "rarely", audio: "/audios/sem5/ej3_9.mp3" },
    { pregunta: "She ________ listens to music when she studies.", correcta: "often", audio: "/audios/sem5/ej3_10.mp3" },
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

  const playAudio = () => {
    audioRef.current?.play();
  };

 const verificar = () => {
  if (!inputValue.trim()) return;

  const respuestaNormalizada = inputValue.trim().toLowerCase();
  const oracionCompleta = actual.pregunta.replace(/_+/g, actual.correcta); //  reemplaza todos los guiones bajos

  if (respuestaNormalizada === actual.correcta.toLowerCase()) {
    setRespuesta(`Correct!\n\n${oracionCompleta}`);
    setEsCorrecta(true);
    setCorrectas(prev => prev + 1);
  } else {
    setRespuesta(`Incorrect.\n\n${oracionCompleta}`);
    setEsCorrecta(false);
  }
};


  const siguiente = () => {
    setRespuesta(null);
    setEsCorrecta(null);
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
            <h1 className="titulo-ejercicio">EXERCISE 3</h1>
            <p className="progreso-ejercicio">
              Question {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section className="tarjeta-ejercicio" style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}>
            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
                <p className="instruccion-ejercicio">
                  Listen to the sentence and write the missing frequency adverb (always / usually / often / sometimes / rarely / never).
                </p>
              </div>
            )}

            <button onClick={playAudio} className="btn-audio" style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              🔊
            </button>
            <audio ref={audioRef} src={actual.audio} />

            <div className="oracion-box" style={{
              backgroundColor: "#f4f6fa",
              borderLeft: "5px solid #222a5c",
              borderRadius: "8px",
              padding: "1.5rem",
              margin: "1rem auto",
              maxWidth: "650px",
              textAlign: "left",
              fontStyle: "italic",
              whiteSpace: "pre-line",
            }}>
              <p>{respuesta ? respuesta.split("\n").slice(1).join("\n") : actual.pregunta}</p>
            </div>

            {!respuesta && (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Write your answer here"
                style={{ fontSize: "1.2rem", padding: "0.8rem", width: "250px", marginBottom: "1rem", borderRadius: "6px", border: "1px solid #ccc" }}
              />
            )}

            {!respuesta && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                disabled={!inputValue.trim()}
                style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", marginBottom: "1rem", borderRadius: "8px" }}
              >
                Check
              </button>
            )}

            {respuesta && (
              <p
                className={`respuesta-feedback ${esCorrecta ? "correcta" : "incorrecta"}`}
                style={{ fontSize: "1.3rem", margin: "1rem 0", whiteSpace: "pre-line" }}
              >
                {respuesta.split("\n")[0]}
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
