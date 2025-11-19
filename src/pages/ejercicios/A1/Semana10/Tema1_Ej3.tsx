import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
import "../ejercicios.css";

interface PreguntaTF {
  texto: string;
  correcta: boolean;
}

interface Speaker {
  nombre: string;
  foto: string;
}

interface EjercicioTF {
  audio: string[];
  speakers: Speaker[];
  preguntas: PreguntaTF[];
}

export default function Tema1_Ej3TrueFalse() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const [speakerIndex, setSpeakerIndex] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const audioRef = useRef<HTMLAudioElement>(new Audio());

  const stopAudio = () => {
    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
    } catch (e) {}
  };

  const ejercicios: EjercicioTF[] = useMemo(
    () => [
      {
        audio: [
          "/audios/sem10/1.a.mp3",
          "/audios/sem10/1.b.mp3",
          "/audios/sem10/1.c.mp3",
        ],
        speakers: [
          { nombre: "Emma", foto: "/img/M2.png" },
          { nombre: "Tom", foto: "/img/H2.png" },
          { nombre: "Lisa", foto: "/img/M1.png" },
        ],
        preguntas: [
          { texto: "1. Emma wants a new phone.", correcta: true },
          { texto: "2. Tom wants a phone.", correcta: false },
          { texto: "3. Lisa would like a new computer.", correcta: false },
          { texto: "4. Tom would like a tablet.", correcta: true },
        ],
      },
      {
        audio: [
          "/audios/sem10/2.a.mp3",
          "/audios/sem10/2.b.mp3",
          "/audios/sem10/2.c.mp3",
        ],
        speakers: [
          { nombre: "Ben", foto: "/img/H1.png" },
          { nombre: "Sophie", foto: "/img/M3.png" },
          { nombre: "Liam", foto: "/img/H3.png"},
        ],
        preguntas: [
          { texto: "1. Ben would like coffee.", correcta: true },
          { texto: "2. Sophie wants orange juice.", correcta: true },
          { texto: "3. Liam would like a drink.", correcta: false },
          { texto: "4. Everyone wants something to drink.", correcta: false },
        ],
      },
      {
        audio: [
          "/audios/sem10/3.a.mp3",
          "/audios/sem10/3.b.mp3",
          "/audios/sem10/3.c.mp3",
        ],
        speakers: [
          { nombre: "Nina", foto: "/img/M4.png" },
          { nombre: "Alex", foto: "/img/H4.png" },
          { nombre: "Eva", foto: "/img/M5.png" },
        ],
        preguntas: [
          { texto: "1. Nina wants to go to the park.", correcta: true },
          { texto: "2. Alex wants to go with Nina.", correcta: false },
          { texto: "3. Eva would like to go to the park.", correcta: true },
          { texto: "4. Everyone wants to stay home.", correcta: false },
        ],
      },

      {
        audio: [
          "/audios/sem10/4.a.mp3",
          "/audios/sem10/4.b.mp3",
          "/audios/sem10/4.c.mp3",
        ],
        speakers: [
          { nombre: "Jack", foto: "/img/H5.png" },
          { nombre: "Maria", foto: "/img/M6.png" },
          { nombre: "Leo", foto: "/img/H6.png" },
        ],
        preguntas: [
          { texto: "1. Jack would like pizza.", correcta: true },
          { texto: "2. Maria wants a pizza.", correcta: false },
          { texto: "3. Leo wants to eat something.", correcta: false },
          { texto: "4. Maria wants a salad.", correcta: true },
        ],
      },

      {
        audio: [
          "/audios/sem10/5.a.mp3",
          "/audios/sem10/5.b.mp3",
          "/audios/sem10/5.c.mp3",
        ],
        speakers: [
          { nombre: "David", foto:"/img/H7.png" },
          { nombre: "Ella", foto: "/img/M7.png" },
          { nombre: "Mark", foto: "/img/H1.png" },
        ],
        preguntas: [
          { texto: "1. David would like a new bike.", correcta: false },
          { texto: "2. Ella would like new shoes.", correcta: true },
          { texto: "3. Mark doesn’t want anything.", correcta: true },
          { texto: "4. Everyone wants something.", correcta: false },
        ],
      },

      {
        audio: [
          "/audios/sem10/6.a.mp3",
          "/audios/sem10/6.b.mp3",
          "/audios/sem10/6.c.mp3",
        ],
        speakers: [
          { nombre: "Lucy", foto:"/img/M8.png" },
          { nombre: "Tom", foto: "/img/H4.png" },
          { nombre: "Anna", foto: "/img/M2.png" },
        ],
        preguntas: [
          { texto: "1. Lucy wants to watch a movie.", correcta: true },
          { texto: "2. Tom would like to read a book.", correcta: true },
          { texto: "3. Anna wants to go out.", correcta: false },
          { texto: "4. Lucy and Tom want the same thing.", correcta: false },
        ],
      },

      {
        audio: [
          "/audios/sem10/7.a.mp3",
          "/audios/sem10/7.b.mp3",
          "/audios/sem10/7.c.mp3",
        ],
        speakers: [
          { nombre: "Carlos", foto:"/img/H2.png" },
          { nombre: "Mia", foto: "/img/M4.png" },
          { nombre: "Ben", foto: "/img/H6.png" },
        ],
        preguntas: [
          { texto: "1. Carlos would like tea.", correcta: true },
          { texto: "2. Mia wants coffee.", correcta: true },
          { texto: "3. Ben wants a drink.", correcta: false },
          { texto: "4. Everyone wants coffee.", correcta: false },
        ],
      },

      {
        audio: [
          "/audios/sem10/8.a.mp3",
          "/audios/sem10/8.b.mp3",
          "/audios/sem10/8.c.mp3",
        ],
        speakers: [
          { nombre: "Ella", foto: "/img/M6.png" },
          { nombre: "Sam", foto: "/img/M1.png" },
          { nombre: "Olivia", foto: "/img/M8.png" },
        ],
        preguntas: [
          { texto: "1. Ella wants a jacket.", correcta: true },
          { texto: "2. Sam would like shoes.", correcta: true },
          { texto: "3. Olivia wants clothes.", correcta: false },
          { texto: "4. Everyone wants something new.", correcta: true },
        ],
      },

      {
        audio: [
          "/audios/sem10/9.a.mp3",
          "/audios/sem10/9.b.mp3",
          "/audios/sem10/9.c.mp3",
        ],
        speakers: [
          { nombre: "Jack", foto: "/img/H7.png" },
          { nombre: "Emma", foto: "/img/M3.png"},
          { nombre: "Noah", foto: "/img/M5.png" },
        ],
        preguntas: [
          { texto: "1. Jack would like pasta.", correcta: true },
          { texto: "2. Emma wants pasta.", correcta: false },
          { texto: "3. Noah would like pizza.", correcta: true },
          { texto: "4. Everyone wants pasta.", correcta: false },
        ],
      },

      {
        audio: [
          "/audios/sem10/10.a.mp3",
          "/audios/sem10/10.b.mp3",
          "/audios/sem10/10.c.mp3",
        ],
        speakers: [
          { nombre: "Sophie", foto: "/img/M8.png" },
          { nombre: "Ryan", foto: "/img/H2.png" },
          { nombre: "Liam", foto: "/img/H6.png" },
        ],
        preguntas: [
          { texto: "1. Sophie wants to visit her grandparents.", correcta: true },
          { texto: "2. Ryan would like to go to the beach.", correcta: true },
          { texto: "3. Liam wants to travel.", correcta: false },
          { texto: "4. Everyone wants to go somewhere.", correcta: false },
        ],
      },
    ],
    []
  );

  const actual = ejercicios[dialogIndex];
  const actualPregunta = actual.preguntas[qIndex];

  const playAudio = async () => {
    stopAudio();

    try {
      for (let i = 0; i < actual.audio.length; i++) {
        setSpeakerIndex(i);

        audioRef.current.src = actual.audio[i];
        audioRef.current.onended = null;

        await audioRef.current.play();

        await new Promise<void>((resolve) => {
          audioRef.current.onended = () => resolve();
        });
      }
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  useEffect(() => {
    stopAudio();
  }, [dialogIndex, qIndex]);

  useEffect(() => {
    return () => stopAudio();
  }, []);

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
        console.error("Error saving progress:", res.statusText);
      }
    } catch (error) {
      console.error("Progress error:", error);
    }
  };

  const verificar = () => {
    if (seleccion === null) return;

    const elegidoBool = seleccion === "True";
    if (elegidoBool === actualPregunta.correcta) {
      setRespuesta("Correct");
      setCorrectas((c) => c + 1);
    } else {
      const correctaStr = actualPregunta.correcta ? "True" : "False";
      setRespuesta(`Incorrect.\n\nCorrect answer: ${correctaStr}`);
    }
  };

  const siguiente = () => {
    stopAudio();
    setRespuesta(null);
    setSeleccion(null);

    if (qIndex + 1 < actual.preguntas.length) {
      setQIndex(qIndex + 1);
    } else {
      if (dialogIndex + 1 < ejercicios.length) {
        setDialogIndex(dialogIndex + 1);
        setQIndex(0);
      } else {
        finalizar();
      }
    }
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

  const esCorrecta = respuesta?.startsWith("Correct");

  return (
    <div className="ejercicio-container">
      {!finalizado ? (
        <>
          <header className="ejercicio-header">
            <h1 className="titulo-ejercicio">EXERCISE 3</h1>
            <p className="progreso-ejercicio">
              Question {dialogIndex * 4 + qIndex + 1} of {ejercicios.length * 4}
            </p>
          </header>

          <section
            className="tarjeta-ejercicio"
            style={{ textAlign: "center", fontSize: "1.05rem", padding: "1.5rem" }}
          >
            {dialogIndex === 0 && qIndex === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1rem" }}>
                <p className="instruccion-ejercicio">
                  Listen to each short dialogue carefully. Decide if each sentence is True or False.
                  Pay attention to what each person wants or would like.
                </p>
              </div>
            )}

{/* FOTO + NOMBRE DEL HABLANTE — SOLO EN EL PRIMER EJERCICIO */}
{qIndex === 0 && (
  <div style={{ margin: "1rem 0" }}>
    <img
      src={actual.speakers[speakerIndex].foto}
      alt={actual.speakers[speakerIndex].nombre}
      style={{ width: "140px", borderRadius: "12px", marginBottom: "0.5rem" }}
    />
    <p style={{ fontSize: "1.1rem", fontWeight: "600" }}>
      ({actual.speakers[speakerIndex].nombre})
    </p>
  </div>
)}



            {qIndex === 0 && (
              <div style={{ margin: "0.5rem 0" }}>
                <button
                  className="btn-audio"
                  style={{ fontSize: "1.6rem", padding: "0.4rem 0.8rem" }}
                  onClick={playAudio}
                >
                  🔊
                </button>
              </div>
            )}

            <div
              className="pregunta-box"
              style={{
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              <p style={{ fontSize: "1.15rem", fontWeight: 600 }}>{actualPregunta.texto}</p>

              {!respuesta && (
                <div
                  className="opciones-truefalse"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "1rem",
                    marginTop: "0.8rem",
                  }}
                >
                  <button
                    className={`opcion-btn ${seleccion === "True" ? "seleccionada" : ""}`}
                    onClick={() => setSeleccion("True")}
                    style={{ padding: "0.6rem 1.2rem", fontSize: "1.05rem" }}
                  >
                    True
                  </button>
                  <button
                    className={`opcion-btn ${seleccion === "False" ? "seleccionada" : ""}`}
                    onClick={() => setSeleccion("False")}
                    style={{ padding: "0.6rem 1.2rem", fontSize: "1.05rem" }}
                  >
                    False
                  </button>
                </div>
              )}

              {!respuesta && seleccion && (
                <div style={{ marginTop: "1rem" }}>
                  <button
                    onClick={verificar}
                    className="ejercicio-btn"
                    style={{ fontSize: "1.05rem", padding: "0.6rem 1.4rem" }}
                  >
                    Check
                  </button>
                </div>
              )}

              {respuesta && (
                <p
                  className={`respuesta-feedback ${esCorrecta ? "correcta" : "incorrecta"}`}
                  style={{
                    fontSize: "1.05rem",
                    margin: "1rem 0",
                    color: esCorrecta ? "green" : "red",
                    fontWeight: 700,
                    whiteSpace: "pre-line",
                  }}
                >
                  {respuesta}
                </p>
              )}

              {respuesta &&
                (dialogIndex * 4 + qIndex + 1) < ejercicios.length * 4 && (
                  <div style={{ marginTop: "0.6rem" }}>
                    <button
                      onClick={siguiente}
                      className="ejercicio-btn"
                      style={{ fontSize: "1.05rem", padding: "0.6rem 1.4rem" }}
                    >
                      Next
                    </button>
                  </div>
                )}

              {respuesta &&
                (dialogIndex * 4 + qIndex + 1) === ejercicios.length * 4 && (
                  <div style={{ marginTop: "0.6rem" }}>
                    <button
                      onClick={finalizar}
                      className="ejercicio-btn"
                      style={{ fontSize: "1.05rem", padding: "0.6rem 1.4rem" }}
                    >
                      Finish
                    </button>
                  </div>
                )}
            </div>
          </section>
        </>
      ) : (
        <div className="finalizado" style={{ fontSize: "1.05rem" }}>
          <h2>You have completed the exercise!</h2>
          <p>
            Correct answers:{" "}
            <strong>
              {correctas} / {ejercicios.length * 4}
            </strong>
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
