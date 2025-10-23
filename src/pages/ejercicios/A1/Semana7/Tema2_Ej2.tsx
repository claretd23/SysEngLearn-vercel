import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../ejercicios.css";

interface EjercicioMatching {
  situacion: string;
  respuesta: string;
}

const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

const pairColors = [
  "#aabc36", "#f28c28", "#36aabc", "#ab36bc", "#ff5c5c",
  "#36bc8f", "#bc9636", "#6b36bc", "#36bca3", "#e1bc36"
];

export default function Tema2_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const navigate = useNavigate();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;

  const [situaciones, setSituaciones] = useState<EjercicioMatching[]>([]);
  const [respuestas, setRespuestas] = useState<EjercicioMatching[]>([]);
  const [seleccion, setSeleccion] = useState<{ situacion?: number; respuesta?: number }>({});
  const [paresCorrectos, setParesCorrectos] = useState<{ situacionIndex: number; respuestaIndex: number; color: string }[]>([]);
  const [paresIncorrectos, setParesIncorrectos] = useState<{ situacionIndex: number; respuestaIndex: number }[]>([]);
  const [finalizado, setFinalizado] = useState(false);
  const [completo, setCompleto] = useState(false);

  const ejercicios: EjercicioMatching[] = [
    { situacion: "This is my book. Is that ___?", respuesta: "yours" },
    { situacion: "I have a dog. That one is ___?", respuesta: "mine" },
    { situacion: "She lost her keys. Can I use ___?", respuesta: "hers" },
    { situacion: "This car is not mine. It’s ___?", respuesta: "yours" },
    { situacion: "That pen is not yours. It’s ___?", respuesta: "his" },
    { situacion: "We have a house. The big one is ___?", respuesta: "ours" },
    { situacion: "I love this chocolate. Can I have ___?", respuesta: "yours" },
    { situacion: "That bag is not mine. It’s ___?", respuesta: "hers" },
    { situacion: "This room is not ours. It’s ___?", respuesta: "theirs" },
    { situacion: "Your phone is broken. Can I use ___?", respuesta: "mine" },
  ];

  useEffect(() => {
    setSituaciones(shuffleArray(ejercicios));
    setRespuestas(shuffleArray(ejercicios));
  }, []);

  useEffect(() => {
    const totalIntentos = paresCorrectos.length + paresIncorrectos.length;
    if (totalIntentos === ejercicios.length) setCompleto(true);
  }, [paresCorrectos, paresIncorrectos]);

  const guardarProgreso = async () => {
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

      if (!res.ok) console.error("Error al guardar progreso:", res.statusText);
    } catch (error) {
      console.error("Error al guardar el progreso:", error);
    }
  };

  const handleSeleccion = (tipo: "situacion" | "respuesta", index: number) => {
    const nuevaSeleccion = { ...seleccion, [tipo]: index };
    setSeleccion(nuevaSeleccion);

    if (nuevaSeleccion.situacion !== undefined && nuevaSeleccion.respuesta !== undefined) {
      const parCorrecto = ejercicios.find(
        (ej) =>
          ej.situacion === situaciones[nuevaSeleccion.situacion!].situacion &&
          ej.respuesta === respuestas[nuevaSeleccion.respuesta!].respuesta
      );

      if (parCorrecto) {
        const color = pairColors[paresCorrectos.length % pairColors.length];
        setParesCorrectos((prev) => [
          ...prev,
          { situacionIndex: nuevaSeleccion.situacion!, respuestaIndex: nuevaSeleccion.respuesta!, color }
        ]);
      } else {
        setParesIncorrectos((prev) => [
          ...prev,
          { situacionIndex: nuevaSeleccion.situacion!, respuestaIndex: nuevaSeleccion.respuesta! }
        ]);
      }

      setSeleccion({});
    }
  };

  const getColor = (tipo: "situacion" | "respuesta", index: number) => {
    const par = paresCorrectos.find(p =>
      tipo === "situacion" ? p.situacionIndex === index : p.respuestaIndex === index
    );
    return par ? par.color : undefined;
  };

  const isIncorrecto = (tipo: "situacion" | "respuesta", index: number) =>
    paresIncorrectos.some(p => tipo === "situacion" ? p.situacionIndex === index : p.respuestaIndex === index);

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
          </header>

          <section className="tarjeta-ejercicio">
            <div className="instruccion-box">
              <p className="instruccion-ejercicio">
                Match the sentences with the correct possessive pronouns.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ textAlign: "center", fontWeight: "600", color: "#222a5c" }}>Sentences</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                {situaciones.map((ej, i) => {
                  const color = getColor("situacion", i);
                  const incorrecto = isIncorrecto("situacion", i);
                  return (
                    <button
                      key={i}
                      disabled={!!color || incorrecto}
                      className="opcion-btn"
                      style={{
                        padding: "0.5rem 0.8rem",
                        fontSize: "0.9rem",
                        borderRadius: "8px",
                        minWidth: "180px",
                        backgroundColor: color ? color : incorrecto ? "#ccc" : "#fff",
                        color: color || incorrecto ? "#fff" : "#222a5c",
                        border: "1px solid #222a5c",
                        cursor: color || incorrecto ? "not-allowed" : "pointer",
                      }}
                      onClick={() => handleSeleccion("situacion", i)}
                    >
                      {ej.situacion}
                    </button>
                  );
                })}
              </div>

              <div style={{ textAlign: "center", fontWeight: "600", color: "#222a5c" }}>Answers</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                {respuestas.map((ej, i) => {
                  const color = getColor("respuesta", i);
                  const incorrecto = isIncorrecto("respuesta", i);
                  return (
                    <button
                      key={i}
                      disabled={!!color || incorrecto}
                      className="opcion-btn"
                      style={{
                        padding: "0.5rem 0.8rem",
                        fontSize: "0.9rem",
                        borderRadius: "8px",
                        minWidth: "180px",
                        backgroundColor: color ? color : incorrecto ? "#ccc" : "#fff",
                        color: color || incorrecto ? "#fff" : "#222a5c",
                        border: "1px solid #222a5c",
                        cursor: color || incorrecto ? "not-allowed" : "pointer",
                      }}
                      onClick={() => handleSeleccion("respuesta", i)}
                    >
                      {ej.respuesta}
                    </button>
                  );
                })}
              </div>

              <div className="botones-siguiente" style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                <button
                  className="ejercicio-btn"
                  disabled={!completo}
                  onClick={manejarFinalizacion}
                  style={{ fontSize: "1.3rem", padding: "0.8rem 2rem", borderRadius: "8px" }}
                >
                  Check
                </button>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="finalizado" style={{ fontSize: "1.3rem" }}>
          <h2>✅ You have completed the exercise!</h2>
          <p>
            Correct pairs: <strong>{paresCorrectos.length}</strong> / {ejercicios.length}
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
