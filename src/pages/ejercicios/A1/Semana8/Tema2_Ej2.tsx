import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

interface Ejercicio {
  oracion: string;
  respuesta: string;
}

export default function Tema2_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [respuestasUsuario, setRespuestasUsuario] = useState<string[]>(Array(10).fill(""));
  const [verificado, setVerificado] = useState(false);
  const [correctas, setCorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const palabras = [
    "students", "apples", "books", "bottles", "stars",
    "people", "books", "eggs", "dogs", "messages"
  ];

  const ejercicios: Ejercicio[] = [
    { oracion: "How many ______ are in your class?", respuesta: "students" },
    { oracion: "How many ______ do you eat every day?", respuesta: "apples" },
    { oracion: "How many ______ do you have in your backpack?", respuesta: "books" },
    { oracion: "How many ______ are on the table?", respuesta: "bottles" },
    { oracion: "How many ______ do you see in the sky?", respuesta: "stars" },
    { oracion: "How many ______ live in your house?", respuesta: "people" },
    { oracion: "How many ______ do you read in a month?", respuesta: "books" },
    { oracion: "How many ______ are in the refrigerator?", respuesta: "eggs" },
    { oracion: "How many ______ are playing football?", respuesta: "dogs" },
    { oracion: "How many ______ do you have on your phone?", respuesta: "messages" },
  ];

  const handleChange = (index: number, valor: string) => {
    if (verificado) return;
    const nuevas = [...respuestasUsuario];
    nuevas[index] = valor.toLowerCase().trim();
    setRespuestasUsuario(nuevas);
  };

  const verificar = async () => {
    let aciertos = 0;
    ejercicios.forEach((ej, i) => {
      if (respuestasUsuario[i] === ej.respuesta) aciertos++;
    });
    setCorrectas(aciertos);
    setVerificado(true);

    // Guardar progreso en localStorage y backend
    const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
    }

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
      if (!res.ok) console.error("Error saving progress:", res.statusText);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const manejarFinalizacion = () => {
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
            <h1 className="titulo-ejercicio">EXERCISE 2</h1>
          </header>

          <section className="tarjeta-ejercicio" style={{ padding: "2rem", textAlign: "center" }}>
            <div className="instruccion-box" style={{ marginBottom: "1rem" }}>
              <p className="instruccion-ejercicio">
                <strong>Instructions:</strong> Complete each question with the correct word.
                <br />
                Use <b>HOW MANY</b> for countable nouns.
              </p>
            </div>

            {/* Caja con palabras */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "0.7rem",
                marginBottom: "1.5rem",
              }}
            >
              {palabras.map((p, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: "#2c12bdff",
                    color: "#fff",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                  }}
                >
                  {p}
                </span>
              ))}
            </div>

            {/* Lista de oraciones con inputs */}
            <div style={{ textAlign: "left", margin: "0 auto", maxWidth: "600px" }}>
              {ejercicios.map((ej, i) => {
                const esCorrecta = verificado && respuestasUsuario[i] === ej.respuesta;
                const esIncorrecta =
                  verificado && respuestasUsuario[i] !== ej.respuesta && respuestasUsuario[i] !== "";

                return (
                  <p key={i} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                    {i + 1}. {ej.oracion.split("______")[0]}
                    <input
                      type="text"
                      value={respuestasUsuario[i]}
                      onChange={(e) => handleChange(i, e.target.value)}
                      disabled={verificado}
                      style={{
                        border: verificado
                          ? esCorrecta
                            ? "2px solid #4caf50"
                            : esIncorrecta
                            ? "2px solid #e53935"
                            : "1px solid #ccc"
                          : "1px solid #ccc",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        width: "120px",
                        textAlign: "center",
                        margin: "0 6px",
                      }}
                    />
                    {ej.oracion.split("______")[1]}
                  </p>
                );
              })}
            </div>

            {!verificado && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                style={{ fontSize: "1.3rem", marginTop: "1.5rem", borderRadius: "8px" }}
              >
                Check
              </button>
            )}

            {verificado && (
              <div style={{ marginTop: "1rem", fontSize: "1.3rem" }}>
            
                <button
                  onClick={manejarFinalizacion}
                  className="ejercicio-btn"
                  style={{ fontSize: "1.3rem", marginTop: "1rem", borderRadius: "8px" }}
                >
                  Finish
                </button>
              </div>
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

