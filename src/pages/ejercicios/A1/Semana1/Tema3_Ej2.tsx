import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import "../ejercicios.css";

export default function Tema1_Ej2_Ordinals() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [yaCompletado, setYaCompletado] = useState(false);

  // 🔹 Ejercicios con imágenes y respuestas correctas
  const ejercicios = useMemo(
    () => [
      { imagen: "/img/cat-boxes.PNG", pregunta: "There are three boxes. The cat is in the ___ box.", correcta: "first" },
      { imagen: "/img/red-chair.PNG", pregunta: "Four chairs are in a row. The red chair is the ___ one.", correcta: "second" },
      { imagen: "/img/green-apple.PNG", pregunta: "Five apples on a table. The green apple is the ___ one.", correcta: "third" },
      { imagen: "/img/backpack-girl.png", pregunta: "Three students in line. The girl with a backpack is the ___ student.", correcta: "second" },
      { imagen: "/img/blue-book.png", pregunta: "Six books on a shelf. The blue book is the ___ book.", correcta: "fourth" },
      { imagen: "/img/yellow-car.PNG", pregunta: "Three cars in a parking lot. The yellow car is the ___ car.", correcta: "third" },
      { imagen: "/img/long-pencil.png", pregunta: "Four pencils on the desk. The long pencil is the ___ one.", correcta: "first" },
      { imagen: "/img/big-ball.png", pregunta: "Five balls in a row. The big ball is the ___ one.", correcta: "fifth" },
      { imagen: "/img/tea-cup.png", pregunta: "Three cups on the table. The cup with tea is the ___ one.", correcta: "second" },
      { imagen: "/img/left-door.png", pregunta: "Two doors. The ___ door is brown.", correcta: "first" },
    ],
    []
  );

  const actual = ejercicios[index];

  // 🔹 Verificar si el usuario ya completó el ejercicio
  useEffect(() => {
    const checkProgreso = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API_URL}/api/progreso/${nivel}/${semana}/${tema}/${ejercicio}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data.completado) setYaCompletado(true);
        }
      } catch (error) {
        console.error("Error al consultar progreso:", error);
      }
    };
    checkProgreso();
  }, [API_URL, id, nivel, semana, tema, ejercicio]);

  // 🔹 Guardar progreso al finalizar
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

  // 🔹 Verifica respuesta
  const verificar = () => {
    const respuestaUsuario = inputValue.trim().toLowerCase();
    if (!respuestaUsuario) return;
    if (respuestaUsuario === actual.correcta.toLowerCase()) {
      setRespuesta("Correct");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`Incorrect. The answer is "${actual.correcta}".`);
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setInputValue("");
    setIndex((prev) => prev + 1);
  };

  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => navigate(`/inicio/${nivel}`), 2500);
  };

  //  Si ya completó el ejercicio
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

  // Pantalla de finalización
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

  //  Ejercicio activo
  return (
    <div className="ejercicio-container">
      <header className="ejercicio-header">
        <h1 className="titulo-ejercicio">EXERCISE 2</h1>
        <p className="progreso-ejercicio">
          Question {index + 1} of {ejercicios.length}
        </p>
      </header>

      <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
        {index === 0 && (
          <div className="instruccion-box">
            <p className="instruccion-ejercicio">
              Look at the picture and write the correct ordinal number.
            </p>
          </div>
        )}

        <img src={actual.imagen} alt="Exercise reference" className="imagen-completa" />

        <p className="pregunta-ejercicio">
          {respuesta ? actual.pregunta.replace("___", actual.correcta) : actual.pregunta}
        </p>

        <div className="input-contenedor">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="input-respuesta"
            placeholder="Write the ordinal..."
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
              respuesta === "Correct" ? "correcta" : "incorrecta"
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
    </div>
  );
}
