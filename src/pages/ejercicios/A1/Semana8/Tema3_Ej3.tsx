import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
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

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const audioRef = useRef(new Audio());

  // 👉 Detener audio cuando cambie el ejercicio o se salga del componente
  useEffect(() => {
    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  // 👉 También detener el audio al cambiar de pregunta
  useEffect(() => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, [index]);

  const ejercicios = useMemo(
    () => [
      {
        audio: ["/audios/sem8/1.1.mp3", "/audios/sem8/1.2.mp3"],
        pregunta: "How many pencils are on the desk?",
        opciones: ["One", "Two", "Three"],
        correcta: "One",
      },
      {
        audio: ["/audios/sem8/2.1.mp3", "/audios/sem8/2.2.mp3"],
        pregunta: "How many chairs are in the classroom?",
        opciones: ["Four", "Five", "Six"],
        correcta: "Five",
      },
      {
        audio: ["/audios/sem8/3.1.mp3", "/audios/sem8/3.2.mp3"],
        pregunta: "Is there a cat in the garden?",
        opciones: ["Yes", "No"],
        correcta: "No",
      },
      {
        audio: ["/audios/sem8/4.1.mp3", "/audios/sem8/4.2.mp3"],
        pregunta: "How many books are on the shelf?",
        opciones: ["Eight", "Ten", "Twelve"],
        correcta: "Ten",
      },
      {
        audio: ["/audios/sem8/5.1.mp3", "/audios/sem8/5.2.mp3"],
        pregunta: "Is there a bus stop near the school?",
        opciones: ["Yes", "No"],
        correcta: "Yes",
      },
      {
        audio: ["/audios/sem8/6.1.mp3", "/audios/sem8/6.2.mp3"],
        pregunta: "How many apples are there?",
        opciones: ["Two", "Three", "Four"],
        correcta: "Three",
      },
      {
        audio: ["/audios/sem8/7.1.mp3", "/audios/sem8/7.2.mp3"],
        pregunta: "Is there a TV in the living room?",
        opciones: ["Yes", "No"],
        correcta: "Yes",
      },
      {
        audio: ["/audios/sem8/8.1.mp3", "/audios/sem8/8.2.mp3"],
        pregunta: "Are there students in the classroom?",
        opciones: ["Yes", "No"],
        correcta: "No",
      },
      {
        audio: ["/audios/sem8/9.1.mp3", "/audios/sem8/9.2.mp3"],
        pregunta: "How many dogs are in the park?",
        opciones: ["One", "Two", "Three"],
        correcta: "One",
      },
      {
        audio: ["/audios/sem8/10.1.mp3", "/audios/sem8/10.2.mp3"],
        pregunta: "How many flowers are there?",
        opciones: ["Four", "Five", "Six"],
        correcta: "Five",
      },
    ],
    []
  );

  const actual = ejercicios[index];

  const playAudio = async () => {
    // 👉 Si ya hay audio sonando: lo detiene antes de reproducir otro
    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    for (let src of actual.audio) {
      audioRef.current.src = src;
      await audioRef.current.play();
      await new Promise((resolve) => {
        audioRef.current.onended = resolve;
      });
    }
  };

  const guardarProgreso = async () => {
    const completados = JSON.parse(
      localStorage.getItem("ejercicios_completados") || "[]"
    );

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

  const verificar = () => {
    if (!seleccion) return;

    if (seleccion === actual.correcta) {
      setRespuesta("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect.\n\nCorrect answer: ${actual.correcta}`);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setSeleccion(null);
    setIndex((prev) => prev + 1);
  };

  const finalizar = async () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    await guardarProgreso();
    setFinalizado(true);

    setTimeout(() => {
      navigate(`/inicio/${nivel}`);
      window.location.reload();
    }, 2500);
  };

  const esCorrecta = respuesta?.startsWith("Correct");

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
            {index === 0 && (
              <div className="instruccion-box">
                <p className="instruccion-ejercicio">
                  Listen to each dialogue and choose the correct answer.
                </p>
              </div>
            )}

            <button
              className="btn-audio"
              style={{ fontSize: "2rem", margin: "1rem 0" }}
              onClick={playAudio}
            >
              🔊
            </button>

            <div className="oracion-box">
              <p>{actual.pregunta}</p>
            </div>

            {!respuesta && (
              <div className="opciones-ejercicio">
                {actual.opciones.map((op, i) => (
                  <button
                    key={i}
                    className={`opcion-btn ${seleccion === op ? "seleccionada" : ""}`}
                    onClick={() => setSeleccion(op)}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}

            {!respuesta && seleccion && (
              <button onClick={verificar} className="ejercicio-btn">
                Check
              </button>
            )}

            {respuesta && (
              <p
                className={`respuesta-feedback ${esCorrecta ? "correcta" : "incorrecta"}`}
                style={{ whiteSpace: "pre-line" }}
              >
                {respuesta}
              </p>
            )}

            {respuesta && index < ejercicios.length - 1 && (
              <button onClick={siguiente} className="ejercicio-btn">
                Next question
              </button>
            )}

            {respuesta && index === ejercicios.length - 1 && (
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
