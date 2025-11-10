import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../ejercicios.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tema2_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [esCorrecta, setEsCorrecta] = useState<boolean | null>(null);
  const [palabras, setPalabras] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const ejercicios = [
    { palabras: ["a","small","black","bag"], correcta: "a small black bag" },
    { palabras: ["beautiful","blue","eyes"], correcta: "beautiful blue eyes" },
    { palabras: ["a","white","cotton","shirt"], correcta: "a white cotton shirt" },
    { palabras: ["a","new","red","car"], correcta: "a new red car" },
    { palabras: ["a","big","brown","dog"], correcta: "a big brown dog" },
    { palabras: ["a","large","old","white","house"], correcta: "a large old white house" },
    { palabras: ["a","beautiful","long","blue","silk","dress"], correcta: "a beautiful long blue silk dress" },
    { palabras: ["comfortable","small","black","shoes"], correcta: "comfortable small black shoes" },
    { palabras: ["an","elegant","round","wooden","table"], correcta: "an elegant round wooden table" },
    { palabras: ["a","kind","tall","young","man"], correcta: "a kind tall young man" },
  ];

  const actual = ejercicios[index];

  useEffect(() => {
    setPalabras(shuffleArray(actual.palabras));
    setRespuesta(null);
    setEsCorrecta(null);
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
    const respuestaUsuario = palabras.join(" ").toLowerCase();
    const correcta = actual.correcta.toLowerCase();

    if (respuestaUsuario === correcta) {
      setRespuesta("Correct");
      setEsCorrecta(true);
      setCorrectas(prev => prev + 1);
    } else {
      setRespuesta("Incorrect");
      setEsCorrecta(false);
      // Reordenar palabras al orden correcto
      setPalabras(actual.correcta.split(" "));
    }
  };

  const siguiente = () => {
    setRespuesta(null);
    setEsCorrecta(null);
    if (index + 1 < ejercicios.length) {
      setIndex(index + 1);
    } else {
      manejarFinalizacion();
    }
  };

  const guardarProgreso = async () => {
    try {
      const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
      if (!completados.includes(id)) {
        completados.push(id);
        localStorage.setItem("ejercicios_completados", JSON.stringify(completados));

        const token = localStorage.getItem("token");
        if (token) {
          const res = await fetch(`${API_URL}/api/progreso`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ nivel, semana, tema, ejercicio }),
          });
          if (!res.ok) console.error("Error al guardar progreso:", res.statusText);
        }
      }
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
                <p className={`respuesta-feedback ${esCorrecta ? "correcta" : "incorrecta"}`} style={{ fontSize: "1.3rem", margin: "1.5rem 0" }}>
                  {respuesta}
                </p>

                {index < ejercicios.length - 1 ? (
                  <button onClick={siguiente} className="ejercicio-btn" style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}>
                    Next
                  </button>
                ) : (
                  <button onClick={manejarFinalizacion} className="ejercicio-btn" style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}>
                    Finish
                  </button>
                )}
              </>
            )}
          </section>
        </>
      ) : (
        <div className="finalizado" style={{ fontSize: "1.3rem" }}>
          <h2>You have completed the exercise!</h2>
          <p>Correct answers: <strong>{correctas} / {ejercicios.length}</strong></p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
