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

  const [respuestas, setRespuestas] = useState<(boolean | null)[]>([]);
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

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
    ],
    []
  );

  const actual = ejercicios[index];

  // --- AUDIO ---
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const reproducirSecuencia = () => {
    if (!audioRef.current) return;

    let i = 0;

    const reproducir = () => {
      audioRef.current!.src = actual.audios[i];
      audioRef.current!.play();

      audioRef.current!.onended = () => {
        i++;
        if (i < actual.audios.length) {
          reproducir();
        }
      };
    };

    reproducir();
  };

  // --- RESPUESTAS ---
  useEffect(() => {
    setRespuestas(Array(actual.preguntas.length).fill(null));
  }, [index]);

  const toggleRespuesta = (i: number, valor: boolean) => {
    const nuevas = [...respuestas];
    nuevas[i] = valor;
    setRespuestas(nuevas);
  };

  const verificar = () => {
    let total = 0;

    actual.preguntas.forEach((p, i) => {
      if (respuestas[i] === p.correcta) total++;
    });

    setCorrectas(total);
    setFinalizado(true);
  };

  const siguiente = () => {
    if (index + 1 < ejercicios.length) {
      setIndex(index + 1);
      setFinalizado(false);
    } else {
      setFinalizado(true);
    }
  };

  return (
    <div className="ejercicio-container">
      {!finalizado || index < ejercicios.length ? (
        <>
          <header className="ejercicio-header">
            <h1 className="titulo-ejercicio">EXERCISE 3</h1>
            <p className="progreso-ejercicio">
              Question {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section className="tarjeta-ejercicio" style={{ textAlign: "center", padding: "2rem" }}>
            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
                <p className="instruccion-ejercicio">
                  Listen carefully to each dialogue. Mark each statement as True (T) or False (F).
                </p>
              </div>
            )}

            <button
              className="btn-audio"
              style={{ fontWeight: "bold", fontSize: "1.5rem", margin: "1rem 0" }}
              onClick={reproducirSecuencia}
            >
              🔊
            </button>

            <audio ref={audioRef} />

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

            {!finalizado && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                style={{ fontSize: "1.3rem", padding: "0.8rem 2rem" }}
              >
                Check
              </button>
            )}

            {finalizado && index < ejercicios.length - 1 && (
              <button
                onClick={siguiente}
                className="ejercicio-btn"
                style={{ fontSize: "1.3rem", padding: "0.8rem 2rem" }}
              >
                Next exercise
              </button>
            )}

            {finalizado && index === ejercicios.length - 1 && (
              <div style={{ marginTop: "1rem" }}>
                <h2>You have completed the exercise!</h2>
                <p>
                  Correct statements:{" "}
                  <strong>
                    {correctas} / {actual.preguntas.length}
                  </strong>
                </p>
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
