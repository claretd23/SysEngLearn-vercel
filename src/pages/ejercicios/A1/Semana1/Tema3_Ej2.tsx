import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import "../ejercicios.css";

export default function Tema1_Ej2_Ordinals() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [correctas, setCorrectas] = useState(0);
  const [index, setIndex] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [yaCompletado, setYaCompletado] = useState(false);

  const ejercicios = useMemo(() => [
    { imagen: "/img/cat-boxes.PNG", pregunta: "There are three boxes. The cat is in the ___ box.", correcta: "first" },
    { imagen: "/img/red-chair.png", pregunta: "Four chairs are in a row. The red chair is the ___ one.", correcta: "second" },
    { imagen: "/img/green-apple.png", pregunta: "Five apples on a table. The green apple is the ___ one.", correcta: "third" },
    { imagen: "/img/backpack-girl.png", pregunta: "Three students in line. The girl with a backpack is the ___ student.", correcta: "second" },
    { imagen: "/img/blue-book.png", pregunta: "Six books on a shelf. The blue book is the ___ book.", correcta: "fourth" },
    { imagen: "/img/yellow-car.png", pregunta: "Three cars in a parking lot. The yellow car is the ___ car.", correcta: "third" },
    { imagen: "/img/long-pencil.png", pregunta: "Four pencils on the desk. The long pencil is the ___ one.", correcta: "first" },
    { imagen: "/img/big-ball.png", pregunta: "Five balls in a row. The big ball is the ___ one.", correcta: "fifth" },
    { imagen: "/img/tea-cup.png", pregunta: "Three cups on the table. The cup with tea is the ___ one.", correcta: "first" },
    { imagen: "/img/left-door.png", pregunta: "Two doors. The door on the left is the ___ door.", correcta: "first" },
  ], []);

  const actual = ejercicios[index];

  useEffect(() => {
    const checkProgreso = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/progreso/${nivel}/${semana}/${tema}/${ejercicio}`,
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
  }, [id, nivel, semana, tema, ejercicio]);

  const guardarProgreso = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/progreso", {
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

  const verificar = () => {
    const respuestaUsuario = inputValue.trim().toLowerCase();
    if (!respuestaUsuario) return;
    if (respuestaUsuario === actual.correcta.toLowerCase()) {
      setRespuesta("✅ Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta(`❌ Incorrect.`);
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

  // 🔹 Estado si ya estaba hecho
  if (yaCompletado) {
    return (
      <div className="finalizado" style={{ fontSize: "1.3rem" }}>
        <h2>✅ You have already completed this exercise.</h2>
        <p>You cannot answer it again.</p>
        <button onClick={() => navigate(`/inicio/${nivel}`)} className="ejercicio-btn" style={{ fontSize: "1.2rem", padding: "0.8rem 2rem" }}>
          Go back to level start
        </button>
      </div>
    );
  }

  // 🔹 Estado si terminó
  if (finalizado) {
    return (
      <div className="finalizado" style={{ fontSize: "1.3rem" }}>
        <h2>✅ You have completed the exercise!</h2>
        <p>
          Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
        </p>
        <p>Redirecting to the start of the level...</p>
      </div>
    );
  }

  // 🔹 Ejercicio en curso
  return (
    <div className="ejercicio-container">
      <header className="ejercicio-header">
        <h1 className="titulo-ejercicio">EXERCISE 2</h1>
        <p className="progreso-ejercicio">
          Question {index + 1} of {ejercicios.length}
        </p>
      </header>

      <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
        {/* Caja de instrucción solo en la primera */}
        {index === 0 && (
          <div className="instruccion-box" style={{ fontSize: "1.3rem" }}>
            <p className="instruccion-ejercicio">
              Look at the picture and write the correct ordinal number.
            </p>
          </div>
        )}

        {/* Imagen */}
        <img
          src={actual.imagen}
          alt="Exercise reference"
          style={{ maxWidth: "350px", margin: "1rem auto", display: "block", borderRadius: "12px" }}
        />

        {/* Pregunta */}
        <p
          className="pregunta-ejercicio"
          style={{ marginBottom: "1rem", fontSize: "1.4rem", fontWeight: 500 }}
        >
          {respuesta ? actual.pregunta.replace("___", actual.correcta) : actual.pregunta}
        </p>

        {/* Input y botón Check alineados */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="input-respuesta"
            placeholder="Write the ordinal..."
            style={{ fontSize: "1.3rem", padding: "0.8rem 1rem", flex: 1, borderRadius: "8px", border: "1px solid #ccc" }}
          />
          {!respuesta && (
            <button onClick={verificar} className="ejercicio-btn" style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}>
              Check
            </button>
          )}
        </div>

        {respuesta && (
          <p className={`respuesta-feedback ${respuesta.startsWith("✅") ? "correcta" : "incorrecta"}`} style={{ fontSize: "1.3rem", margin: "1rem 0" }}>
            {respuesta}
          </p>
        )}

        <div className="botones-siguiente">
          {respuesta && index < ejercicios.length - 1 && (
            <button onClick={siguiente} className="ejercicio-btn" style={{ fontSize: "1.3rem", padding: "0.8rem 2rem" }}>
              Next question
            </button>
          )}
          {respuesta && index === ejercicios.length - 1 && (
            <button onClick={manejarFinalizacion} className="ejercicio-btn" style={{ fontSize: "1.3rem", padding: "0.8rem 2rem" }}>
              Finish
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
