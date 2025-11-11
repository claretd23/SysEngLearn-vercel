import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tema2_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuestaCorrecta, setRespuestaCorrecta] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios = [
    { pregunta: "___ your shoes before entering the house.", opciones: ["Take off", "Took off", "Taking off", "Takes off"], correcta: "Take off" },
    { pregunta: "___ the book on the table.", opciones: ["Put", "Puts", "Putting", "Put on"], correcta: "Put" },
    { pregunta: "___ your friends at the station at 5 p.m.", opciones: ["Meet", "Meets", "Meeting", "Met"], correcta: "Meet" },
    { pregunta: "___ the music, please; I’m trying to study.", opciones: ["Turn off", "Turning off", "Turn on", "Turned off"], correcta: "Turn off" },
    { pregunta: "___ your mobile phones during the lesson.", opciones: ["Switch off", "Switched off", "Switching off", "Switches off"], correcta: "Switch off" },
    { pregunta: "___ your hands before cooking.", opciones: ["Wash", "Washes", "Washed", "Washing"], correcta: "Wash" },
    { pregunta: "___ the bus; it’s leaving now!", opciones: ["Get on", "Get in", "Getting on", "Gets on"], correcta: "Get on" },
    { pregunta: "___ quietly; the baby is sleeping.", opciones: ["Speak", "Speaks", "Speaking", "Spoke"], correcta: "Speak" },
    { pregunta: "___ this box to the kitchen, please.", opciones: ["Bring", "Brings", "Bringing", "Brought"], correcta: "Bring" },
    { pregunta: "___ the homework before going to bed.", opciones: ["Do", "Does", "Doing", "Did"], correcta: "Do" },
  ];

  const actual = ejercicios[index];

  const verificar = (opcion: string) => {
    setOpcionSeleccionada(opcion);
    if (opcion === actual.correcta) {
      setRespuestaCorrecta("Correct");
      setCorrectas(correctas + 1);
    } else {
      setRespuestaCorrecta("Incorrect");
    }
  };

  const siguiente = async () => {
    if (index < ejercicios.length - 1) {
      setIndex(index + 1);
      setOpcionSeleccionada(null);
      setRespuestaCorrecta(null);
    } else {
      setFinalizado(true);
      try {
        await fetch(`${API_URL}/progreso`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, completado: true }),
        });
      } catch (error) {
        console.error("Error al guardar el progreso:", error);
      }
    }
  };

  return (
    <div className="ejercicio-container">
      <h2>Exercise 1: Phrasal verbs - Daily actions</h2>

      {!finalizado ? (
        <>
          <p className="pregunta">{actual.pregunta}</p>

          <div className="opciones">
            {actual.opciones.map((op, i) => (
              <button
                key={i}
                className={`opcion 
                  ${opcionSeleccionada === op && respuestaCorrecta === "Correct" && op === actual.correcta ? "correcta" : ""}
                  ${opcionSeleccionada === op && respuestaCorrecta === "Incorrect" && op !== actual.correcta ? "incorrecta" : ""}
                `}
                onClick={() => verificar(op)}
                disabled={opcionSeleccionada !== null}
              >
                {op}
              </button>
            ))}
          </div>

          {respuestaCorrecta && (
            <p className={`mensaje ${respuestaCorrecta === "Correct" ? "correcto" : "incorrecto"}`}>
              {respuestaCorrecta}
            </p>
          )}

          {opcionSeleccionada && (
            <button className="siguiente-btn" onClick={siguiente}>
              Next
            </button>
          )}
        </>
      ) : (
        <div className="resultado">
          <h3>Exercise completed!</h3>
          <p>
            You got {correctas} out of {ejercicios.length} correct.
          </p>
          <button onClick={() => navigate(-1)}>Go back</button>
        </div>
      )}
    </div>
  );
}
