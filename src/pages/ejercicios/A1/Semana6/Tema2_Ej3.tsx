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
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  // ⚠️ RESETEAR LOS AUDIOS CADA VEZ QUE CAMBIA LA PREGUNTA
  useEffect(() => {
    audioRefs.current = [];
  }, [index]);

  // FUNCION DE AUDIO
  const playAudios = () => {
    const audios = audioRefs.current;
    if (!audios[0]) return;

    audios[0].load();
    audios[0].play();

    audios[0].onended = () => {
      if (audios[1]) {
        audios[1].load();
        setTimeout(() => audios[1]?.play(), 400);
      }
    };
  };

  const ejercicios = [
    {
      audios: ["/audios/sem6/1_a.mp3", "/audios/sem3/1_b.mp3", "/audios/sem6/1_c.mp3", "/audios/sem6/1_d.mp3", "/audios/sem6/1_e.mp3"],
      texto: "After 100 metres, ________ right.",
      correcta: ["turn"],
    },
    {
      audios: ["/audios/sem6/2_a.mp3", "/audios/sem6/2_b.mp3"],
      texto: "Please, ________ your books on page 10.",
      correcta: ["open"],
    },
    {
      audios: ["/audios/sem6/3_a.mp3", "/audios/sem6/3_b.mp3"],
      texto: "________ so close to the fire.",
      correcta: ["don't stand"],
    },
    {
      audios: ["/audios/sem6/4_a.mp3", "/audios/sem6/4_b.mp3"],
      texto: "________ faster, we’re almost there!",
      correcta: ["run"],
    },
    {
      audios: ["/audios/sem6/5_a.mp3", "/audios/sem6/5_b.mp3"],
      texto: "________ this medicine twice a day.",
      correcta: ["take"],
    },
    {
      audios: ["/audios/sem6/6_a.mp3", "/audios/sem6/6_b.mp3"],
      texto: "________ here, please.",
      correcta: ["stop"],
    },
    {
      audios: ["/audios/sem6/7_a.mp3", "/audios/sem6/7_b.mp3"],
      texto: "________ your hands before eating.",
      correcta: ["wash"],
    },
    {
      audios: ["/audios/sem6/8_a.mp3", "/audios/sem6/8_b.mp3"],
      texto: "________ attention, everyone.",
      correcta: ["pay"],
    },
    {
      audios: ["/audios/sem6/9_a.mp3", "/audios/sem6/9_b.mp3"],
      texto: "________ pictures inside the museum, please.",
      correcta: ["don't take"],
    },
    {
      audios: ["/audios/sem6/10_a.mp3", "/audios/sem6/10_b.mp3"],
      texto: "________ louder!",
      correcta: ["speak"],
    },
  ];

  const actual = ejercicios[index];

  // GUARDAR PROGRESO
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

      if (!res.ok) console.error("Error al guardar progreso:", res.statusText);
    } catch (error) {
      console.error("Error al guardar el progreso:", error);
    }
  };

  // VERIFICAR RESPUESTA
  const verificar = () => {
    const respuestaUsuario = inputValue.trim().toLowerCase();
    if (!respuestaUsuario) return;

    const esCorrecta = actual.correcta.some(
      (c) => c.toLowerCase() === respuestaUsuario
    );

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

  const mostrarTexto = respuesta
    ? actual.texto.replace("________", actual.correcta[0])
    : actual.texto;

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
                  Listen to each conversation and complete the sentence with the correct imperative.
                </p>
              </div>
            )}

            {/* AUDIOS */}
            <div style={{ margin: "1rem 0" }}>
              <button
                onClick={playAudios}
                className="btn-audio"
                style={{ fontSize: "1.8rem", padding: "0.6rem 1rem" }}
              >
                🔊
              </button>

              <div style={{ display: "none" }}>
                {actual.audios.map((src, i) => (
                  <audio
                    key={`${index}-${i}`}
                    ref={(el) => (audioRefs.current[i] = el)}
                    src={src}
                  />
                ))}
              </div>
            </div>

            <p className="pregunta-ejercicio" style={{ fontSize: "1.5rem", fontWeight: 500 }}>
              {mostrarTexto}
            </p>

            {!respuesta && (
              <div style={{ margin: "1.5rem 0", display: "flex", gap: "1rem", justifyContent: "center" }}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Write the imperative"
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
