import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../ejercicios.css";

export default function Tema2_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [palabras, setPalabras] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios = [
    { palabras: ["bag", "black", "small"], correcta: "a small black bag" },
    { palabras: ["eyes", "blue", "beautiful"], correcta: "beautiful blue eyes" },
    { palabras: ["shirt", "cotton", "white"], correcta: "a white cotton shirt" },
    { palabras: ["car", "red", "new"], correcta: "a new red car" },
    { palabras: ["dog", "big", "brown"], correcta: "a big brown dog" },
    { palabras: ["house", "old", "white", "large"], correcta: "a large old white house" },
    { palabras: ["dress", "silk", "beautiful", "long", "blue"], correcta: "a beautiful long blue silk dress" },
    { palabras: ["shoes", "comfortable", "small", "black"], correcta: "comfortable small black shoes" },
    { palabras: ["table", "round", "wooden", "elegant"], correcta: "an elegant round wooden table" },
    { palabras: ["man", "tall", "kind", "young"], correcta: "a kind tall young man" },
  ];

  const actual = ejercicios[index];

  // Barajar palabras cada vez que cambia la oración
  useEffect(() => {
    setPalabras(shuffleArray(actual.palabras));
  }, [index]);

  function shuffleArray(array: string[]) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  const moverPalabra = (from: number, to: number) => {
    const nuevas = [...palabras];
    const [moved] = nuevas.splice(from, 1);
    nuevas.splice(to, 0, moved);
    setPalabras(nuevas);
  };

  const verificar = () => {
    const respuestaUsuario = palabras.join(" ");
    const correcta = actual.correcta.replace(".", "").toLowerCase();

    const esCorrecta = respuestaUsuario.toLowerCase() === correcta;

    if (esCorrecta) {
      setRespuesta("✅ Correct!");
      setCorrectas((prev) => prev + 1);
    } else {
      setRespuesta("❌ Incorrect.");
      // Mostrar la versión correcta acomodada
      const ordenCorrecto = actual.correcta
        .replace(".", "")
        .split(" ")
        .reduce<string[]>((acc, word) => {
          const frase = actual.palabras.find(f =>
            f.toLowerCase().includes(word.toLowerCase())
          );
          if (frase && !acc.includes(frase)) acc.push(frase);
          return acc;
        }, []);
      setPalabras(ordenCorrecto);
    }
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
              Sentence {index + 1} of {ejercicios.length}
            </p>
          </header>

          <section className="tarjeta-ejercicio" style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}>
            {/* Solo mostrar la instrucción en el primer ejercicio */}
            {index === 0 && (
              <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
                <p className="instruccion-ejercicio">
                  Drag or reorder the words to form a correct sentence.
                </p>
              </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", justifyContent: "center", marginBottom: "1.5rem" }}>
              {palabras.map((palabra, i) => (
                <button
                  key={i}
                  className="palabra-btn"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("index", i.toString())}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const from = Number(e.dataTransfer.getData("index"));
                    moverPalabra(from, i);
                  }}
                  style={{
                    fontSize: "1.2rem",
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    backgroundColor: "#e8eaf6",
                    border: "1px solid #ccc",
                    cursor: "grab",
                  }}
                >
                  {palabra}
                </button>
              ))}
            </div>

            {!respuesta && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
              >
                Check
              </button>
            )}

            {respuesta && (
              <>
                <p
                  className={`respuesta-feedback ${respuesta.startsWith("✅") ? "correcta" : "incorrecta"}`}
                  style={{ fontSize: "1.3rem", margin: "1.5rem 0" }}
                >
                  {respuesta}
                </p>

                {respuesta.startsWith("❌") && (
                  <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                    Correct order: <strong>{palabras.join(" ")}</strong>
                  </p>
                )}

                {index < ejercicios.length - 1 ? (
                  <button
                    onClick={siguiente}
                    className="ejercicio-btn"
                    style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={manejarFinalizacion}
                    className="ejercicio-btn"
                    style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
                  >
                    Finish
                  </button>
                )}
              </>
            )}
          </section>
        </>
      ) : (
        <div className="finalizado" style={{ fontSize: "1.3rem" }}>
          <h2>✅ You have completed the exercise!</h2>
          <p>
            Correct answers: <strong>{correctas} / {ejercicios.length}</strong>
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
