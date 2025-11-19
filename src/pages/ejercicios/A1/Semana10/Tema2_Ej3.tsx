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

export default function Tema2_Ej3() {
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

  // NUEVAS PREGUNTAS Y DIÁLOGOS AÑADIDOS
  const ejercicios: EjercicioTF[] = useMemo(
    () => [
      {
      audio: [
        "/audios/sem10/11.a.mp3", // Anna
        "/audios/sem10/11.b.mp3", // Tom
        "/audios/sem10/11.c.mp3", // Anna
        "/audios/sem10/11.d.mp3", // Tom
      ],
      speakers: [
        { nombre: "Anna", foto: "/img/M1.png" },
        { nombre: "Tom", foto: "/img/H1.png" },
      ],
      preguntas: [
        { texto: "1. Tom is watching a movie.", correcta: true },
        { texto: "2. Anna is cooking spaghetti.", correcta: true },
        { texto: "3. Tom is cooking.", correcta: false },
        { texto: "4. Anna is watching TV.", correcta: false },
      ],
    },

    // EJE 2 - Ben y Mia
    {
      audio: [
        "/audios/sem10/12.a.mp3", // Ben
        "/audios/sem10/12.b.mp3", // Mia
        "/audios/sem10/12.c.mp3", // Ben
      ],
      speakers: [
        { nombre: "Ben", foto: "/img/H2.png" },
        { nombre: "Mia", foto: "/img/M2.png" },
      ],
      preguntas: [
        { texto: "1. Mia is studying.", correcta: true },
        { texto: "2. Her brother is studying too.", correcta: false },
        { texto: "3. Ben is playing video games.", correcta: false },
        { texto: "4. Mia’s brother is playing.", correcta: true },
      ],
    },

    // EJE 3 - Mom y Jake
    {
      audio: [
        "/audios/sem10/13.a.mp3", // Mom
        "/audios/sem10/13.b.mp3", // Jake
        "/audios/sem10/13.c.mp3", // Mom
        "/audios/sem10/13.d.mp3", // Jake
      ],
      speakers: [
        { nombre: "Mom", foto: "/img/M3.png" },
        { nombre: "Jake", foto: "/img/H3.png" },
      ],
      preguntas: [
        { texto: "1. Jake is eating breakfast.", correcta: true },
        { texto: "2. Jake is drinking milk.", correcta: false },
        { texto: "3. Jake is drinking orange juice.", correcta: true },
        { texto: "4. Jake isn’t eating anything.", correcta: false },
      ],
    },

    // EJE 4 - Lisa y Alex
    {
      audio: [
        "/audios/sem10/14.a.mp3", // Lisa
        "/audios/sem10/14.b.mp3", // Alex
        "/audios/sem10/14.c.mp3", // Lisa
      ],
      speakers: [
        { nombre: "Lisa", foto: "/img/M4.png" },
        { nombre: "Alex", foto: "/img/H4.png" },
      ],
      preguntas: [
        { texto: "1. The kids are running.", correcta: true },
        { texto: "2. The dog is sleeping.", correcta: false },
        { texto: "3. Lisa is taking a picture.", correcta: true },
        { texto: "4. Everyone is at the park.", correcta: true },
      ],
    },// EJE 5 - Sofia y Daniel
{
  audio: [
    "/audios/sem10/15.a.mp3", // Sofia
    "/audios/sem10/15.b.mp3", // Daniel
    "/audios/sem10/15.c.mp3", // Sofia
  ],
  speakers: [
    { nombre: "Sofia", foto: "/img/M5.png" },
    { nombre: "Daniel", foto: "/img/H5.png" }
  ],
  preguntas: [
    { texto: "1. Sofia wants a hot chocolate.", correcta: true },
    { texto: "2. Daniel wants a hot chocolate.", correcta: false },
    { texto: "3. Daniel wants a coffee.", correcta: true },
    { texto: "4. Sofia wants a coffee.", correcta: false }
  ]
},

// EJE 6 - Olivia y Mark
{
  audio: [
    "/audios/sem10/16.a.mp3", // Olivia
    "/audios/sem10/16.b.mp3", // Mark
    "/audios/sem10/16.c.mp3", // Olivia
  ],
  speakers: [
    { nombre: "Olivia", foto: "/img/M6.png" },
    { nombre: "Mark", foto: "/img/H6.png" }
  ],
  preguntas: [
    { texto: "1. Olivia wants to read a book.", correcta: true },
    { texto: "2. Mark wants to read a book too.", correcta: false },
    { texto: "3. Mark wants to watch a movie.", correcta: true },
    { texto: "4. Olivia wants to watch a movie.", correcta: false }
  ]
},

// EJE 7 - Emma y Chris
{
  audio: [
    "/audios/sem10/17.a.mp3", // Emma
    "/audios/sem10/17.b.mp3", // Chris
    "/audios/sem10/17.c.mp3", // Emma
  ],
  speakers: [
    { nombre: "Emma", foto: "/img/M7.png" },
    { nombre: "Chris", foto: "/img/H7.png" }
  ],
  preguntas: [
    { texto: "1. Emma wants to go shopping.", correcta: true },
    { texto: "2. Chris wants to go shopping too.", correcta: false },
    { texto: "3. Chris wants to play basketball.", correcta: true },
    { texto: "4. Emma wants to play basketball.", correcta: false }
  ]
},

// EJE 8 - Nina y Leo
{
  audio: [
    "/audios/sem10/18.a.mp3", // Nina
    "/audios/sem10/18.b.mp3", // Leo
    "/audios/sem10/18.c.mp3", // Nina
  ],
  speakers: [
    { nombre: "Nina", foto: "/img/M5.png" },
    { nombre: "Leo", foto: "/img/H1.png" }
  ],
  preguntas: [
    { texto: "1. Nina wants to buy a gift.", correcta: true },
    { texto: "2. Leo wants to buy a gift too.", correcta: false },
    { texto: "3. Leo wants to buy a book.", correcta: true },
    { texto: "4. Nina wants to buy a book.", correcta: false }
  ]
},

// EJE 9 - Paula y Kevin
{
  audio: [
    "/audios/sem10/19.a.mp3", // Paula
    "/audios/sem10/19.b.mp3", // Kevin
    "/audios/sem10/19.c.mp3", // Paula
  ],
  speakers: [
    { nombre: "Paula", foto: "/img/M2.png" },
    { nombre: "Kevin", foto: "/img/H6.png" }
  ],
  preguntas: [
    { texto: "1. Paula wants a salad.", correcta: true },
    { texto: "2. Kevin wants a salad too.", correcta: false },
    { texto: "3. Kevin wants pizza.", correcta: true },
    { texto: "4. Paula wants pizza.", correcta: false }
  ]
},

// EJE 10 - Lily y Adam
{
  audio: [
    "/audios/sem10/20.a.mp3", // Lily
    "/audios/sem10/20.b.mp3", // Adam
    "/audios/sem10/20.c.mp3", // Lily
  ],
  speakers: [
    { nombre: "Lily", foto: "/img/M3.png" },
    { nombre: "Adam", foto: "/img/H4.png" }
  ],
  preguntas: [
    { texto: "1. Lily wants to practice soccer.", correcta: true },
    { texto: "2. Adam wants to practice soccer too.", correcta: false },
    { texto: "3. Adam wants to rest.", correcta: true },
    { texto: "4. Lily wants to rest.", correcta: false }
  ]
},
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
                  Listen to the short dialogues. Decide if each sentence is True or False according to what you hear.
                </p>
              </div>
            )}

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

            <div className="pregunta-box" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
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
                  className={`respuesta-feedback ${
                    esCorrecta ? "correcta" : "incorrecta"
                  }`}
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
