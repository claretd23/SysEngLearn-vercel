import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../ejercicios.css";

interface EjercicioMatching {
  situacion: string;
  respuesta: string;
}

const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

const pairColors = ["#aabc36", "#f28c28", "#36aabc", "#ab36bc", "#ff5c5c", "#36bc8f", "#bc9636", "#6b36bc", "#36bca3", "#e1bc36"];

export default function Tema3_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const navigate = useNavigate();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;

  const [situaciones, setSituaciones] = useState<EjercicioMatching[]>([]);
  const [respuestas, setRespuestas] = useState<EjercicioMatching[]>([]);
  const [seleccion, setSeleccion] = useState<{ situacion?: string; respuesta?: string }>({});
  const [paresCorrectos, setParesCorrectos] = useState<{ [key: string]: string }>({});
  const [paresIncorrectos, setParesIncorrectos] = useState<{ situacion: string; respuesta: string }[]>([]);
  const [finalizado, setFinalizado] = useState(false);
  const [completo, setCompleto] = useState(false);

  const ejercicios: EjercicioMatching[] = [
    { situacion: "You need an umbrella. It’s raining a lot.", respuesta: "D" },
    { situacion: "You can see your breath in the air. It’s very cold!", respuesta: "E" },
    { situacion: "The sky is blue and the sun is shining.", respuesta: "C" },
    { situacion: "There’s thunder and lightning in the sky.", respuesta: "B" },
    { situacion: "You can’t see the mountains because of a thick mist.", respuesta: "A" },
    { situacion: "The temperature is perfect — not too hot or too cold.", respuesta: "G" },
    { situacion: "There are many clouds, but it’s not raining.", respuesta: "F" },
    { situacion: "You need sunglasses and sunscreen. It’s really hot!", respuesta: "H" },
    { situacion: "The air feels heavy and sticky because of moisture.", respuesta: "I" },
    { situacion: "The wind is strong; hold onto your hat!", respuesta: "J" },
  ];

  useEffect(() => {
    setSituaciones(shuffleArray(ejercicios));
    setRespuestas(shuffleArray(ejercicios));
  }, []);

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
      } else {
        setParesIncorrectos((prev) => [
          ...prev,
          { situacion: nuevaSeleccion.situacion!, respuesta: nuevaSeleccion.respuesta! },
        ]);
      }

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
                Match each description (1–10) with the correct weather word (A–J).
              </p>
              <p style={{ fontWeight: 600 }}>Weather words: A. foggy B. stormy C. sunny D. rainy E. freezing F. cloudy G. mild H. hot I. humid J. windy</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ textAlign: "center", fontWeight: "600", color: "#222a5c" }}>Descriptions</div>
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
                        minWidth: "250px",
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

              <div style={{ textAlign: "center", fontWeight: "600", color: "#222a5c" }}>Letters</div>
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
                        minWidth: "80px",
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
        <div className="finalizado" style={{ fontSize: "1.3rem" }}>
          <h2>✅ You have completed the exercise!</h2>
          <p>
            Correct pairs: <strong>{Object.keys(paresCorrectos).length}</strong> / {ejercicios.length}
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
