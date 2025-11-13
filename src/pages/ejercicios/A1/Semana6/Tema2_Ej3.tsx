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

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  // === FUNCIONES DE AUDIO ===
  const playAudios = () => {
    const audios = audioRefs.current;
    if (!audios[0]) return;
    audios[0].play();
    audios[0].onended = () => {
      if (audios[1]) {
        setTimeout(() => audios[1]?.play(), 500);
      }
    };
  };

  // === EJERCICIOS ===
  const ejercicios = [
    {
      audios: ["/audios/sem3/imperatives1_a.mp3", "/audios/sem3/imperatives1_b.mp3"],
      texto: "After 100 metres, ________ right.",
      correcta: ["turn"],
    },
    {
      audios: ["/audios/sem3/imperatives2_a.mp3", "/audios/sem3/imperatives2_b.mp3"],
      texto: "Please, ________ your books on page 10.",
      correcta: ["open"],
    },
    {
      audios: ["/audios/sem3/imperatives3_a.mp3", "/audios/sem3/imperatives3_b.mp3"],
      texto: "________ so close to the fire.",
      correcta: ["don't stand"],
    },
    {
      audios: ["/audios/sem3/imperatives4_a.mp3", "/audios/sem3/imperatives4_b.mp3"],
      texto: "________ faster, we’re almost there!",
      correcta: ["run"],
    },
    {
      audios: ["/audios/sem3/imperatives5_a.mp3", "/audios/sem3/imperatives5_b.mp3"],
      texto: "________ this medicine twice a day.",
      correcta: ["take"],
    },
    {
      audios: ["/audios/sem3/imperatives6_a.mp3", "/audios/sem3/imperatives6_b.mp3"],
      texto: "________ here, please.",
      correcta: ["stop"],
    },
    {
      audios: ["/audios/sem3/imperatives7_a.mp3", "/audios/sem3/imperatives7_b.mp3"],
      texto: "________ your hands before eating.",
      correcta: ["wash"],
    },
    {
      audios: ["/audios/sem3/imperatives8_a.mp3", "/audios/sem3/imperatives8_b.mp3"],
      texto: "________ attention, everyone.",
      correcta: ["pay"],
    },
    {
      audios: ["/audios/sem3/imperatives9_a.mp3", "/audios/sem3/imperatives9_b.mp3"],
      texto: "________ pictures inside the museum, please.",
      correcta: ["don't take"],
    },
    {
      audios: ["/audios/sem3/imperatives10_a.mp3", "/audios/sem3/imperatives10_b.mp3"],
      texto: "________ louder!",
      correcta: ["speak"],
    },
  ];

  const actual = ejercicios[index];

  // === GUARDAR PROGRESO ===
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

      if (!res.ok) {
        console.error("Error al guardar progreso:", res.statusText);
      }
    } catch (error) {
      console.error("Error al guardar el progreso:", error);
    }
  };

  // === VERIFICAR RESPUESTA ===
  const verificar = () => {
    const respuestaUsuario = inputValue.trim().toLowerCase();
    if (!respuestaUsuario) return;

    const esCorrecta = actual.correcta.some(
      (c) => c.toLowerCase() === respuestaUsuario
    );

    if (esCorrecta) {
      setRespuesta("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("Incorrect");
      setInputValue(actual.correcta[0]);
    }
  };

  // === SIGUIENTE ===
  const siguiente = () => {
    setRespuesta(null);
    setInputValue("");
    setIndex(index + 1);
  };

  // === FINALIZAR ===
  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => {
      navigate(`/inicio/${nivel}`);
      window.location.reload();
    }, 3000);
  };

  const mostrarTexto = respuesta
    ? actual.texto.replace("________", actual.correcta[0])
    : actual.texto;

  return (
    <div className="ejercicio-container">
      {!finalizado ? (
        <>
          <header className="ejercicio-header">
            <h1 className="titulo-ejercicio">EXERCISE 3</h1>
            <p className="progreso-ejercicio">
              Conversation {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
            {index === 0 && (
              <div className="instruccion-box">
                <p className="instruccion-ejercicio" style={{ fontSize: "1.2rem" }}>
                  🎧 Listen to each conversation and complete the sentence with the correct imperative.
                </p>
              </div>
            )}

            {/* === AUDIO === */}
            <div style={{ margin: "1rem 0" }}>
              <button
                onClick={playAudios}
                className="btn-audio"
                style={{
                  fontSize: "1.8rem",
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                }}
              >
                🔊
              </button>
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "0.5rem" }}>
                {actual.audios.map((src, i) => (
                  <audio key={i} ref={(el) => (audioRefs.current[i] = el)} src={src} />
                ))}
              </div>
            </div>

            {/* === PREGUNTA === */}
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

            {/* === INPUT === */}
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
                  placeholder="Write the imperative"
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

            {/* === FEEDBACK === */}
            {respuesta && (
              <p
                className="respuesta-feedback"
                style={{
                  fontSize: "1.2rem",
                  margin: "1rem 0",
                  fontWeight: "bold",
                  color: respuesta === "Correct" ? "#28A745" : "#DC3545",
                }}
              >
                {respuesta}
              </p>
            )}

            {/* === BOTONES SIGUIENTE / FINAL === */}
            <div className="botones-siguiente">
              {respuesta && index < ejercicios.length - 1 && (
                <button
                  onClick={siguiente}
                  className="ejercicio-btn"
                  style={{ fontSize: "1.3rem", padding: "0.8rem 2rem" }}
                >
                  Next conversation
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
