import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../ejercicios.css";

interface EjercicioMatching {
  situacion: string;
  respuesta: string;
}

const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

const pairColors = ["#aabc36", "#f28c28", "#36aabc", "#ab36bc", "#ff5c5c", "#36bc8f", "#bc9636", "#6b36bc", "#36bca3", "#e1bc36"];

export default function Tema2_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const navigate = useNavigate();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const API_URL = import.meta.env.VITE_API_URL;

  const [situaciones, setSituaciones] = useState<EjercicioMatching[]>([]);
  const [respuestas, setRespuestas] = useState<EjercicioMatching[]>([]);
  const [seleccion, setSeleccion] = useState<{ situacion?: string; respuesta?: string }>({});
  const [paresCorrectos, setParesCorrectos] = useState<{ [key: string]: string }>({});
  const [paresIncorrectos, setParesIncorrectos] = useState<{ situacion: string; respuesta: string }[]>([]);
  const [finalizado, setFinalizado] = useState(false);
  const [completo, setCompleto] = useState(false);
  const [feedback, setFeedback] = useState<{ texto: string; tipo: "correcto" | "incorrecto" | null }>({ texto: "", tipo: null });

  const ejercicios: EjercicioMatching[] = [
    { situacion: "___ your homework before dinner.", respuesta: "Do" },
    { situacion: "___ the door when you leave.", respuesta: "Close" },
    { situacion: "___ me your notes, please.", respuesta: "Give" },
    { situacion: "___ quietly in the library.", respuesta: "Speak" },
    { situacion: "___ your hands before eating.", respuesta: "Wash" },
    { situacion: "___ to the teacher if you don’t understand.", respuesta: "Listen" },
    { situacion: "___ the windows; it’s very hot inside.", respuesta: "Open" },
    { situacion: "___ your room every Saturday.", respuesta: "Clean" },
    { situacion: "___ carefully when crossing the street.", respuesta: "Look" },
    { situacion: "___ the lights when you leave the room.", respuesta: "Turn off" },
  ];

  useEffect(() => {
    setSituaciones(shuffleArray(ejercicios));
    setRespuestas(shuffleArray(ejercicios));
  }, []);

  // ✅ Se activa al completar todos los pares (correctos o incorrectos)
  useEffect(() => {
    const totalIntentos = Object.keys(paresCorrectos).length + paresIncorrectos.length;
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
      const res = await fetch(`${API_URL}/api/progreso`, {
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

  const handleSeleccion = (tipo: "situacion" | "respuesta", texto: string) => {
    const nuevaSeleccion = { ...seleccion, [tipo]: texto };
    setSeleccion(nuevaSeleccion);

    if (nuevaSeleccion.situacion && nuevaSeleccion.respuesta) {
      const parCorrecto = ejercicios.find(
        (ej) =>
          ej.situacion === nuevaSeleccion.situacion &&
          ej.respuesta === nuevaSeleccion.respuesta
      );

      if (parCorrecto) {
        setParesCorrectos((prev) => ({
          ...prev,
          [parCorrecto.situacion]: parCorrecto.respuesta,
        }));
        setFeedback({ texto: "Correct!", tipo: "correcto" });
      } else {
        setParesIncorrectos((prev) => [
          ...prev,
          { situacion: nuevaSeleccion.situacion!, respuesta: nuevaSeleccion.respuesta! },
        ]);
        setFeedback({ texto: "Incorrect pair.", tipo: "incorrecto" });
      }

      setTimeout(() => setFeedback({ texto: "", tipo: null }), 1500);
      setSeleccion({});
    }
  };

  const isIncorrecto = (tipo: "situacion" | "respuesta", valor: string) =>
    paresIncorrectos.some(p => (tipo === "situacion" ? p.situacion === valor : p.respuesta === valor));

  const getColor = (situacion: string) => {
    const keys = Object.keys(paresCorrectos);
    const index = keys.indexOf(situacion);
    return index >= 0 ? pairColors[index % pairColors.length] : undefined;
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
            <h1 className="titulo-ejercicio">EXERCISE 2</h1>
          </header>

          <section className="tarjeta-ejercicio">
            <div className="instruccion-box">
              <p className="instruccion-ejercicio">
                Match the sentences with the correct imperatives.
              </p>
            </div>

            {feedback.texto && (
              <p
                style={{
                  color: feedback.tipo === "correcto" ? "green" : "red",
                  fontSize: "1.2rem",
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                {feedback.texto}
              </p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ textAlign: "center", fontWeight: "600", color: "#222a5c" }}>Sentences</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                {situaciones.map((ej) => {
                  const color = getColor(ej.situacion);
                  const incorrecto = isIncorrecto("situacion", ej.situacion);
                  return (
                    <button
                      key={ej.situacion}
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
                      onClick={() => handleSeleccion("situacion", ej.situacion)}
                    >
                      {ej.situacion}
                    </button>
                  );
                })}
              </div>

              <div style={{ textAlign: "center", fontWeight: "600", color: "#222a5c" }}>Imperatives</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                {respuestas.map((ej) => {
                  const situacion = Object.keys(paresCorrectos).find(k => paresCorrectos[k] === ej.respuesta);
                  const color = situacion ? getColor(situacion) : undefined;
                  const incorrecto = isIncorrecto("respuesta", ej.respuesta);
                  return (
                    <button
                      key={ej.respuesta}
                      disabled={!!color || incorrecto}
                      className="opcion-btn"
                      style={{
                        padding: "0.5rem 0.8rem",
                        fontSize: "0.9rem",
                        borderRadius: "8px",
                        minWidth: "120px",
                        backgroundColor: color ? color : incorrecto ? "#ccc" : "#fff",
                        color: color || incorrecto ? "#fff" : "#222a5c",
                        border: "1px solid #222a5c",
                        cursor: color || incorrecto ? "not-allowed" : "pointer",
                      }}
                      onClick={() => handleSeleccion("respuesta", ej.respuesta)}
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
        <div className="finalizado" style={{ fontSize: "1.3rem", textAlign: "center" }}>
          <h2>You have completed the exercise!</h2>
          <p>
            Correct pairs: <strong>{Object.keys(paresCorrectos).length}</strong> / {ejercicios.length}
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
