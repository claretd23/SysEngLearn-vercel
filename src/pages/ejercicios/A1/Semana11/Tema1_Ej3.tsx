import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import "../ejercicios.css";

interface MCQ {
  pregunta: string;
  opciones: string[];
  correcta: string;
  audios: string[];
}

export default function Tema1_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const ejercicios: MCQ[] = useMemo(
    () => [
      {
        pregunta: "Whose pencil is it?",
        opciones: ["Lily’s", "Mark’s", "The teacher’s"],
        correcta: "Mark’s",
        audios: [
          "/audios/sem11/1_1.mp3",
          "/audios/sem11/1_2.mp3",
          "/audios/sem11/1_3.mp3",
          "/audios/sem11/1_4.mp3",
        ],
      },
      {
        pregunta: "Whose phone is on the table?",
        opciones: ["Sara’s", "Emma’s", "Tom’s"],
        correcta: "Emma’s",
        audios: [
          "/audios/sem11/2_1.mp3",
          "/audios/sem11/2_2.mp3",
          "/audios/sem11/2_3.mp3",
          "/audios/sem11/2_4.mp3",
        ],
      },
      {
        pregunta: "Whose shoes are by the door?",
        opciones: ["Amy’s", "Mom’s", "Dad’s"],
        correcta: "Dad’s",
        audios: [
          "/audios/sem11/3_1.mp3",
          "/audios/sem11/3_2.mp3",
          "/audios/sem11/3_3.mp3",
          "/audios/sem11/3_4.mp3",
        ],
      },
      {
        pregunta: "Whose backpack is blue?",
        opciones: ["Nina’s", "Ben’s", "No one’s"],
        correcta: "Ben’s",
        audios: [
          "/audios/sem11/4_1.mp3",
          "/audios/sem11/4_2.mp3",
          "/audios/sem11/4_3.mp3",
          "/audios/sem11/4_4.mp3",
        ],
      },
      {
        pregunta: "Whose sandwich is it?",
        opciones: ["Paul’s", "Jane’s", "Jack’s"],
        correcta: "Jack’s",
        audios: [
          "/audios/sem11/5_1.mp3",
          "/audios/sem11/5_2.mp3",
          "/audios/sem11/5_3.mp3",
          "/audios/sem11/5_4.mp3",
        ],
      },
      {
        pregunta: "Whose notebook is it?",
        opciones: ["The teacher’s", "Lisa’s", "Anna’s"],
        correcta: "Lisa’s",
        audios: [
          "/audios/sem11/6_1.mp3",
          "/audios/sem11/6_2.mp3",
          "/audios/sem11/6_3.mp3",
          "/audios/sem11/6_4.mp3",
        ],
      },
      {
        pregunta: "Whose jacket is on the chair?",
        opciones: ["Emma’s", "Emma’s brother’s", "Mark’s"],
        correcta: "Emma’s brother’s",
        audios: [
          "/audios/sem11/7_1.mp3",
          "/audios/sem11/7_2.mp3",
          "/audios/sem11/7_3.mp3",
          "/audios/sem11/7_4.mp3",
        ],
      },
      {
        pregunta: "Whose water bottle is red?",
        opciones: ["Mia’s", "Jake’s", "Anna’s"],
        correcta: "Jake’s",
        audios: [
          "/audios/sem11/8_1.mp3",
          "/audios/sem11/8_2.mp3",
          "/audios/sem11/8_3.mp3",
          "/audios/sem11/8_4.mp3",
        ],
      },
      {
        pregunta: "Whose car is outside?",
        opciones: ["Tom’s", "His uncle’s", "His dad’s"],
        correcta: "His uncle’s",
        audios: [
          "/audios/sem11/9_1.mp3",
          "/audios/sem11/9_2.mp3",
          "/audios/sem11/9_3.mp3",
          "/audios/sem11/9_4.mp3",
        ],
      },
      {
        pregunta: "Whose dog is in the garden?",
        opciones: ["Sam’s", "Lara’s", "The neighbor’s"],
        correcta: "The neighbor’s",
        audios: [
          "/audios/sem11/10_1.mp3",
          "/audios/sem11/10_2.mp3",
          "/audios/sem11/10_3.mp3",
          "/audios/sem11/10_4.mp3",
        ],
      },
    ],
    []
  );

  // --- resto del código igual ---
  const [index, setIndex] = useState(0);
  const actual = ejercicios[index];
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  const playSequence = () => {
    audioRefs.current.forEach((audio, i) => {
      if (!audio) return;
      audio.onended = () => {
        if (i + 1 < audioRefs.current.length) {
          setTimeout(() => audioRefs.current[i + 1]?.play(), 500);
        }
      };
    });
    audioRefs.current[0]?.play();
  };

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
      }
    } catch (err) {
      console.error("Error al guardar progreso:", err);
    }
  };

  const verificar = () => {
    if (!opcionSeleccionada) return;
    if (opcionSeleccionada === actual.correcta) {
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`The correct answer is "${actual.correcta}".`);
    }
  };

  const siguiente = () => {
    setOpcionSeleccionada(null);
    setRespuesta(null);
    setIndex((prev) => prev + 1);
  };

  const finalizar = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => navigate(`/inicio/${nivel}`), 2500);
  };

  if (finalizado) {
    return (
      <div className="finalizado">
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
          Question {index + 1} of {ejercicios.length}
        </p>
      </header>

      <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
        {index === 0 && (
          <div className="instruccion-box" style={{ fontSize: "1.3rem" }}>
            <p>Listen and choose the correct answer.</p>
          </div>
        )}

        {index === 0 && (
          <>
            <button className="btn-audio" onClick={playSequence} style={{ fontSize: "2rem", margin: "1rem 0" }}>
              🔊
            </button>
            {actual.audios.map((src, i) => (
              <audio key={i} ref={(el) => (audioRefs.current[i] = el)} src={src} />
            ))}
          </>
        )}

        <p style={{ fontSize: "1.3rem", margin: "1rem 0" }}>{actual.pregunta}</p>

        {!respuesta && (
          <div className="opciones-container" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", width: "100%", marginTop: "1rem" }}>
            {actual.opciones.map((op) => (
              <button
                key={op}
                className={`opcion-btn ${opcionSeleccionada === op ? "seleccionada" : ""}`}
                onClick={() => setOpcionSeleccionada(op)}
                style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem", minWidth: "220px" }}
              >
                {op}
              </button>
            ))}
          </div>
        )}

        {respuesta && (
          <p className={`respuesta-feedback ${respuesta.startsWith("Correct") ? "correcta" : "incorrecta"}`} style={{ fontSize: "1.3rem", margin: "1rem 0" }}>
            {respuesta}
          </p>
        )}

        {respuesta && index < ejercicios.length - 1 && (
          <button className="ejercicio-btn" onClick={siguiente}>
            Next question
          </button>
        )}
        {respuesta && index === ejercicios.length - 1 && (
          <button className="ejercicio-btn" onClick={finalizar}>
            Finish
          </button>
        )}

        {!respuesta && opcionSeleccionada && (
          <button className="ejercicio-btn" onClick={verificar}>
            Check
          </button>
        )}
      </section>
    </div>
  );
}
