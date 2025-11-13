import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "../ejercicios.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tema1_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [inputValor, setInputValor] = useState("");
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [yaCompletado, setYaCompletado] = useState(false);

  const ejercicios = [
    {
      img: "/img/M8.png",
      audios: [
        "/audios/sem1/Tema1/emily_carter_1.mp3",
        "/audios/sem1/Tema1/emily_carter_2.mp3",
        "/audios/sem1/Tema1/emily_carter_3.mp3",
        "/audios/sem1/Tema1/emily_carter_4.mp3",
      ],
      first: "Emily",
      last: "",
      correcta: "Carter",
    },
    {
      img: "/img/H8.png",
      audios: [
        "/audios/sem1/Tema1/kevin_miller_1.mp3",
        "/audios/sem1/Tema1/kevin_miller_2.mp3",
        "/audios/sem1/Tema1/kevin_miller_3.mp3",
        "/audios/sem1/Tema1/kevin_miller_4.mp3",
        "/audios/sem1/Tema1/kevin_miller_5.mp3",
        "/audios/sem1/Tema1/kevin_miller_6.mp3",
      ],
      first: "",
      last: "Miller",
      correcta: "Kevin",
    },
    {
      img: "/img/H5.png",
      audios: [
        "/audios/sem1/Tema1/david_johnson_1.mp3",
        "/audios/sem1/Tema1/david_johnson_2.mp3",
        "/audios/sem1/Tema1/david_johnson_3.mp3",
        "/audios/sem1/Tema1/david_johnson_4.mp3",
      ],
      first: "",
      last: "Johnson",
      correcta: "David",
    },
    {
      img: "/img/H4.png",
      audios: [
        "/audios/sem1/Tema1/daniel_hughes_1.mp3",
        "/audios/sem1/Tema1/daniel_hughes_2.mp3",
        "/audios/sem1/Tema1/daniel_hughes_3.mp3",
        "/audios/sem1/Tema1/daniel_hughes_4.mp3",
      ],
      first: "Daniel",
      last: "",
      correcta: "Hughes",
    },
    {
      img: "/img/M5.png",
      audios: [
        "/audios/sem1/Tema1/emma_brown_1.mp3",
        "/audios/sem1/Tema1/emma_brown_2.mp3",
        "/audios/sem1/Tema1/emma_brown_3.mp3",
        "/audios/sem1/Tema1/emma_brown_4.mp3",
        "/audios/sem1/Tema1/emma_brown_5.mp3",
        "/audios/sem1/Tema1/emma_brown_6.mp3",
      ],
      first: "",
      last: "Brown",
      correcta: "Emma",
    },
    {
      img: "/img/H6.png",
      audios: [
        "/audios/sem1/Tema1/smith_1.mp3",
        "/audios/sem1/Tema1/smith_2.mp3",
        "/audios/sem1/Tema1/smith_3.mp3",
        "/audios/sem1/Tema1/smith_4.mp3",
      ],
      first: "",
      last: "Smith",
      correcta: "John",
    },
    {
      img: "/img/M7.png",
      audios: [
        "/audios/sem1/Tema1/anderson_1.mp3",
        "/audios/sem1/Tema1/anderson_2.mp3",
        "/audios/sem1/Tema1/anderson_3.mp3",
        "/audios/sem1/Tema1/anderson_4.mp3",
      ],
      first: "",
      last: "Fernandez",
      correcta: "Anderson",
    },
    {
      img: "/img/M2.png",
      audios: [
        "/audios/sem1/Tema1/chloe_adams_1.mp3",
        "/audios/sem1/Tema1/chloe_adams_2.mp3",
        "/audios/sem1/Tema1/chloe_adams_3.mp3",
        "/audios/sem1/Tema1/chloe_adams_4.mp3",
        "/audios/sem1/Tema1/chloe_adams_5.mp3",
        "/audios/sem1/Tema1/chloe_adams_6.mp3",
      ],
      first: "",
      last: "Adams",
      correcta: "Chloe",
    },
    {
      img: "/img/M4.png",
      audios: [
        "/audios/sem1/Tema1/brown_1.mp3",
        "/audios/sem1/Tema1/brown_2.mp3",
        "/audios/sem1/Tema1/brown_3.mp3",
        "/audios/sem1/Tema1/brown_4.mp3",
      ],
      first: "",
      last: "James",
      correcta: "Brown",
    },
    {
      img: "/img/H1.png",
      audios: [
        "/audios/sem1/Tema1/brian_scott_1.mp3",
        "/audios/sem1/Tema1/brian_scott_2.mp3",
        "/audios/sem1/Tema1/brian_scott_3.mp3",
        "/audios/sem1/Tema1/brian_scott_4.mp3",
        "/audios/sem1/Tema1/brian_scott_5.mp3",
        "/audios/sem1/Tema1/brian_scott_6.mp3",
      ],
      first: "",
      last: "Scott",
      correcta: "Brian",
    },
  ];

  const actual = ejercicios[index];
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  useEffect(() => {
    const checkProgreso = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/progreso/${nivel}/${semana}/${tema}/${ejercicio}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.completado) setYaCompletado(true);
        }
      } catch (error) {
        console.error("Error al consultar progreso:", error);
      }
    };
    checkProgreso();
  }, [API_URL, nivel, semana, tema, ejercicio]);

  const guardarProgreso = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/progreso`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nivel, semana, tema, ejercicio }),
      });
      if (res.ok) {
        const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
        if (!completados.includes(id)) {
          completados.push(id);
          localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
        }
      }
    } catch (error) {
      console.error("Error al guardar el progreso:", error);
    }
  };

  const playSequence = () => {
    audioRefs.current.forEach((audio, i) => {
      if (audio) {
        audio.onended = () => {
          if (i + 1 < audioRefs.current.length && audioRefs.current[i + 1]) {
            setTimeout(() => audioRefs.current[i + 1]?.play(), 800);
          }
        };
      }
    });
    audioRefs.current[0]?.play();
  };

  const verificar = () => {
    const respuestaUsuario = inputValor.trim().toLowerCase();
    if (!respuestaUsuario) return;

    if (respuestaUsuario === actual.correcta.toLowerCase()) {
      setRespuesta("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("Incorrect");
    }
  };

  const siguiente = () => {
    setInputValor("");
    setRespuesta(null);
    setIndex(index + 1);
  };

  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => navigate(`/inicio/${nivel}`), 3000);
  };

  if (yaCompletado) {
    return (
      <div className="finalizado">
        <h2>You have already completed this exercise.</h2>
        <p>You cannot answer it again.</p>
        <button onClick={() => navigate(`/inicio/${nivel}`)} className="ejercicio-btn">
          Go back to level start
        </button>
      </div>
    );
  }

  if (finalizado) {
    return (
      <div className="finalizado">
        <h2>You have completed the exercise!</h2>
        <p>
          Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
        </p>
        <p>Redirecting to the start of the level...</p>
      </div>
    );
  }

  return (
    <div className="ejercicio-container horizontal-layout">
      <header className="ejercicio-header">
        <h1 className="titulo-ejercicio">EXERCISE 1</h1>
        <p className="progreso-ejercicio">
          Question {index + 1} of {ejercicios.length}
        </p>
      </header>

      <section className="tarjeta-ejercicio form-style horizontal-card">
        {index === 0 && (
          <div className="instruccion-box instrucciones-actividad">
            Listen to the conversation and complete the missing name.
          </div>
        )}

        <div className="contenido-horizontal">
          <div className="imagen-audio">
            <img src={actual.img} alt="personajes" className="ejercicio-img" />
            <button className="btn-audio" onClick={playSequence}>🔊</button>
            {actual.audios.map((src, i) => (
              <audio key={i} ref={(el) => (audioRefs.current[i] = el)} src={src} />
            ))}
          </div>

          <div className="formulario-ejercicio">
            {actual.first ? (
              <p>First name: <span className="dato-fijo">{actual.first}</span></p>
            ) : (
              <p>
                First name:{" "}
                {respuesta ? (
                  <span className="dato-fijo">{actual.correcta}</span>
                ) : (
                  <input
                    type="text"
                    className="input-respuesta"
                    value={inputValor}
                    onChange={(e) => setInputValor(e.target.value)}
                  />
                )}
              </p>
            )}

            {actual.last ? (
              <p>Last name: <span className="dato-fijo">{actual.last}</span></p>
            ) : (
              <p>
                Last name:{" "}
                {respuesta ? (
                  <span className="dato-fijo">{actual.correcta}</span>
                ) : (
                  <input
                    type="text"
                    className="input-respuesta"
                    value={inputValor}
                    onChange={(e) => setInputValor(e.target.value)}
                  />
                )}
              </p>
            )}
          </div>
        </div>

        {respuesta && (
          <p
            className="respuesta-feedback"
            style={{
              color: respuesta === "Correct" ? "#28A745" : "#DC3545",
              fontWeight: "bold",
              fontSize: "1.2rem",
              marginTop: "1rem",
            }}
          >
            {respuesta}
          </p>
        )}

        <div className="botones-siguiente">
          {!respuesta && (
            <button onClick={verificar} className="ejercicio-btn">
              Check
            </button>
          )}

          {respuesta && index < ejercicios.length - 1 && (
            <button onClick={siguiente} className="ejercicio-btn">
              Next question
            </button>
          )}

          {respuesta && index === ejercicios.length - 1 && (
            <button onClick={manejarFinalizacion} className="ejercicio-btn">
              Finish
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
