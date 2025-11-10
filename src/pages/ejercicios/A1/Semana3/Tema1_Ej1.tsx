import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../ejercicios.css";

interface EjercicioMatching {
  situacion: string;
  respuesta: string;
}

const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

const pairColors = ["#aabc36", "#f28c28", "#36aabc", "#ab36bc", "#ff5c5c", "#36bc8f", "#bc9636", "#6b36bc", "#36bca3", "#e1bc36"];

export default function Tema1_Ej1() {
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
    { situacion: "Hello. How are you?", respuesta: "I’m fine, thank you." },
    { situacion: "What’s your name?", respuesta: "My name is David." },
    { situacion: "How old are you?", respuesta: "I’m 13 years old." },
    { situacion: "When’s your birthday?", respuesta: "My birthday is on March 10th." },
    { situacion: "Where are you from?", respuesta: "I’m from Mexico." },
    { situacion: "Where do you live?", respuesta: "I live in León, Guanajuato." },
    { situacion: "What’s your phone number?", respuesta: "It’s 553-291-8476." },
    { situacion: "What’s your address?", respuesta: "I live at 24 Juárez Street." },
    { situacion: "What’s your favorite hobby?", respuesta: "My favorite hobby is playing football." },
    { situacion: "Who’s your favorite singer?", respuesta: "My favorite singer is Shakira." },
  ];

  const API_URL = import.meta.env.VITE_API_URL;

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
        // Color aleatorio único para cada par correcto
        const colorAleatorio = pairColors[Math.floor(Math.random() * pairColors.length)];
        setParesCorrectos((prev) => ({
          ...prev,
          [parCorrecto.situacion]: colorAleatorio,
        }));
      } else {
        // Marcar par incorrecto e inhabilitar ambos botones
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

  const getColor = (situacion: string) => paresCorrectos[situacion];

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
                Match the questions with the correct answers.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Preguntas */}
              <div style={{ textAlign: "center", fontWeight: "600", color: "#222a5c" }}>Questions</div>
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
                        backgroundColor: color
                          ? color
                          : incorrecto
                          ? "#ccc"
                          : "#fff",
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

              {/* Respuestas */}
              <div style={{ textAlign: "center", fontWeight: "600", color: "#222a5c" }}>Answers</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                {respuestas.map((ej) => {
                  const situacion = Object.keys(paresCorrectos).find(
                    (k) => ejercicios.find(e => e.situacion === k)?.respuesta === ej.respuesta
                  );
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
                        minWidth: "180px",
                        backgroundColor: color
                          ? color
                          : incorrecto
                          ? "#ccc"
                          : "#fff",
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

              {/* Botón finalización */}
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
