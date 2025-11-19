import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "../ejercicios.css";

export default function Tema3_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const audioRefs = useRef<HTMLAudioElement[]>([]);

  useEffect(() => {
    audioRefs.current.forEach((a) => a?.load());
  }, [index]);

  const playAudios = () => {
    const audios = audioRefs.current;
    if (!audios[0]) return;

    let i = 0;

    const reproducir = () => {
      if (!audios[i]) return;
      audios[i].currentTime = 0;
      audios[i].play();

      audios[i].onended = () => {
        i++;
        if (i < audios.length) {
          setTimeout(reproducir, 300);
        }
      };
    };

    reproducir();
  };

  // ***********************
  //     EJERCICIOS
  // ***********************
  const ejercicios = [
    {
      audios: [
        "/audios/can/1_a.mp3",
        "/audios/can/1_b.mp3",
        "/audios/can/1_c.mp3",
        "/audios/can/1_d.mp3"
      ],
      texto: "Can Max swim?",
      correcta: ["yes, he can"],
    },
    {
      audios: [
        "/audios/can/2_a.mp3",
        "/audios/can/2_b.mp3",
        "/audios/can/2_c.mp3",
        "/audios/can/2_d.mp3"
      ],
      texto: "Can Anna go to the party?",
      correcta: ["no, she can't"],
    },
    {
      audios: [
        "/audios/can/3_a.mp3",
        "/audios/can/3_b.mp3",
        "/audios/can/3_c.mp3"
      ],
      texto: "Can the students use the computers now?",
      correcta: ["no, they can't"],
    },
    {
      audios: [
        "/audios/can/4_a.mp3",
        "/audios/can/4_b.mp3",
        "/audios/can/4_c.mp3"
      ],
      texto: "Can Carlos eat meat?",
      correcta: ["no, he can't"],
    },
    {
      audios: [
        "/audios/can/5_a.mp3",
        "/audios/can/5_b.mp3",
        "/audios/can/5_c.mp3"
      ],
      texto: "Can they park there?",
      correcta: ["no, they can't"],
    },
    {
      audios: [
        "/audios/can/6_a.mp3",
        "/audios/can/6_b.mp3",
        "/audios/can/6_c.mp3"
      ],
      texto: "Can Sara borrow Ben’s pen?",
      correcta: ["yes, she can"],
    },
    {
      audios: [
        "/audios/can/7_a.mp3",
        "/audios/can/7_b.mp3",
        "/audios/can/7_c.mp3"
      ],
      texto: "Can Leo’s dog climb trees?",
      correcta: ["no, it can't"],
    },
    {
      audios: [
        "/audios/can/8_a.mp3",
        "/audios/can/8_b.mp3",
        "/audios/can/8_c.mp3"
      ],
      texto: "Can Maria speak German?",
      correcta: ["no, she can't"],
    },
    {
      audios: [
        "/audios/can/9_a.mp3",
        "/audios/can/9_b.mp3",
        "/audios/can/9_c.mp3"
      ],
      texto: "Can Ella open the window?",
      correcta: ["yes, she can"],
    },
    {
      audios: [
        "/audios/can/10_a.mp3",
        "/audios/can/10_b.mp3",
        "/audios/can/10_c.mp3"
      ],
      texto: "Can Tim lift the box alone?",
      correcta: ["no, he can't"],
    },
  ];

  const actual = ejercicios[index];

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
      console.error(error);
    }
  };

  const verificar = () => {
    const r = inputValue.trim().toLowerCase();
    if (!r) return;

    const esCorrecta = actual.correcta.some((c) => c === r);

    if (esCorrecta) {
      setRespuesta("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("Incorrect");
      setInputValue(actual.correcta[0]);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setInputValue("");
    setIndex(index + 1);
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
              Conversation {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
            {index === 0 && (
              <div className="instruccion-box">
                <p className="instruccion-ejercicio">
                  Listen to each conversation and answer the question using <strong>can</strong> or <strong>can't</strong>.
                </p>
              </div>
            )}

            {/* AUDIOS */}
            {actual.audios.map((src, i) => (
              <audio
                key={`${index}-${i}`}
                ref={(el) => (audioRefs.current[i] = el!)}
                src={src}
                preload="auto"
              />
            ))}

            <div style={{ margin: "1rem 0" }}>
              <button
                onClick={playAudios}
                className="btn-audio"
                style={{ fontSize: "1.8rem", padding: "0.6rem 1rem" }}
              >
                🔊
              </button>
            </div>

            <p className="pregunta-ejercicio" style={{ fontSize: "1.5rem", fontWeight: 500 }}>
              {actual.texto}
            </p>

            {!respuesta && (
              <div style={{ margin: "1.5rem 0", display: "flex", gap: "1rem", justifyContent: "center" }}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder='Write your answer (e.g. "Yes, he can")'
                  style={{ fontSize: "1.3rem", padding: "0.8rem 1rem", borderRadius: "8px" }}
                />

                <button onClick={verificar} className="ejercicio-btn">
                  Check
                </button>
              </div>
            )}

            {respuesta && (
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: respuesta === "Correct" ? "#28A745" : "#DC3545",
                }}
              >
                {respuesta}
              </p>
            )}

            {respuesta && index < ejercicios.length - 1 && (
              <button onClick={siguiente} className="ejercicio-btn">
                Next conversation
              </button>
            )}

            {respuesta && index === ejercicios.length - 1 && (
              <button onClick={manejarFinalizacion} className="ejercicio-btn">
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
