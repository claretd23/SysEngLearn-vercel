import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import "../ejercicios.css";

export default function Tema3_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [inputValue, setInputValue] = useState("");
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [yaCompletado, setYaCompletado] = useState(false);

  // Cada ejercicio tiene 2 audios (conversación corta)
  const ejercicios = useMemo(
    () => [
      {
        audios: ["/audios/sem3/imperatives1_a.mp3", "/audios/sem3/imperatives1_b.mp3"],
        textoFirst: "After 100 metres, ",
        textoLast: " right.",
        correcta: "turn",
      },
      {
        audios: ["/audios/sem3/imperatives2_a.mp3", "/audios/sem3/imperatives2_b.mp3"],
        textoFirst: "Please, ",
        textoLast: " your books on page 10.",
        correcta: "open",
      },
      {
        audios: ["/audios/sem3/imperatives3_a.mp3", "/audios/sem3/imperatives3_b.mp3"],
        textoFirst: "",
        textoLast: " so close to the fire.",
        correcta: "don't stand",
      },
      {
        audios: ["/audios/sem3/imperatives4_a.mp3", "/audios/sem3/imperatives4_b.mp3"],
        textoFirst: "",
        textoLast: " faster, we’re almost there!",
        correcta: "run",
      },
      {
        audios: ["/audios/sem3/imperatives5_a.mp3", "/audios/sem3/imperatives5_b.mp3"],
        textoFirst: "",
        textoLast: " this medicine twice a day.",
        correcta: "take",
      },
      {
        audios: ["/audios/sem3/imperatives6_a.mp3", "/audios/sem3/imperatives6_b.mp3"],
        textoFirst: "",
        textoLast: " here, please.",
        correcta: "stop",
      },
      {
        audios: ["/audios/sem3/imperatives7_a.mp3", "/audios/sem3/imperatives7_b.mp3"],
        textoFirst: "",
        textoLast: " your hands before eating.",
        correcta: "wash",
      },
      {
        audios: ["/audios/sem3/imperatives8_a.mp3", "/audios/sem3/imperatives8_b.mp3"],
        textoFirst: "",
        textoLast: " attention, everyone.",
        correcta: "pay",
      },
      {
        audios: ["/audios/sem3/imperatives9_a.mp3", "/audios/sem3/imperatives9_b.mp3"],
        textoFirst: "",
        textoLast: " pictures inside the museum, please.",
        correcta: "don't take",
      },
      {
        audios: ["/audios/sem3/imperatives10_a.mp3", "/audios/sem3/imperatives10_b.mp3"],
        textoFirst: "",
        textoLast: " louder!",
        correcta: "speak",
      },
    ],
    []
  );

  const actual = ejercicios[index];
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  // Check backend if already completed (same pattern que tus otros ejercicios)
  useEffect(() => {
    const checkProgreso = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API_URL}/api/progreso/${nivel}/${semana}/${tema}/${ejercicio}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data.completado) setYaCompletado(true);
        }
      } catch (err) {
        console.error("Error checking progreso:", err);
      }
    };
    checkProgreso();
  }, [API_URL, nivel, semana, tema, ejercicio]);

  // Guardar progreso (se llama al finalizar)
  const guardarProgreso = async () => {
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
      if (res.ok) {
        const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
        if (!completados.includes(id)) {
          completados.push(id);
          localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
        }
      } else {
        console.error("Error saving progreso:", res.statusText);
      }
    } catch (err) {
      console.error("Error saving progreso:", err);
    }
  };

  // Reproduce la conversación completa (dos audios) en secuencia
  const playSequence = () => {
    audioRefs.current.forEach((audio, i) => {
      if (audio) {
        audio.onended = () => {
          if (i + 1 < audioRefs.current.length && audioRefs.current[i + 1]) {
            setTimeout(() => audioRefs.current[i + 1]?.play(), 600);
          }
        };
      }
    });
    audioRefs.current[0]?.play();
  };

  const verificar = () => {
    const respuestaUsuario = inputValue.trim().toLowerCase();
    if (!respuestaUsuario) return;

    if (respuestaUsuario === actual.correcta.toLowerCase()) {
      setRespuesta(`Correct! The answer is "${actual.correcta}".`);
      setCorrectas((c) => c + 1);
    } else {
      setRespuesta(`The correct answer is "${actual.correcta}".`);
    }
  };

  const siguiente = async () => {
    setRespuesta(null);
    setInputValue("");
    if (index + 1 < ejercicios.length) {
      setIndex((i) => i + 1);
      // reset audio refs for next
      audioRefs.current = [];
    } else {
      // finished
      await guardarProgreso();
      setFinalizado(true);
      setTimeout(() => navigate(`/inicio/${nivel}`), 2500);
    }
  };

  if (yaCompletado) {
    return (
      <div className="finalizado" style={{ fontSize: "1.3rem" }}>
        <h2>You have already completed this exercise.</h2>
        <p>You cannot answer it again.</p>
        <button onClick={() => navigate(`/inicio/${nivel}`)} className="ejercicio-btn">
          Go back to level start
        </button>
      </div>
    );
  }

  if (finalizado) {
    return (
      <div className="finalizado" style={{ fontSize: "1.3rem" }}>
        <h2>You have completed the exercise!</h2>
        <p>
          Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
        </p>
        <p>Redirecting to the start of the level...</p>
      </div>
    );
  }

  return (
    <div className="ejercicio-container">
      <header className="ejercicio-header">
        <h1 className="titulo-ejercicio">EXERCISE 3</h1>
        <p className="progreso-ejercicio">
          Conversation {index + 1} of {ejercicios.length}
        </p>
      </header>

      <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
        {index === 0 && (
          <div className="instruccion-box" style={{ fontSize: "1.15rem" }}>
            <p className="instruccion-ejercicio">
              Listen to the short conversation (two audio clips) and complete the space with the correct imperative.
            </p>
          </div>
        )}

        <button className="btn-audio" onClick={playSequence} style={{ margin: "1rem 0" }}>
          Play conversation
        </button>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
          {actual.audios.map((src, i) => (
            <audio key={i} ref={(el) => (audioRefs.current[i] = el)} src={src} controls />
          ))}
        </div>

        <p style={{ fontSize: "1.15rem", margin: "1rem 0" }}>
          {actual.textoFirst}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="input-respuesta"
            placeholder="Write your answer..."
            style={{ margin: "0 .5rem", minWidth: 160 }}
          />
          {actual.textoLast}
        </p>

        {!respuesta ? (
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <button onClick={verificar} className="ejercicio-btn" style={{ padding: "0.6rem 1.4rem" }}>
              Check
            </button>
          </div>
        ) : (
          <>
            <p
              className="respuesta-feedback"
              style={{
                fontSize: "1.15rem",
                margin: "1rem 0",
                color: respuesta.startsWith("Correct") ? "green" : "red",
                fontWeight: "600",
              }}
            >
              {respuesta}
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              {index < ejercicios.length - 1 ? (
                <button onClick={siguiente} className="ejercicio-btn">
                  Next conversation
                </button>
              ) : (
                <button onClick={siguiente} className="ejercicio-btn">
                  Finish
                </button>
              )}
            </div>
          </>
        )}

        <p style={{ marginTop: 16, color: "#666" }}>
          Correct answers so far: <strong>{correctas}</strong>
        </p>
      </section>
    </div>
  );
}
