import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tema2_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [resultado, setResultado] = useState(false);
  const [puntaje, setPuntaje] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const opciones = [
    "Apples", "Water", "People", "Money", "Dogs", "Salt",
    "Books", "Milk", "Emails", "Music"
  ];

  // Cosas que sí se pueden contar
  const correctas = [
    "Apples", "People", "Dogs", "Books", "Emails"
  ];

  const toggleSeleccion = (opcion: string) => {
    if (resultado) return;

    setSeleccionadas((prev) =>
      prev.includes(opcion)
        ? prev.filter((o) => o !== opcion)
        : [...prev, opcion]
    );
  };

  const guardarProgreso = async () => {
    const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
    }

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

      if (!res.ok) console.error("Error saving progress:", res.statusText);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const verificar = () => {
    setResultado(true);

    const correctasSeleccionadas = seleccionadas.filter((op) =>
      correctas.includes(op)
    ).length;

    setPuntaje(correctasSeleccionadas);
    guardarProgreso();
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
            <h1 className="titulo-ejercicio">EXERCISE 1</h1>
            <p className="progreso-ejercicio">Select all correct answers</p>
          </header>

          <section
            className="tarjeta-ejercicio"
            style={{
              textAlign: "center",
              fontSize: "1.3rem",
              padding: "2rem",
            }}
          >
            {/* Instrucción */}
            <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
              <p className="instruccion-ejercicio">
                Click or select the things you can count. Use <b>HOW MANY</b>.
              </p>
            </div>

            {/* Opciones */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {opciones.map((op) => {
                const isCorrecta = correctas.includes(op);
                const estaSeleccionada = seleccionadas.includes(op);

                let bg = "#fff";
                let color = "#222a5c";

                if (!resultado && estaSeleccionada) {
                  bg = "#bcd03c"; // amarillo selección
                  color = "#222a5c";
                }

                if (resultado) {
                  if (isCorrecta) bg = "#36aabc"; // verde
                  if (!isCorrecta && estaSeleccionada) bg = "#ff5c5c"; // rojo
                  color = "#fff";
                }

                return (
                  <button
                    key={op}
                    onClick={() => toggleSeleccion(op)}
                    disabled={resultado}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      minWidth: "130px",
                      backgroundColor: bg,
                      color: color,
                      border: "1px solid #222a5c",
                      cursor: resultado ? "not-allowed" : "pointer",
                      fontSize: "1.1rem",
                    }}
                  >
                    {op}
                  </button>
                );
              })}
            </div>

            {/* Botón Check */}
            {!resultado && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                style={{
                  fontSize: "1.3rem",
                  padding: "0.8rem 2rem",
                  borderRadius: "8px",
                }}
              >
                Check
              </button>
            )}

            {/* Resultado */}
            {resultado && (
              <div style={{ marginTop: "1rem", fontSize: "1.3rem" }}>
                <p>
                  You got <strong>{puntaje}</strong> out of{" "}
                  <strong>{correctas.length}</strong> correct.
                </p>

                <button
                  onClick={manejarFinalizacion}
                  className="ejercicio-btn"
                  style={{
                    fontSize: "1.3rem",
                    padding: "0.8rem 2rem",
                    borderRadius: "8px",
                    marginTop: "1rem",
                  }}
                >
                  Finish
                </button>
              </div>
            )}
          </section>
        </>
      ) : (
        <div className="finalizado" style={{ fontSize: "1.3rem" }}>
          <h2 className="correcta">You have completed the exercise!</h2>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
