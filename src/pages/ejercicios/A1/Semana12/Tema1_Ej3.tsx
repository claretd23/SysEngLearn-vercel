import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
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

  const [respuestas, setRespuestas] = useState<(boolean | null)[]>(Array(5).fill(null));
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [index, setIndex] = useState(0);

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
  const [isPlaying, setIsPlaying] = useState(false);

  // 🔊 Reproducir conversación completa
  const reproducirAudio = () => {
    if (!audioRef.current) return;

    setIsPlaying(true);
    const audios = actual.audios;

    const playSequential = (i: number) => {
      if (!audioRef.current) return;

      audioRef.current.src = audios[i];
      audioRef.current.play();

      audioRef.current.onended = () => {
        if (i + 1 < audios.length) {
          playSequential(i + 1); // siguiente audio
        } else {
          setIsPlaying(false);
        }
      };
    };

    playSequential(0);
  };

  //  Detener audio cuando se cambia de ejercicio o se sale
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [index]); // cada vez que cambia el ejercicio

  useEffect(() => {
    return () => {
      // cleanup al salir del componente
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const toggleRespuesta = (i: number, valor: boolean) => {
    const nuevas = [...respuestas];
    nuevas[i] = valor;
    setRespuestas(nuevas);
  };

  const verificar = () => {
    let correctasActual = 0;

    respuestas.forEach((r, i) => {
      if (r === actual.preguntas[i].correcta) correctasActual++;
    });

    setCorrectas((prev) => prev + correctasActual);
    setFinalizado(true);
  };

  const siguiente = () => {
    setRespuestas(Array(5).fill(null));
    setAudioIndex(0);
    setFinalizado(false);

    if (index + 1 < ejercicios.length) {
      setIndex(index + 1);
    } else {
      finalizar();
    }
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nivel, semana, tema, ejercicio }),
      });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const finalizar = async () => {
    await guardarProgreso();

    setTimeout(() => {
      navigate(`/inicio/${nivel}`);
      window.location.reload();
    }, 3000);
  };

  return (
    <div className="ejercicio-container">
      <header className="ejercicio-header">
        <h1 className="titulo-ejercicio">EXERCISE 3</h1>

        <p className="progreso-ejercicio">
          Question {index + 1} of {ejercicios.length}
        </p>
      </header>

      <section className="tarjeta-ejercicio" style={{ textAlign: "center", padding: "2rem" }}>
        <p className="instruccion-ejercicio">
          Listen carefully to each dialogue. Mark each statement as True (T) or False (F).
        </p>

        {/* AUDIO */}
        <audio ref={audioRef} />
        <button
          className="btn-audio"
          style={{ fontWeight: "bold", fontSize: "1.5rem", margin: "1rem 0" }}
          onClick={reproducirAudio}
          disabled={isPlaying}
        >
          🔊
        </button>

        {/* PREGUNTAS */}
        <div className="oracion-box" style={{ margin: "1rem auto", maxWidth: "600px" }}>
          {actual.preguntas.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.8rem",
              }}
            >
              <span>{p.texto}</span>

              {!finalizado ? (
                <div>
                  <button
                    onClick={() => toggleRespuesta(i, true)}
                    style={{
                      backgroundColor: respuestas[i] === true ? "#bcd03c" : "#f4f4f4",
                      marginRight: "0.5rem",
                      padding: "0.3rem 0.8rem",
                    }}
                  >
                    T
                  </button>

                  <button
                    onClick={() => toggleRespuesta(i, false)}
                    style={{
                      backgroundColor: respuestas[i] === false ? "#bcd03c" : "#f4f4f4",
                      padding: "0.3rem 0.8rem",
                    }}
                  >
                    F
                  </button>
                </div>
              ) : (
                <span
                  style={{
                    fontWeight: "bold",
                    color: respuestas[i] === p.correcta ? "green" : "red",
                  }}
                >
                  {p.correcta ? "True" : "False"}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* CHECK */}
        {!finalizado && (
          <button
            onClick={verificar}
            className="ejercicio-btn"
            style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", marginTop: "1rem" }}
          >
            Check
          </button>
        )}

        {/* NEXT */}
        {finalizado && index < ejercicios.length - 1 && (
          <button
            onClick={siguiente}
            className="ejercicio-btn"
            style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", marginTop: "1rem" }}
          >
            Next exercise
          </button>
        )}

        {/* FINAL */}
        {finalizado && index === ejercicios.length - 1 && (
          <div style={{ marginTop: "1rem" }}>
            <h2>You have completed the exercise!</h2>
            <p>
              Correct statements:{" "}
              <strong>{correctas} / {ejercicios.length * 5}</strong>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}