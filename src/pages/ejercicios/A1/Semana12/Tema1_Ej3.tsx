import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import "../ejercicios.css";

interface PreguntaTF {
  texto: string;
  correcta: boolean;
}

interface EjercicioTF {
  audios: string[];
  preguntas: PreguntaTF[];
}

export default function Tema1_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [seleccion, setSeleccion] = useState<boolean | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const ejercicios: EjercicioTF[] = useMemo(
    () => [
      {
        audios: ["/audios/sem12/1a.mp3", "/audios/sem12/1b.mp3"],
        preguntas: [
          { texto: "The current time is 10:20.", correcta: true },
          { texto: "Lily will start homework at 10:20.", correcta: true },
          { texto: "Tom will watch TV at 12:15.", correcta: false },
          { texto: "Tom will watch TV at 11:45.", correcta: true },
          { texto: "The homework is for Emma.", correcta: false },
        ],
      },
      {
        audios: ["/audios/sem12/2a.mp3", "/audios/sem12/2b.mp3"],
        preguntas: [
          { texto: "Emma’s English class starts at 2:45.", correcta: true },
          { texto: "Her lunch break is at 12:20.", correcta: true },
          { texto: "English class starts at 3:15.", correcta: false },
          { texto: "Lunch break is after English class.", correcta: false },
          { texto: "Emma arrives early for English class.", correcta: true },
        ],
      },
  {
    audios: ["/audios/sem12/3a.mp3", "/audios/sem12/3b.mp3"],
    preguntas: [
      { texto: "Lunch is at 12:30.", correcta: true },
      { texto: "Dinner is at 6:50.", correcta: true },
      { texto: "Lunch is at 12:15.", correcta: false },
      { texto: "Dinner is after lunch.", correcta: true },
      { texto: "Dinner is at 7:10.", correcta: false },
    ],
  },
  {
    audios: ["/audios/sem12/4a.mp3", "/audios/sem12/4b.mp3"],
    preguntas: [
      { texto: "Swimming lesson is at 4:20.", correcta: true },
      { texto: "Piano lesson is at 5:10.", correcta: true },
      { texto: "Swimming lesson is at 4:10.", correcta: false },
      { texto: "Piano lesson is before swimming.", correcta: false },
      { texto: "Jake needs a towel for swimming.", correcta: true },
    ],
  },
  {
    audios: ["/audios/sem12/5a.mp3", "/audios/sem12/5b.mp3"],
    preguntas: [
      { texto: "The movie starts at 7:50.", correcta: true },
      { texto: "Dinner is at 6:20.", correcta: true },
      { texto: "The movie starts at 8:10.", correcta: false },
      { texto: "Dinner is after the movie.", correcta: false },
      { texto: "They will get popcorn before the movie.", correcta: true },
    ],
  },
  {
    audios: ["/audios/sem12/6a.mp3", "/audios/sem12/6b.mp3"],
    preguntas: [
      { texto: "Piano lesson is at 3:15.", correcta: true },
      { texto: "Swimming class is at 5:40.", correcta: true },
      { texto: "Piano lesson is at 3:00.", correcta: false },
      { texto: "Swimming is before piano.", correcta: false },
      { texto: "Emma can practice before piano.", correcta: true },
    ],
  },
  {
    audios: ["/audios/sem12/7a.mp3", "/audios/sem12/7b.mp3"],
    preguntas: [
      { texto: "Football match is at 5:40.", correcta: true },
      { texto: "Homework is finished at 4:15.", correcta: true },
      { texto: "Football match is before homework.", correcta: false },
      { texto: "Football match is at 6:20.", correcta: false },
      { texto: "Jake finishes homework before dinner.", correcta: true },
    ],
  },
  {
    audios: ["/audios/sem12/8a.mp3", "/audios/sem12/8b.mp3"],
    preguntas: [
      { texto: "Picnic starts at 11:10.", correcta: true },
      { texto: "Ice cream is at 1:40.", correcta: true },
      { texto: "Ice cream is before the picnic.", correcta: false },
      { texto: "Picnic is at 10:50.", correcta: false },
      { texto: "They meet at the park.", correcta: true },
    ],
  },
  {
    audios: ["/audios/sem12/9a.mp3", "/audios/sem12/9b.mp3"],
    preguntas: [
      { texto: "Bedtime is at 8:30.", correcta: true },
      { texto: "Wake-up time is at 6:10.", correcta: true },
      { texto: "Bedtime is before wake-up.", correcta: true },
      { texto: "Wake-up time is at 6:30.", correcta: false },
      { texto: "Kids wake up before 7:00.", correcta: true },
    ],
  },
  {
    audios: ["/audios/sem12/10a.mp3", "/audios/sem12/10b.mp3"],
    preguntas: [
      { texto: "The bus leaves at 7:40.", correcta: true },
      { texto: "Breakfast is at 7:15.", correcta: true },
      { texto: "The bus leaves after breakfast.", correcta: true },
      { texto: "Breakfast is at 7:40.", correcta: false },
      { texto: "The bus leaves at 8:00.", correcta: false },
    ],
  },
    ],
    []
  );

  const actual = ejercicios[index];

    const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioIndex, setAudioIndex] = useState(0);

  // 🔊 Reproducir audios en secuencia
  const playAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.src = actual.audios[audioIndex];
    audioRef.current.play();

    audioRef.current.onended = () => {
      if (audioIndex + 1 < actual.audios.length) {
        setAudioIndex((prev) => prev + 1);
      } else {
        setAudioIndex(0);
      }
    };
  };

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

      if (!res.ok) console.error("Error saving progress:", res.statusText);
    } catch (error) {
      console.error("Progress error:", error);
    }
  };

  // ✔ Verificar si la selección coincide con la correcta
  const verificar = () => {
    if (seleccion === null) return;

    if (seleccion === actual.preguntas[0].correcta) {
      setRespuesta("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(
        `Incorrect.\n\nCorrect answer: ${actual.preguntas[0].correcta ? "True" : "False"}`
      );
    }
  };
 const siguiente = () => {
    setRespuesta(null);
    setSeleccion(null);
    setAudioIndex(0);

    actual.preguntas.shift(); // mueve a la siguiente pregunta dentro del mismo ejercicio

    if (actual.preguntas.length === 0) {
      if (index + 1 < ejercicios.length) {
        setIndex(index + 1);
      } else {
        finalizar();
      }
    }
  };

  // 🎉 Finalizar
  const finalizar = async () => {
    await guardarProgreso();
    setFinalizado(true);

    setTimeout(() => {
      navigate(`/inicio/${nivel}`);
      window.location.reload();
    }, 3000);
  };

  const esCorrecta = respuesta?.startsWith("Correct");

  return (
    <div className="ejercicio-container">
      {!finalizado ? (
        <>
          <header className="ejercicio-header">
            <h1 className="titulo-ejercicio">EXERCISE 3</h1>
            <p className="progreso-ejercicio">
              Statement {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section
            className="tarjeta-ejercicio"
            style={{ textAlign: "center", padding: "2rem" }}
          >
            {index === 0 && (
              <p className="instruccion-ejercicio" style={{ marginBottom: "1.5rem" }}>
                Listen carefully to each dialogue. Choose True (T) or False (F).
              </p>
            )}

            <button
              className="btn-audio"
              style={{ fontWeight: "bold", fontSize: "1.6rem", margin: "1rem 0" }}
              onClick={playAudio}
            >
              🔊
            </button>

            <audio ref={audioRef} />

            {/* Texto */}
<div
  style={{
    width: "90%",
    maxWidth: "700px",
    margin: "1.5rem auto",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.8rem",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    borderLeft: "6px solid #1e2a78",
  }}
>
  <p
    style={{
      fontSize: "1.4rem",
      lineHeight: "1.6",
      fontStyle: "italic",
      color: "#222",
      margin: 0,
      padding: 0,
    }}
  >
    {actual.preguntas[0].texto}
  </p>
</div>


           {/* BOTONES TRUE / FALSE - DISEÑO ORIGINAL */}
{!respuesta && (
  <div
    style={{
      display: "flex",
      gap: "2rem",
      justifyContent: "center",
      marginTop: "1.5rem",
    }}
  >
    {/* TRUE */}
    <button
      onClick={() => setSeleccion(true)}
      style={{
        padding: "1rem 2.5rem",
        fontSize: "1.5rem",
        borderRadius: "50px",
        border: seleccion === true ? "3px solid #1e2a78" : "2px solid #ccc",
        backgroundColor: seleccion === true ? "#eaf0ff" : "white",
        color: "#1e2a78",
        fontWeight: 700,
        cursor: "pointer",
        transition: "0.3s",
        boxShadow:
          seleccion === true
            ? "0 4px 10px rgba(0,0,0,0.15)"
            : "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      TRUE
    </button>

    {/* FALSE */}
    <button
      onClick={() => setSeleccion(false)}
      style={{
        padding: "1rem 2.5rem",
        fontSize: "1.5rem",
        borderRadius: "50px",
        border: seleccion === false ? "3px solid #b10e0e" : "2px solid #ccc",
        backgroundColor: seleccion === false ? "#ffecec" : "white",
        color: "#b10e0e",
        fontWeight: 700,
        cursor: "pointer",
        transition: "0.3s",
        boxShadow:
          seleccion === false
            ? "0 4px 10px rgba(0,0,0,0.15)"
            : "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      FALSE
    </button>
  </div>
)}


            {/* Botón Check */}
            {!respuesta && seleccion !== null && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                style={{ marginTop: "1rem", fontSize: "1.3rem" }}
              >
                Check
              </button>
            )}

            {/* Feedback */}
            {respuesta && (
              <p
                style={{
                  whiteSpace: "pre-line",
                  fontSize: "1.3rem",
                  marginTop: "1rem",
                  color: esCorrecta ? "green" : "red",
                  fontWeight: 600,
                }}
              >
                {respuesta}
              </p>
            )}

            {/* Next */}
            {respuesta &&
              (index < ejercicios.length - 1 || actual.preguntas.length > 1) && (
                <button
                  onClick={siguiente}
                  className="ejercicio-btn"
                  style={{ marginTop: "1rem", fontSize: "1.3rem" }}
                >
                  Next
                </button>
              )}

            {/* Finish */}
            {respuesta &&
              index === ejercicios.length - 1 &&
              actual.preguntas.length === 1 && (
                <button
                  onClick={finalizar}
                  className="ejercicio-btn"
                  style={{ marginTop: "1rem", fontSize: "1.3rem" }}
                >
                  Finish
                </button>
              )}
          </section>
        </>
      ) : (
        <div className="finalizado" style={{ textAlign: "center", fontSize: "1.3rem" }}>
          <h2>You have completed the exercise!</h2>
          <p>
            Correct answers:{" "}
            <strong>
              {correctas} / {ejercicios.length * 5}
            </strong>
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}