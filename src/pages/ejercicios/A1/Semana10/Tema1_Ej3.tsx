import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
import "../ejercicios.css";

interface PreguntaTF {
  texto: string;
  correcta: boolean;
}

interface EjercicioTF {
  audio: string[];
  dialogo: string;
  preguntas: PreguntaTF[]; // 4 preguntas por diálogo
}

export default function Tema1_Ej3TrueFalse() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [seleccion, setSeleccion] = useState<string | null>(null); // "True" | "False"
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [dialogIndex, setDialogIndex] = useState(0); // 0..9 (10 diálogos)
  const [qIndex, setQIndex] = useState(0); // 0..3 (4 preguntas por diálogo)
  const [finalizado, setFinalizado] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const audioRef = useRef<HTMLAudioElement>(new Audio());

  const stopAudio = () => {
    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
    } catch (e) {
      /* ignore */
    }
  };

  const ejercicios: EjercicioTF[] = useMemo(
    () => [
      {
        // Dialogue 1
        audio: [
          "/audios/sem10/1.a.mp3",
          "/audios/sem10/1.b.mp3",
          "/audios/sem10/1.c.mp3",
        ],
        dialogo:
          "Emma: I want a new phone.\nTom: I don’t want a phone. I’d like a tablet.\nLisa: I’d like new headphones.",
        preguntas: [
          { texto: "1. Emma wants a new phone.", correcta: true },
          { texto: "2. Tom wants a phone.", correcta: false },
          { texto: "3. Lisa would like a new computer.", correcta: false },
          { texto: "4. Tom would like a tablet.", correcta: true },
        ],
      },
      {
        // Dialogue 2
        audio: [
          "/audios/sem10/2.a.mp3",
          "/audios/sem10/2.b.mp3",
          "/audios/sem10/2.c.mp3",
        ],
        dialogo:
          "Ben: I’d like some coffee, please.\nSophie: I want orange juice.\nLiam: I don’t want a drink, thanks.",
        preguntas: [
          { texto: "5. Ben would like coffee.", correcta: true },
          { texto: "6. Sophie wants orange juice.", correcta: true },
          { texto: "7. Liam would like a drink.", correcta: false },
          { texto: "8. Everyone wants something to drink.", correcta: false },
        ],
      },
      {
        // Dialogue 3
        audio: [
          "/audios/sem10/3.a.mp3",
          "/audios/sem10/3.b.mp3",
          "/audios/sem10/3.c.mp3",
        ],
        dialogo:
          "Nina: I’d like to go to the park.\nAlex: I want to stay home.\nEva: I’d like to go with Nina.",
        preguntas: [
          { texto: "9. Nina wants to go to the park.", correcta: true },
          { texto: "10. Alex wants to go with Nina.", correcta: false },
          { texto: "11. Eva would like to go to the park.", correcta: true },
          { texto: "12. Everyone wants to stay home.", correcta: false },
        ],
      },
      {
        // Dialogue 4
        audio: [
          "/audios/sem10/4.a.mp3",
          "/audios/sem10/4.b.mp3",
          "/audios/sem10/4.c.mp3",
        ],
        dialogo:
          "Jack: I’d like a pizza.\nMaria: I want a salad.\nLeo: I don’t want anything right now.",
        preguntas: [
          { texto: "13. Jack would like pizza.", correcta: true },
          { texto: "14. Maria wants a pizza.", correcta: false },
          { texto: "15. Leo wants to eat something.", correcta: false },
          { texto: "16. Maria wants a salad.", correcta: true },
        ],
      },
      {
        // Dialogue 5
        audio: [
          "/audios/sem10/5.a.mp3",
          "/audios/sem10/5.b.mp3",
          "/audios/sem10/5.c.mp3",
        ],
        dialogo:
          "David: I want a new bike.\nElla: I’d like new shoes.\nMark: I don’t want anything for now.",
        preguntas: [
          { texto: "17. David would like a new bike.", correcta: false },
          { texto: "18. Ella would like new shoes.", correcta: true },
          { texto: "19. Mark doesn’t want anything.", correcta: true },
          { texto: "20. Everyone wants something.", correcta: false },
        ],
      },
      {
        // Dialogue 6
        audio: [
          "/audios/sem10/6.a.mp3",
          "/audios/sem10/6.b.mp3",
          "/audios/sem10/6.c.mp3",
        ],
        dialogo:
          "Lucy: I want to watch a movie tonight.\nTom: I’d like to read a book.\nAnna: I don’t want to do anything.",
        preguntas: [
          { texto: "21. Lucy wants to watch a movie.", correcta: true },
          { texto: "22. Tom would like to read a book.", correcta: true },
          { texto: "23. Anna wants to go out.", correcta: false },
          { texto: "24. Lucy and Tom want the same thing.", correcta: false },
        ],
      },
      {
        // Dialogue 7
        audio: [
          "/audios/sem10/7.a.mp3",
          "/audios/sem10/7.b.mp3",
          "/audios/sem10/7.c.mp3",
        ],
        dialogo:
          "Carlos: I’d like a cup of tea.\nMia: I want a cup of coffee.\nBen: I don’t want a drink.",
        preguntas: [
          { texto: "25. Carlos would like tea.", correcta: true },
          { texto: "26. Mia wants coffee.", correcta: true },
          { texto: "27. Ben wants a drink.", correcta: false },
          { texto: "28. Everyone wants coffee.", correcta: false },
        ],
      },
      {
        // Dialogue 8
        audio: [
          "/audios/sem10/8.a.mp3",
          "/audios/sem10/8.b.mp3",
          "/audios/sem10/8.c.mp3",
        ],
        dialogo:
          "Ella: I want to buy a new jacket.\nSam: I’d like some new shoes.\nOlivia: I don’t want clothes, I want a bag.",
        preguntas: [
          { texto: "29. Ella wants a jacket.", correcta: true },
          { texto: "30. Sam would like shoes.", correcta: true },
          { texto: "31. Olivia wants clothes.", correcta: false },
          { texto: "32. Everyone wants something new.", correcta: true },
        ],
      },
      {
        // Dialogue 9
        audio: [
          "/audios/sem10/9.a.mp3",
          "/audios/sem10/9.b.mp3",
          "/audios/sem10/9.c.mp3",
        ],
        dialogo:
          "Jack: I’d like to eat pasta.\nEmma: I don’t want pasta, I want rice.\nNoah: I’d like pizza, please.",
        preguntas: [
          { texto: "33. Jack would like pasta.", correcta: true },
          { texto: "34. Emma wants pasta.", correcta: false },
          { texto: "35. Noah would like pizza.", correcta: true },
          { texto: "36. Everyone wants pasta.", correcta: false },
        ],
      },
      {
        // Dialogue 10
        audio: [
          "/audios/sem10/10.a.mp3",
          "/audios/sem10/10.b.mp3",
          "/audios/sem10/10.c.mp3",
        ],
        dialogo:
          "Sophie: I want to visit my grandparents this weekend.\nRyan: I’d like to go to the beach.\nLiam: I don’t want to travel.",
        preguntas: [
          { texto: "37. Sophie wants to visit her grandparents.", correcta: true },
          { texto: "38. Ryan would like to go to the beach.", correcta: true },
          { texto: "39. Liam wants to travel.", correcta: false },
          { texto: "40. Everyone wants to go somewhere.", correcta: false },
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
      for (let src of actual.audio) {
        audioRef.current.src = src;
        // Important: remove previous onended to avoid multiple resolves
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

  // stop audio when dialog or question changes
  useEffect(() => {
    stopAudio();
    // reset selection/response when moving to new dialog/question if you want:
    // but we already control reset on next
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogIndex, qIndex]);

  // stop audio on unmount
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
      // pasar al siguiente diálogo
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
            <h1 className="titulo-ejercicio">EXERCISE 3 — TRUE / FALSE</h1>
            <p className="progreso-ejercicio">
              Question {dialogIndex * 4 + qIndex + 1} of {ejercicios.length * 4}
            </p>
          </header>

          <section
            className="tarjeta-ejercicio"
            style={{ textAlign: "center", fontSize: "1.05rem", padding: "1.5rem" }}
          >
            {/* Instructions shown once */}
            {dialogIndex === 0 && qIndex === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1rem" }}>
                <p className="instruccion-ejercicio">
                  Listen to each short dialogue carefully. Decide if each sentence is True or False.
                  Pay attention to what each person wants or would like.
                </p>
              </div>
            )}

            <div style={{ margin: "0.5rem 0" }}>
              <button
                className="btn-audio"
                style={{ fontSize: "1.6rem", padding: "0.4rem 0.8rem" }}
                onClick={playAudio}
              >
                🔊 Play dialogue
              </button>
            </div>

            <div
              className="dialogo-box"
              style={{
                backgroundColor: "#f4f6fa",
                borderLeft: "5px solid #222a5c",
                borderRadius: "8px",
                padding: "1rem",
                margin: "0.8rem auto",
                maxWidth: "720px",
                textAlign: "left",
                whiteSpace: "pre-line",
                fontStyle: "italic",
              }}
            >
              {/* show the dialogue as guide */}
              <strong>Dialogue {dialogIndex + 1}</strong>
              <p style={{ marginTop: "0.5rem" }}>{actual.dialogo}</p>
            </div>

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

              {respuesta && (dialogIndex * 4 + qIndex + 1) < ejercicios.length * 4 && (
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

              {respuesta && (dialogIndex * 4 + qIndex + 1) === ejercicios.length * 4 && (
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
