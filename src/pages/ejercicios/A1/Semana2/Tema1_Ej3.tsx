import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import "../ejercicios.css";

export default function Tema1_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios = useMemo(
    () => [
      {
        audios: ["/audios/sem2/conv1_a.mp3", "/audios/sem2/conv1_b.mp3"],
        pregunta: "What time of the day is it?",
        opciones: ["Evening", "Morning", "Night"],
        correcta: "Morning",
      },
      {
        audios: ["/audios/sem2/conv2_a.mp3", "/audios/sem2/conv2_b.mp3"],
        pregunta: "How do they feel?",
        opciones: ["They are happy to meet", "They are angry", "They are going to sleep"],
        correcta: "They are happy to meet",
      },
      {
        audios: ["/audios/sem2/conv3_a.mp3", "/audios/sem2/conv3_b.mp3"],
        pregunta: "Where could they be?",
        opciones: ["In the morning class", "At night class", "At the supermarket"],
        correcta: "At night class",
      },
      {
        audios: ["/audios/sem2/conv4_a.mp3", "/audios/sem2/conv4_b.mp3"],
        pregunta: "How does the person feel?",
        opciones: ["Happy", "Tired", "Excited"],
        correcta: "Tired",
      },
      {
        audios: ["/audios/sem2/conv5_a.mp3", "/audios/sem2/conv5_b.mp3"],
        pregunta: "When will they meet again?",
        opciones: ["Later today", "Tomorrow", "Never"],
        correcta: "Tomorrow",
      },
      {
        audios: ["/audios/sem2/conv6_a.mp3", "/audios/sem2/conv6_b.mp3"],
        pregunta: "What are they going to do?",
        opciones: ["Go to school", "Go to sleep", "Eat dinner"],
        correcta: "Go to sleep",
      },
      {
        audios: ["/audios/sem2/conv7_a.mp3", "/audios/sem2/conv7_b.mp3"],
        pregunta: "Where are they?",
        opciones: ["At school", "At a café", "At the library"],
        correcta: "At a café",
      },
      {
        audios: ["/audios/sem2/conv8_a.mp3", "/audios/sem2/conv8_b.mp3"],
        pregunta: "What is happening?",
        opciones: ["A class starts", "A party starts", "They say goodbye"],
        correcta: "A party starts",
      },
      {
        audios: ["/audios/sem2/conv9_a.mp3", "/audios/sem2/conv9_b.mp3"],
        pregunta: "What does “See you later” mean?",
        opciones: ["Goodbye for a long time", "Goodbye, see you soon", "Hello"],
        correcta: "Goodbye, see you soon",
      },
      {
        audios: ["/audios/sem2/conv10_a.mp3", "/audios/sem2/conv10_b.mp3"],
        pregunta: "What are they doing?",
        opciones: ["Meeting for the first time", "Saying goodbye", "Talking on the phone"],
        correcta: "Meeting for the first time",
      },
    ],
    []
  );

  const actual = ejercicios[index];
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  // === REPRODUCCIÓN DE AUDIOS SECUENCIALES ===
  const playSequence = () => {
    audioRefs.current.forEach((audio, i) => {
      if (audio) {
        audio.onended = () => {
          if (i + 1 < audioRefs.current.length && audioRefs.current[i + 1]) {
            setTimeout(() => {
              audioRefs.current[i + 1]?.play();
            }, 600);
          }
        };
      }
    });
    audioRefs.current[0]?.play();
  };

  // === GUARDAR PROGRESO ===
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
    } catch (error) {
      console.error("Error al guardar el progreso:", error);
    }
  };

  // === VERIFICAR RESPUESTA ===
  const verificar = () => {
    if (!opcionSeleccionada) return;

    if (opcionSeleccionada === actual.correcta) {
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect. The correct answer is "${actual.correcta}".`);
    }
  };

  // === SIGUIENTE ===
  const siguiente = () => {
    setRespuesta(null);
    setOpcionSeleccionada(null);
    setIndex((prev) => prev + 1);
  };

  // === FINALIZAR ===
  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => navigate(`/inicio/${nivel}`), 2500);
  };

  // === FINALIZADO ===
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

  // === INTERFAZ PRINCIPAL ===
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
            <p className="instruccion-ejercicio">
              Listen to the conversation and choose the correct answer.
            </p>
          </div>
        )}

        {/* Botón de audio */}
        <button
          className="btn-audio"
          style={{ fontSize: "2rem", margin: "1rem 0" }}
          onClick={playSequence}
        >
          🔊
        </button>

        {actual.audios.map((src, i) => (
          <audio key={i} ref={(el) => (audioRefs.current[i] = el)} src={src} />
        ))}

        <p style={{ fontSize: "1.3rem", margin: "1rem 0" }}>{actual.pregunta}</p>

        {!respuesta && (
          <>
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
                  style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem", minWidth: "220px" }}
                >
                  {op}
                </button>
              ))}
            </div>

            <button
              onClick={verificar}
              className="ejercicio-btn"
              disabled={!opcionSeleccionada}
              style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
            >
              Check
            </button>
          </>
        )}

        {respuesta && (
          <p
            className={`respuesta-feedback ${
              respuesta.startsWith("Correct") ? "correcta" : "incorrecta"
            }`}
            style={{ fontSize: "1.3rem", margin: "1rem 0" }}
          >
            {respuesta}
          </p>
        )}

        <div className="botones-siguiente" style={{ marginTop: "1rem" }}>
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
    </div>
  );
}
