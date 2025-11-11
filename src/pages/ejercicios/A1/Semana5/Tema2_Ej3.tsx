import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import "../ejercicios.css";

export default function Tema2_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [oracionCompleta, setOracionCompleta] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // === LISTA DE EJERCICIOS ===
  const ejercicios = useMemo(
    () => [
      {
        audio: "/audios/sem6/ej3_1.mp3",
        pregunta: "I have a ______ .",
        correcta: "beautiful small white dog",
      },
      {
        audio: "/audios/sem6/ej3_2.mp3",
        pregunta: "She is wearing a ______.",
        correcta: "nice long red dress",
      },
      {
        audio: "/audios/sem6/ej3_3.mp3",
        pregunta: "He lives in a ______ house.",
        correcta: "big yellow house",
      },
      {
        audio: "/audios/sem6/ej3_4.mp3",
        pregunta: "I bought a ______.",
        correcta: "new black car",
      },
      {
        audio: "/audios/sem6/ej3_5.mp3",
        pregunta: "They have a ______ .",
        correcta: "cute little baby",
      },
      {
        audio: "/audios/sem6/ej3_6.mp3",
        pregunta: "We saw a ______ .",
        correcta: "beautiful big green park",
      },
      {
        audio: "/audios/sem6/ej3_7.mp3",
        pregunta: "She has a ______.",
        correcta: "nice small brown bag",
      },
      {
        audio: "/audios/sem6/ej3_8.mp3",
        pregunta: "I want a ______ .",
        correcta: "comfortable large blue chair",
      },
      {
        audio: "/audios/sem6/ej3_9.mp3",
        pregunta: "We visited an ______ .",
        correcta: "old white church",
      },
      {
        audio: "/audios/sem6/ej3_10.mp3",
        pregunta: "He is driving a ______.",
        correcta: "fast red car",
      },
    ],
    []
  );

  const actual = ejercicios[index];

  // === OPCIONES ALEATORIAS (correcta + 2 mezcladas) ===
  const opciones = useMemo(() => {
    const otras = ejercicios
      .filter((e) => e.correcta !== actual.correcta)
      .map((e) => e.correcta)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    const todas = [...otras, actual.correcta].sort(() => 0.5 - Math.random());
    return todas;
  }, [actual, ejercicios]);

  // === AUDIO ===
  const playAudio = () => {
    audioRef.current?.play();
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
  const verificar = (op: string) => {
    setOpcionSeleccionada(op);
    const completa = actual.pregunta.replace("______", actual.correcta);

    if (op === actual.correcta) {
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("Incorrect!");
    }
    setOracionCompleta(completa);
  };

  // === SIGUIENTE ===
  const siguiente = () => {
    setRespuesta(null);
    setOracionCompleta(null);
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
              🎧 Listen carefully to the sentence. Choose the option with the correct order of adjectives.
            </p>
          </div>
        )}

        {/* AUDIO */}
        <button
          className="btn-audio"
          style={{ fontSize: "2rem", margin: "1rem 0" }}
          onClick={playAudio}
        >
          🔊
        </button>
        <audio ref={audioRef} src={actual.audio} />

        {/* PREGUNTA */}
        <p style={{ fontSize: "1.3rem", margin: "1rem 0" }}>
          {actual.pregunta}
        </p>

        {/* OPCIONES */}
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
          {opciones.map((op, i) => (
            <button
              key={i}
              className={`opcion-btn ${
                opcionSeleccionada === op
                  ? op === actual.correcta
                    ? "correcta"
                    : "incorrecta"
                  : ""
              }`}
              onClick={() => verificar(op)}
              disabled={!!opcionSeleccionada}
              style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem", minWidth: "250px" }}
            >
              {op}
            </button>
          ))}
        </div>

        {/* FEEDBACK */}
        {respuesta && (
          <>
            <p
              className={`respuesta-feedback ${
                respuesta === "Correct!" ? "correcta" : "incorrecta"
              }`}
              style={{ fontSize: "1.3rem", margin: "1rem 0" }}
            >
              {respuesta}
            </p>
            {oracionCompleta && (
              <p style={{ fontSize: "1.2rem", marginTop: "0.5rem", fontStyle: "italic" }}>
                {oracionCompleta}
              </p>
            )}
          </>
        )}

        {/* BOTONES SIGUIENTE / FINALIZAR */}
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
