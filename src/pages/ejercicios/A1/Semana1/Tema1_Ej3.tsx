import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "../ejercicios.css";

export default function Tema1_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
 const API_URL = import.meta.env.VITE_API_URL; 
  const audioRefs = [
    useRef<HTMLAudioElement>(null),
    useRef<HTMLAudioElement>(null),
    useRef<HTMLAudioElement>(null),
  ];

  const ejercicios = [
    {
      audios: [
        { src: "/audios/sem1/Tema1/ej3-1a.mp3", img: "/img/H1.png" },
        { src: "/audios/sem1/Tema1/ej3-1b.mp3", img: "/img/M1.png" },
        { src: "/audios/sem1/Tema1/ej3-1c.mp3", img: "/img/H1.png" },
      ],
      correcta: "Margherita",
      placeholder: "Write the favorite pizza name.",
    },
    {
      audios: [
        { src: "/audios/sem1/Tema1/ej3-2a.mp3", img: "/img/M2.png" },
        { src: "/audios/sem1/Tema1/ej3-2b.mp3", img: "/img/H2.png" },
        { src: "/audios/sem1/Tema1/ej3-2c.mp3", img: "/img/M2.png" },
      ],
      correcta: "Chester",
      placeholder: "Write the pet’s name.",
    },
    {
      audios: [
        { src: "/audios/sem1/Tema1/ej3-3a.mp3", img: "/img/M3.png" },
        { src: "/audios/sem1/Tema1/ej3-3b.mp3", img: "/img/H3.png" },
        { src: "/audios/sem1/Tema1/ej3-3c.mp3", img: "/img/M3.png" },
      ],
      correcta: "Amsterdam",
      placeholder: "Write the city name.",
    },
    {
      audios: [
        { src: "/audios/sem1/Tema1/ej3-4a.mp3", img: "/img/H4.png" },
        { src: "/audios/sem1/Tema1/ej3-4b.mp3", img: "/img/H5.png" },
        { src: "/audios/sem1/Tema1/ej3-4c.mp3", img: "/img/H4.png" },
      ],
      correcta: "Tiramisu",
      placeholder: "Write the dessert name.",
    },
    {
      audios: [
        { src: "/audios/sem1/Tema1/ej3-5a.mp3", img: "/img/M4.png" },
        { src: "/audios/sem1/Tema1/ej3-5b.mp3", img: "/img/H6.png" },
        { src: "/audios/sem1/Tema1/ej3-5c.mp3", img: "/img/M4.png" },
      ],
      correcta: "Martinelli",
      placeholder: "Write the person’s last name.",
    },
    {
      audios: [
        { src: "/audios/sem1/Tema1/ej3-6a.mp3", img: "/img/M5.png" },
        { src: "/audios/sem1/Tema1/ej3-6b.mp3", img: "/img/M6.png" },
        { src: "/audios/sem1/Tema1/ej3-6c.mp3", img: "/img/M5.png" },
      ],
      correcta: "Interstellar",
      placeholder: "Write the movie title.",
    },
    {
      audios: [
        { src: "/audios/sem1/Tema1/ej3-7a.mp3", img: "/img/H2.png" },
        { src: "/audios/sem1/Tema1/ej3-7b.mp3", img: "/img/M7.png" },
        { src: "/audios/sem1/Tema1/ej3-7c.mp3", img: "/img/H2.png" },
      ],
      correcta: "Mozambique",
      placeholder: "Write the country name.",
    },
    {
      audios: [
        { src: "/audios/sem1/Tema1/ej3-8a.mp3", img: "/img/H7.png" },
        { src: "/audios/sem1/Tema1/ej3-8b.mp3", img: "/img/M5.png" },
        { src: "/audios/sem1/Tema1/ej3-8c.mp3", img: "/img/H7.png" },
      ],
      correcta: "The Royal Plate",
      placeholder: "Write the restaurant name.",
    },
    {
      audios: [
        { src: "/audios/sem1/Tema1/ej3-9a.mp3", img: "/img/H8.png" },
        { src: "/audios/sem1/Tema1/ej3-9b.mp3", img: "/img/H5.png" },
        { src: "/audios/sem1/Tema1/ej3-9c.mp3", img: "/img/H8.png" },
      ],
      correcta: "Copacabana",
      placeholder: "Write the beach name.",
    },
    {
      audios: [
        { src: "/audios/sem1/Tema1/ej3-10a.mp3", img: "/img/M8.png" },
        { src: "/audios/sem1/Tema1/ej3-10b.mp3", img: "/img/H2.png" },
        { src: "/audios/sem1/Tema1/ej3-10c.mp3", img: "/img/M8.png" },
      ],
      correcta: "Kilimanjaro",
      placeholder: "Write the mountain name.",
    },
  ];

  const actual = ejercicios[index];

  const playSequence = () => {
    if (audioRefs[0].current) {
      audioRefs[0].current.play();
      audioRefs[0].current.onended = () => {
        setTimeout(() => audioRefs[1].current?.play(), 1000);
      };
    }
    if (audioRefs[1].current) {
      audioRefs[1].current.onended = () => {
        setTimeout(() => audioRefs[2].current?.play(), 1000);
      };
    }
  };

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

      if (!res.ok) console.error("Error al guardar progreso:", res.statusText);
    } catch (error) {
      console.error("Error al guardar el progreso:", error);
    }
  };

  const verificar = () => {
    const respuestaUsuario = inputValue.trim().toLowerCase();
    if (!respuestaUsuario) return;
    if (respuestaUsuario === actual.correcta.toLowerCase()) {
      setRespuesta("Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect. The answer is "${actual.correcta}".`);
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
      navigate("/inicio/A1");
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

          <section className="tarjeta-ejercicio">
            {index === 0 && (
              <div className="instruccion-box">
                <p className="instruccion-ejercicio">
                  Listen to the conversation and write the answer.
                </p>
              </div>
            )}

            <div className="imagenes-conversacion">
              <img src={actual.audios[0].img} alt="Speaker 1" className="speaker-img" />
              <img src={actual.audios[1].img} alt="Speaker 2" className="speaker-img" />
            </div>

            {actual.audios.map((a, i) => (
              <audio key={i} ref={audioRefs[i]} src={a.src} preload="auto" />
            ))}

            <div className="play-container" style={{ textAlign: "center", margin: "1rem 0" }}>
              <button onClick={playSequence} className="btn-audio">
                🔊
              </button>
            </div>

            <div className="opciones-ejercicio">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="input-respuesta"
                placeholder={actual.placeholder}
              />
              {!respuesta && (
                <button onClick={verificar} className="ejercicio-btn">
                  Check
                </button>
              )}
            </div>

            {respuesta && (
              <p
                className={`respuesta-feedback ${
                  respuesta.startsWith("Correct") ? "correcta" : "incorrecta"
                }`}
              >
                {respuesta}
              </p>
            )}

            <div className="botones-siguiente">
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
        </>
      ) : (
        <div className="finalizado">
          <h2>You have completed the exercise!</h2>
          <p>
            Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
