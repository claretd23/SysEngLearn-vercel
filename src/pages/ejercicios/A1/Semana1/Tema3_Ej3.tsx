import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import "../ejercicios.css";

export default function Tema3_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL; 

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [yaCompletado, setYaCompletado] = useState(false);

  const ejercicios = useMemo(
    () => [
      { audios: ["/audios/sem1/Tema3/ordinal1_a.mp3", "/audios/sem1/Tema3/ordinal1_b.mp3"], correcta: "1st" },
      { audios: ["/audios/sem1/Tema3/ordinal2_a.mp3", "/audios/sem1/Tema3/ordinal2_b.mp3"], correcta: "3rd" },
      { audios: ["/audios/sem1/Tema3/ordinal3_a.mp3", "/audios/sem1/Tema3/ordinal3_b.mp3"], correcta: "4th" },
      { audios: ["/audios/sem1/Tema3/ordinal4_a.mp3", "/audios/sem1/Tema3/ordinal4_b.mp3"], correcta: "8th" },
      { audios: ["/audios/sem1/Tema3/ordinal5_a.mp3", "/audios/sem1/Tema3/ordinal5_b.mp3"], correcta: "2nd" },
      { audios: ["/audios/sem1/Tema3/ordinal6_a.mp3", "/audios/sem1/Tema3/ordinal6_b.mp3"], correcta: "15th" },
      { audios: ["/audios/sem1/Tema3/ordinal7_a.mp3", "/audios/sem1/Tema3/ordinal7_b.mp3"], correcta: "3rd" },
      { audios: ["/audios/sem1/Tema3/ordinal8_a.mp3", "/audios/sem1/Tema3/ordinal8_b.mp3"], correcta: "20th" },
    ],
    []
  );

  const actual = ejercicios[index];
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  // ✅ Verificar si el ejercicio ya fue completado
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
      } catch (error) {
        console.error("Error al consultar progreso:", error);
      }
    };
    checkProgreso();
  }, [id, nivel, semana, tema, ejercicio, API_URL]);

  // ✅ Guardar progreso en el backend
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

  // ✅ Reproducir audios secuencialmente
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

  const verificar = () => {
    const respuestaUsuario = inputValue.trim().toLowerCase();
    if (!respuestaUsuario) return;

    if (respuestaUsuario === actual.correcta.toLowerCase()) {
      setRespuesta(`Correct! The answer is "${actual.correcta}".`);
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(` The correct answer is "${actual.correcta}".`);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setInputValue("");
    setIndex((prev) => prev + 1);
  };

  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => navigate(`/inicio/${nivel}`), 2500);
  };


  if (yaCompletado) {
    return (
      <div className="finalizado" style={{ fontSize: "1.3rem" }}>
        <h2>You have already completed this exercise.</h2>
        <p>You cannot answer it again.</p>
        <button
          onClick={() => navigate(`/inicio/${nivel}`)}
          className="ejercicio-btn"
          style={{ fontSize: "1.2rem", padding: "0.8rem 2rem" }}
        >
          Go back to level start
        </button>
      </div>
    );
  }

  //  Pantalla final
  if (finalizado) {
    return (
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
    );
  }

  //  Ejercicio principal
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
              Listen to the conversation and write the ordinal number you hear.
            </p>
          </div>
        )}

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

        {/* Input + Check alineados */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            margin: "1.5rem 0",
          }}
        >
          {!respuesta && (
            <>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="input-respuesta"
                placeholder="Write the ordinal number..."
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
            </>
          )}
        </div>

        {/* Feedback de respuesta */}
        {respuesta && (
          <p
            className="respuesta-feedback"
            style={{
              fontSize: "1.3rem",
              margin: "1rem 0",
              color: respuesta.startsWith("Correct") ? "green" : "red",
              fontWeight: "bold",
            }}
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
