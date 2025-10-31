import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../ejercicios.css";

interface Pregunta {
  pregunta: string;
  opciones: string[];
  respuesta: string;
}

export default function Tema2_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [preguntaActual, setPreguntaActual] = useState(0);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [puntaje, setPuntaje] = useState(0);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const preguntas: Pregunta[] = [
    {
      pregunta: "1️⃣ How does Lucas feel on Monday?",
      opciones: ["Happy", "Tired", "Excited"],
      respuesta: "Tired",
    },
    {
      pregunta: "2️⃣ Why does Lucas feel happy on Tuesday?",
      opciones: [
        "Because he finishes his homework",
        "Because his best friend visits him",
        "Because he goes to a concert",
      ],
      respuesta: "Because his best friend visits him",
    },
    {
      pregunta: "3️⃣ How does Emma feel today?",
      opciones: ["Worried", "Angry", "Bored"],
      respuesta: "Worried",
    },
    {
      pregunta: "4️⃣ Why does Emma feel worried?",
      opciones: [
        "Because she has an exam",
        "Because she lost her phone",
        "Because she is late",
      ],
      respuesta: "Because she has an exam",
    },
    {
      pregunta: "5️⃣ What other emotion does Emma feel?",
      opciones: ["Excited", "Sad", "Nervous"],
      respuesta: "Excited",
    },
    {
      pregunta: "6️⃣ Why does Daniel feel angry?",
      opciones: [
        "Because he can’t find his keys",
        "Because he’s hungry",
        "Because he failed a test",
      ],
      respuesta: "Because he can’t find his keys",
    },
    {
      pregunta: "7️⃣ How does Daniel feel about his work?",
      opciones: ["Relaxed", "Stressed", "Happy"],
      respuesta: "Stressed",
    },
    {
      pregunta: "8️⃣ What do they usually do on Saturday?",
      opciones: [
        "They go shopping.",
        "They stay home and watch movies.",
        "They go to school.",
      ],
      respuesta: "They stay home and watch movies.",
    },
    {
      pregunta: "9️⃣ How do they feel on weekends?",
      opciones: ["Relaxed", "Angry", "Bored"],
      respuesta: "Relaxed",
    },
    {
      pregunta: "🔟 Why do they feel happy on Sunday?",
      opciones: [
        "Because they spend time with their families",
        "Because they have no homework",
        "Because they go to a concert",
      ],
      respuesta: "Because they spend time with their families",
    },
  ];

  // Manejo de selección de respuesta
  const manejarSeleccion = (opcion: string) => {
    setSeleccion(opcion);
    if (opcion === preguntas[preguntaActual].respuesta) {
      setPuntaje((prev) => prev + 1);
      setMensaje("✅ Correct!");
    } else {
      setMensaje(`❌ Incorrect. The correct answer is: ${preguntas[preguntaActual].respuesta}`);
    }
  };

  // Siguiente pregunta
  const siguiente = () => {
    setSeleccion(null);
    setMensaje("");
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual((prev) => prev + 1);
    } else {
      setMostrarResultado(true);
      guardarProgreso();
    }
  };

  // Guardar progreso (simulado)
  const guardarProgreso = () => {
    const progreso = JSON.parse(localStorage.getItem("progreso") || "{}");
    progreso[id] = { completado: true, puntaje };
    localStorage.setItem("progreso", JSON.stringify(progreso));
  };

  return (
    <div className="ejercicio-container">
      <h2>🎧 Listening: "How We Feel This Week"</h2>

      <audio controls>
        <source
          src="/audios/how_we_feel_this_week.mp3"
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>

      {!mostrarResultado ? (
        <div className="pregunta-card">
          <p className="pregunta-text">{preguntas[preguntaActual].pregunta}</p>

          <div className="opciones-container">
            {preguntas[preguntaActual].opciones.map((opcion, index) => (
              <button
                key={index}
                className={`opcion-btn ${
                  seleccion === opcion
                    ? opcion === preguntas[preguntaActual].respuesta
                      ? "correcta"
                      : "incorrecta"
                    : ""
                }`}
                onClick={() => manejarSeleccion(opcion)}
                disabled={!!seleccion}
              >
                {opcion}
              </button>
            ))}
          </div>

          {mensaje && <p className="mensaje">{mensaje}</p>}

          {seleccion && (
            <button className="siguiente-btn" onClick={siguiente}>
              {preguntaActual < preguntas.length - 1 ? "Next ➡️" : "Finish 🏁"}
            </button>
          )}
        </div>
      ) : (
        <div className="resultado-final">
          <h3>✅ You finished the exercise!</h3>
          <p>
            Your score: {puntaje} / {preguntas.length}
          </p>
          <button onClick={() => navigate(-1)}>⬅️ Back to Level</button>
        </div>
      )}
    </div>
  );
}
