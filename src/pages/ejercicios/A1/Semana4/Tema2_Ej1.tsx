import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "../ejercicios.css";

export default function Tema2_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  // === Ejercicios con audio ===
  const ejercicios = [
    {
      audio: "/audios/adjectives-helpful.mp3",
      pregunta: "My teacher is very ______. She always helps me when I have problems.",
      opciones: ["lazy", "helpful", "noisy", "bored"],
      correcta: "helpful",
    },
    {
      audio: "/audios/adjectives-funny.mp3",
      pregunta: "The movie was really ______. I couldn’t stop laughing!",
      opciones: ["funny", "boring", "sad", "scary"],
      correcta: "funny",
    },
    {
      audio: "/audios/adjectives-tidy.mp3",
      pregunta: "My room is always ______ after I clean it.",
      opciones: ["dirty", "messy", "tidy", "noisy"],
      correcta: "tidy",
    },
    {
      audio: "/audios/adjectives-lazy.mp3",
      pregunta: "Kevin is a ______ student. He never studies or does his homework.",
      opciones: ["hardworking", "lazy", "polite", "friendly"],
      correcta: "lazy",
    },
    {
      audio: "/audios/adjectives-beautiful.mp3",
      pregunta: "The weather today is ______. Let’s go to the park!",
      opciones: ["terrible", "beautiful", "cold", "cloudy"],
      correcta: "beautiful",
    },
    {
      audio: "/audios/adjectives-wise.mp3",
      pregunta: "My grandmother is very ______. She tells great stories and gives good advice.",
      opciones: ["selfish", "wise", "nervous", "quiet"],
      correcta: "wise",
    },
    {
      audio: "/audios/adjectives-easy.mp3",
      pregunta: "The test was ______. Everyone finished in 10 minutes.",
      opciones: ["easy", "difficult", "confusing", "long"],
      correcta: "easy",
    },
    {
      audio: "/audios/adjectives-friendly.mp3",
      pregunta: "Our neighbor is very ______. He always says hello and smiles.",
      opciones: ["rude", "friendly", "serious", "lazy"],
      correcta: "friendly",
    },
    {
      audio: "/audios/adjectives-boring.mp3",
      pregunta: "The book was too ______. I fell asleep while reading it.",
      opciones: ["exciting", "boring", "funny", "short"],
      correcta: "boring",
    },
    {
      audio: "/audios/adjectives-dangerous.mp3",
      pregunta: "That dog is really ______. Be careful, it bites!",
      opciones: ["kind", "friendly", "dangerous", "lazy"],
      correcta: "dangerous",
    },
  ];

  const actual = ejercicios[index];

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

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
      setRespuesta(`Correct!\n\n${oracionCompletada}`);
      setCorrectas((prev) => prev + 1);
    } else {
      const oracionCorrecta = actual.pregunta.replace("______", actual.correcta);
      setRespuesta(`Incorrect.\n\n${oracionCorrecta}`);
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
            <h1 className="titulo-ejercicio">LISTENING – Exercise 1</h1>
            <p className="progreso-ejercicio">
              Question {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section className="tarjeta-ejercicio" style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}>
            {/* === Botón de audio === */}
            <button
              className="btn-audio"
              style={{ fontSize: "2rem", marginBottom: "1rem" }}
              onClick={playAudio}
            >
              🔊
            </button>
            <audio ref={audioRef} src={actual.audio} />

            {/* === Instrucción === */}
            <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
              <p className="instruccion-ejercicio">
                Listen to the sentence and choose the <b>correct adjective</b> to complete it.
              </p>
            </div>

            {/* === Oración === */}
            <div
              className="oracion-box"
              style={{
                backgroundColor: "#f4f6fa",
                borderLeft: "5px solid #222a5c",
                borderRadius: "8px",
                padding: "1.5rem",
                margin: "1rem auto",
                maxWidth: "650px",
                textAlign: "left",
                fontStyle: "italic",
                whiteSpace: "pre-line",
              }}
            >
              <p>{respuesta ? respuesta.split("\n").slice(1).join("\n") : actual.pregunta}</p>
            </div>

            {/* === Opciones === */}
            {!respuesta && (
              <div
                className="opciones-ejercicio"
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

            {/* === Botones === */}
            {!respuesta && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                disabled={!opcionSeleccionada}
                style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
              >
                Check
              </button>
            )}

            {respuesta && (
              <p
                className={`respuesta-feedback ${
                  respuesta.startsWith("Correct!") ? "correcta" : "incorrecta"
                }`}
                style={{ fontSize: "1.3rem", margin: "1rem 0" }}
              >
                {respuesta.split("\n")[0]}
              </p>
            )}

            <div
              className="botones-siguiente"
              style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}
            >
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
