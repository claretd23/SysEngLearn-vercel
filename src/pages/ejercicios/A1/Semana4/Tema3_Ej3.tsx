import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "../ejercicios.css";

export default function Tema3_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios = [
    {
      pregunta: "A: Are you a student?",
      opciones: ["Yes, I am.", "No, he isn’t.", "Yes, she does."],
      correcta: "Yes, I am.",
      audio: "/audios/sem4/are-you-a-student.mp3",
    },
    {
      pregunta: "A: Is your brother at home?",
      opciones: ["Yes, he is.", "No, he isn’t.", "No, they aren’t."],
      correcta: "No, he isn’t.",
      audio: "/audios/sem4/is-your-brother-at-home.mp3",
    },
    {
      pregunta: "A: Do you like coffee?",
      opciones: ["Yes, I do.", "No, I don’t.", "No, I’m not."],
      correcta: "No, I don’t.",
      audio: "/audios/sem4/do-you-like-coffee.mp3",
    },
    {
      pregunta: "A: Is your teacher nice?",
      opciones: ["Yes, she is.", "No, she doesn’t.", "Yes, he does."],
      correcta: "Yes, she is.",
      audio: "/audios/sem4/is-your-teacher-nice.mp3",
    },
    {
      pregunta: "A: Do they work in an office?",
      opciones: ["No, they aren’t.", "No, they don’t.", "Yes, they are."],
      correcta: "No, they don’t.",
      audio: "/audios/sem4/do-they-work-in-an-office.mp3",
    },
    {
      pregunta: "A: Are your friends from Mexico?",
      opciones: ["Yes, they do.", "No, they don’t.", "Yes, they are."],
      correcta: "Yes, they are.",
      audio: "/audios/sem4/are-your-friends-from-mexico.mp3",
    },
    {
      pregunta: "A: Does your mom cook every day?",
      opciones: ["Yes, she does.", "No, she isn’t.", "Yes, she is."],
      correcta: "Yes, she does.",
      audio: "/audios/sem4/does-your-mom-cook-every-day.mp3",
    },
    {
      pregunta: "A: Are you tired?",
      opciones: ["Yes, I do.", "No, I’m not.", "Yes, I does."],
      correcta: "No, I’m not.",
      audio: "/audios/sem4/are-you-tired.mp3",
    },
    {
      pregunta: "A: Do you watch TV at night?",
      opciones: ["Yes, I am.", "No, I’m not.", "Yes, I do."],
      correcta: "Yes, I do.",
      audio: "/audios/sem4/do-you-watch-tv-at-night.mp3",
    },
    {
      pregunta: "A: Is your house big?",
      opciones: ["Yes, it is.", "No, it isn’t.", "Yes, they are."],
      correcta: "No, it isn’t.",
      audio: "/audios/sem4/is-your-house-big.mp3",
    },
  ];

  const actual = ejercicios[index];

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
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

  const verificar = (opcion: string) => {
    const esCorrecta = opcion.trim().toLowerCase() === actual.correcta.toLowerCase();

    if (esCorrecta) {
      setRespuesta(" Correct!");
      setCorrectas(prev => prev + 1);
    } else {
      setRespuesta(`Correct answer: ${actual.correcta}`);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setIndex(prev => prev + 1);
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

          <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
            <p className="pregunta-ejercicio" style={{ fontSize: "1.5rem", margin: "1rem 0", fontWeight: 500 }}>
              {actual.pregunta}
            </p>

            {/* 🔊 Botón de audio */}
            <button
              className="btn-audio"
              style={{ fontSize: "2rem", margin: "1rem 0" }}
              onClick={playAudio}
            >
              🔊
            </button>
            <audio ref={audioRef} src={actual.audio} />

            {!respuesta && (
              <div className="opciones-container">
                {actual.opciones.map((op, i) => (
                  <button
                    key={i}
                    className="opcion-btn"
                    onClick={() => verificar(op)}
                  >
                    {String.fromCharCode(97 + i)}) {op}
                  </button>
                ))}
              </div>
            )}

            {respuesta && (
              <p
                className={`respuesta-feedback ${respuesta.startsWith("✅") ? "correcta" : "incorrecta"}`}
                style={{ fontSize: "1.3rem", margin: "1rem 0" }}
              >
                {respuesta}
              </p>
            )}

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              {respuesta && index < ejercicios.length - 1 && (
                <button
                  onClick={siguiente}
                  className="ejercicio-btn"
                  style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
                >
                  Next question
                </button>
              )}
              {respuesta && index === ejercicios.length - 1 && (
                <button
                  onClick={manejarFinalizacion}
                  className="ejercicio-btn"
                  style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
                >
                  Finish
                </button>
              )}
            </div>
          </section>
        </>
      ) : (
        <div className="finalizado" style={{ fontSize: "1.3rem" }}>
          <h2> You have completed the exercise!</h2>
          <p>
            Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
