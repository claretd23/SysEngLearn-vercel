import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "../ejercicios.css";

export default function Tema3_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [audioIndex, setAudioIndex] = useState<number | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioIndex(null);
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const fullDialogue = [
    "/audios/sem12/21.mp3",
    "/audios/sem12/22.mp3",
    "/audios/sem12/23.mp3",
    "/audios/sem12/24.mp3",
    "/audios/sem12/25.mp3",
  ];

  const ejercicios = [
    {
      audio: fullDialogue,
      pregunta: "What will Tom do tomorrow?",
      opciones: [
        "He will go to the park and take his dog",
        "He will stay home and watch TV",
        "He will go shopping and play football",
      ],
      correcta: "He will go to the park and take his dog",
    },
    {
      audio: fullDialogue,
      pregunta: "Will Tom stay at home all day?",
      opciones: [
        "Yes, and he will read a book",
        "No, he will go to the park and maybe meet Paul",
        "No, he will go swimming and clean his room",
      ],
      correcta: "No, he will go to the park and maybe meet Paul",
    },
    {
      audio: fullDialogue,
      pregunta: "What will Tom take to the park?",
      opciones: [
        "His football and his backpack",
        "His dog and maybe meet Paul",
        "His sister and his bike",
      ],
      correcta: "His dog and maybe meet Paul",
    },
    {
      audio: fullDialogue,
      pregunta: "Will Tom play football if it rains?",
      opciones: [
        "Yes, he will play with Paul",
        "No, he won’t play and the football will stay at home",
        "Maybe, he will play later in the evening",
      ],
      correcta: "No, he won’t play and the football will stay at home",
    },
    {
      audio: fullDialogue,
      pregunta: "Where will Emma go tomorrow?",
      opciones: [
        "To the library and she will do her homework",
        "To the park and she will play football",
        "To the cinema and she will meet Paul",
      ],
      correcta: "To the library and she will do her homework",
    },
    {
      audio: fullDialogue,
      pregunta: "Will Emma go shopping after the library?",
      opciones: [
        "Yes, and she will buy a book",
        "No, she won’t go shopping and she has too much homework",
        "Maybe, she will go with her brother",
      ],
      correcta: "No, she won’t go shopping and she has too much homework",
    },
    {
      audio: fullDialogue,
      pregunta: "What does Emma think about the library in the morning?",
      opciones: [
        "It will be noisy and crowded",
        "It will be closed and she will go home",
        "It will be quiet and she will study",
      ],
      correcta: "It will be quiet and she will study",
    },
    {
      audio: fullDialogue,
      pregunta: "Will Emma’s brother go to the library with her?",
      opciones: [
        "Yes, and he will help her with homework",
        "No, he won’t go and he will play video games at home",
        "Maybe, he will go and bring his friend",
      ],
      correcta: "No, he won’t go and he will play video games at home",
    },
    {
      audio: fullDialogue,
      pregunta: "What will Paul bring to the park?",
      opciones: ["His football and some drinks", "His dog and a ball", "His bicycle and backpack"],
      correcta: "His football and some drinks",
    },
    {
      audio: fullDialogue,
      pregunta: "What will Tom do if the park is wet?",
      opciones: [
        "He will play football with Paul",
        "He will go to the library and meet his brother",
        "He won’t play football and will take his dog home",
      ],
      correcta: "He won’t play football and will take his dog home",
    },
  ];

  const actual = ejercicios[index];

  // 🔊 AUDIO SOLO SI APRIETAN EL BOTÓN
  const playAudio = () => {
    stopAudio();
    setAudioIndex(0);
  };

  useEffect(() => {
    if (audioIndex === null) return;
    const src = actual.audio[audioIndex];
    if (!src || !audioRef.current) return;

    audioRef.current.src = src;
    audioRef.current.play();

    const handleEnded = () => {
      if (audioIndex + 1 < actual.audio.length) {
        setAudioIndex((prev) => prev! + 1);
      } else {
        setAudioIndex(null);
      }
    };

    audioRef.current.addEventListener("ended", handleEnded);
    return () => audioRef.current?.removeEventListener("ended", handleEnded);
  }, [audioIndex, actual.audio]);

  // ✔ VERIFICAR
  const verificar = () => {
    if (!seleccion) return;

    if (seleccion === actual.correcta) {
      setRespuesta("Correct");
      setCorrectas((p) => p + 1);
    } else {
      setRespuesta(`Incorrect.\n\nCorrect answer: ${actual.correcta}`);
    }
  };

  // 👉 SIGUIENTE
  const siguiente = () => {
    stopAudio();
    setRespuesta(null);
    setSeleccion(null);

    if (index + 1 < ejercicios.length) {
      setIndex(index + 1);
    } else finalizar();
  };

  const guardarProgreso = async () => {
    const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
    }

    if (!token) return;
    try {
      await fetch(`${API_URL}/api/progreso`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nivel, semana, tema, ejercicio }),
      });
    } catch {}
  };

  const finalizar = async () => {
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

 <section className="tarjeta-ejercicio" style={{ textAlign: "center", padding: "2rem" }}>

  {index === 0 && !respuesta && (
    <>
      <p className="instruccion-ejercicio">
        Listen to the dialogue carefully and answer the questions.
      </p>

      <button className="btn-audio" onClick={playAudio} style={{ fontSize: "2rem" }}>
        🔊
      </button>
      <audio ref={audioRef} />
    </>
  )}

  {/* Pregunta */}
  <div
    style={{
      backgroundColor: "#f4f6fa",
      borderLeft: "5px solid #222a5c",
      borderRadius: "8px",
      padding: "1.5rem",
      margin: "1rem auto",
      maxWidth: "600px",
      textAlign: "left",
      fontStyle: "italic",
    }}
  >
    <p>{actual.pregunta}</p>
  </div>

  {/* Opciones */}
  <div
    className="opciones-ejercicio"
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      alignItems: "center",
      marginBottom: "1.5rem"
    }}
  >
    {actual.opciones.map((op, i) => (
      <button
        key={i}
        className={`opcion-btn ${seleccion === op ? "seleccionada" : ""}`}
        onClick={() => setSeleccion(op)}
        disabled={!!respuesta}    // ❗ Evita cambiar opción después del Check
        style={{
          fontSize: "1.2rem",
          padding: "0.8rem 1.5rem",
          minWidth: "250px",
          textAlign: "center",
          opacity: respuesta ? 0.7 : 1
        }}
      >
        {op}
      </button>
    ))}
  </div>

  {/* Mensaje Correct / Incorrect debajo de las opciones */}
  {respuesta && (
    <p
      style={{
        fontSize: "1.3rem",
        margin: "0.5rem 0 1.5rem 0",
        color: respuesta === "Correct" ? "green" : "red",
        whiteSpace: "pre-line",
        fontWeight: 600,
      }}
    >
      {respuesta}
    </p>
  )}

  {/* Botones Check / Next / Finish */}
  {!respuesta ? (
    <button
      onClick={verificar}
      className="ejercicio-btn"
      disabled={!seleccion}
      style={{
        fontSize: "1.3rem",
        padding: "0.8rem 2rem",
        opacity: seleccion ? 1 : 0.5,
        cursor: seleccion ? "pointer" : "not-allowed"
      }}
    >
      Check
    </button>
  ) : index < ejercicios.length - 1 ? (
    <button onClick={siguiente} className="ejercicio-btn">
      Next
    </button>
  ) : (
    <button onClick={finalizar} className="ejercicio-btn">
      Finish
    </button>
  )}

</section>


        </>
      ) : (
        <div className="finalizado">
          <h2>You have completed the exercise!</h2>
          <p>
            Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
          </p>
          <p>Redirecting...</p>
        </div>
      )}
    </div>
  );
}
