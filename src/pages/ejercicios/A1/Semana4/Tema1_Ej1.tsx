import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../ejercicios.css";

export default function Tema1_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [palabras, setPalabras] = useState<string[]>([]);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios = [
    {
      desordenadas: ["plays", "in the park", "football", "Tom", "every Sunday"],
      correcta: "Tom plays football in the park every Sunday.",
    },
    {
      desordenadas: ["lunch", "at school", "has", "Sarah", "every day"],
      correcta: "Sarah has lunch at school every day.",
    },
    {
      desordenadas: ["watches", "TV", "in the evening", "my brother"],
      correcta: "My brother watches TV in the evening.",
    },
    {
      desordenadas: ["English", "at night", "studies", "Maria", "in her room"],
      correcta: "Maria studies English in her room at night.",
    },
    {
      desordenadas: ["in the library", "reads", "a book", "David", "every afternoon"],
      correcta: "David reads a book in the library every afternoon.",
    },
    {
      desordenadas: ["the piano", "in the living room", "plays", "Anna"],
      correcta: "Anna plays the piano in the living room.",
    },
    {
      desordenadas: ["breakfast", "in the kitchen", "eats", "my father", "every morning"],
      correcta: "My father eats breakfast in the kitchen every morning.",
    },
    {
      desordenadas: ["homework", "at home", "does", "Paul", "after school"],
      correcta: "Paul does homework at home after school.",
    },
    {
      desordenadas: ["in the gym", "exercise", "we", "every Friday"],
      correcta: "We exercise in the gym every Friday.",
    },
    {
      desordenadas: ["coffee", "in the office", "drinks", "Mr. Brown", "every morning"],
      correcta: "Mr. Brown drinks coffee in the office every morning.",
    },
  ];

  const actual = ejercicios[index];

  useEffect(() => {
    const mezcladas = [...actual.desordenadas].sort(() => Math.random() - 0.5);
    setPalabras(mezcladas);
  }, [index]);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, i: number) => {
    e.dataTransfer.setData("index", i.toString());
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, iDestino: number) => {
    const iOrigen = Number(e.dataTransfer.getData("index"));
    const nuevas = [...palabras];
    const [movida] = nuevas.splice(iOrigen, 1);
    nuevas.splice(iDestino, 0, movida);
    setPalabras(nuevas);
  };

  const verificar = () => {
    const respuestaUsuario = palabras.join(" ");
    const correcta = actual.correcta.replace(".", "").toLowerCase();
    const esCorrecta = respuestaUsuario.toLowerCase() === correcta;

const verificar = () => {
  const respuestaUsuario = palabras.join(" ");
  const correcta = actual.correcta.replace(".", "").toLowerCase();
  const esCorrecta = respuestaUsuario.toLowerCase() === correcta;

  if (esCorrecta) {
    setRespuesta("Correct!");
    setCorrectas((prev) => prev + 1);
  } else {
    setRespuesta("Incorrect");
  }

  // Reordenar palabras siempre (tanto si es correcta como incorrecta)
  const ordenCorrecto = actual.correcta
    .replace(".", "")
    .split(" ")
    .reduce<string[]>((acc, word) => {
      const frase = actual.desordenadas.find((f) =>
        f.toLowerCase().includes(word.toLowerCase())
      );
      if (frase && !acc.includes(frase)) acc.push(frase);
      return acc;
    }, []);
  setPalabras(ordenCorrecto);
};


  const siguiente = () => {
    setRespuesta(null);
    if (index + 1 < ejercicios.length) {
      setIndex(index + 1);
    } else {
      manejarFinalizacion();
    }
  };

  const guardarProgreso = async () => {
    const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
    }

    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/progreso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nivel, semana, tema, ejercicio }),
      });
    } catch (err) {
      console.error("Error al guardar progreso:", err);
    }
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
            <h1 className="titulo-ejercicio">EXERCISE 1</h1>
            <p className="progreso-ejercicio">
              Question {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section className="tarjeta-ejercicio" style={{ textAlign: "center" }}>
            {index === 0 && (
              <div className="instruccion-box">
                <p className="instruccion-ejercicio" style={{ fontSize: "1.3rem" }}>
                  Drag and drop the words to form a correct sentence.
                </p>
              </div>
            )}

            <div
              className="zona-arrastre"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "0.6rem",
                margin: "2rem 0",
              }}
            >
              {palabras.map((palabra, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={(e) => onDragStart(e, i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDrop(e, i)}
                  className="tarjeta-palabra"
                  style={{
                    backgroundColor: "#f1f1f1",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "0.6rem 1rem",
                    cursor: "grab",
                    fontSize: "1.1rem",
                    userSelect: "none",
                  }}
                >
                  {palabra}
                </div>
              ))}
            </div>

            {!respuesta && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                style={{ fontSize: "1.2rem", padding: "0.8rem 2rem" }}
              >
                Check
              </button>
            )}

            {respuesta && (
              <>
                <p
                  className={`respuesta-feedback ${
                    respuesta === "Correct!" ? "correcta" : "incorrecta"
                  }`}
                  style={{
                    fontSize: "1.2rem",
                    margin: "1rem 0",
                    color: respuesta === "Correct!" ? "green" : "red",
                  }}
                >
                  {respuesta}
                </p>

                {respuesta === "Incorrect." && (
                  <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>

                  </p>
                )}

                <button
                  onClick={siguiente}
                  className="ejercicio-btn"
                  style={{ fontSize: "1.2rem", padding: "0.8rem 2rem" }}
                >
                  {index === ejercicios.length - 1 ? "Finish" : "Next"}
                </button>
              </>
            )}
          </section>
        </>
      ) : (
        <div className="finalizado" style={{ fontSize: "1.3rem" }}>
          <h2> You have completed the exercise!</h2>
          <p>
            Correct answers:{" "}
            <strong>
              {correctas} / {ejercicios.length}
            </strong>
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}