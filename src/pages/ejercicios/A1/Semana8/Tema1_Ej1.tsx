import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../ejercicios.css";

export default function Tema1_Ej1() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [resultado, setResultado] = useState(false);
  const [puntaje, setPuntaje] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const opciones = [
    "Water", "Bread", "Money", "Books", "Apples", "Milk", "Salt", "Clothes",
    "Time", "People", "Rice", "Tickets", "Cheese", "Cake", "Dogs"
  ];

  const correctas = [
    "Water", "Bread", "Money", "Milk", "Salt", "Time", "Rice", "Cheese"
  ];

  const toggleSeleccion = (opcion: string) => {
    if (resultado) return;
    setSeleccionadas((prev) =>
      prev.includes(opcion)
        ? prev.filter((o) => o !== opcion)
        : [...prev, opcion]
    );
  };

  const verificar = () => {
    setResultado(true);

    const correctasSeleccionadas = seleccionadas.filter((op) =>
      correctas.includes(op)
    ).length;
    setPuntaje(correctasSeleccionadas);

    // Guardar progreso
    const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
    if (!completados.includes(id)) {
      completados.push(id);
      localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
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
            <h1 className="titulo-ejercicio">EXERCISE 1</h1>
          </header>

          <section
            className="tarjeta-ejercicio"
            style={{ textAlign: "center", fontSize: "1.3rem", padding: "2rem" }}
          >
            <div className="instruccion-box" style={{ marginBottom: "1.5rem" }}>
              <p className="instruccion-ejercicio">
                Click or select all the options where you can use <b>HOW MUCH</b>.
              </p>
            </div>

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
                const color = resultado
                  ? isCorrecta
                    ? "#36aabc"
                    : estaSeleccionada
                    ? "#ff5c5c"
                    : "#fff"
                  : estaSeleccionada
                  ? "#bcd03c"
                  : "#fff";

                return (
                  <button
                    key={op}
                    onClick={() => toggleSeleccion(op)}
                    disabled={resultado}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      minWidth: "120px",
                      backgroundColor: color,
                      color: color === "#fff" ? "#222a5c" : "#fff",
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

            {!resultado && (
              <button
                onClick={verificar}
                className="ejercicio-btn"
                style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
              >
                Check
              </button>
            )}

            {resultado && (
              <div style={{ marginTop: "1rem", fontSize: "1.3rem" }}>
                <p>✅ Correct options are highlighted in blue.</p>
                <p>
                  You got <strong>{puntaje}</strong> out of{" "}
                  <strong>{correctas.length}</strong> correct.
                </p>
                <button
                  onClick={manejarFinalizacion}
                  className="ejercicio-btn"
                  style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px", marginTop: "1rem" }}
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
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
