import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../ejercicios.css";

interface EjercicioMatching {
  situacion: string;
  respuesta: string;
}

const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

export default function Tema3_Ej1() {
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
    { situacion: "Teacher", respuesta: "Teaches students in a school." },
    { situacion: "Doctor", respuesta: "Works in a hospital and helps patients." },
    { situacion: "Chef", respuesta: "Cooks food in a restaurant." },
    { situacion: "Nurse", respuesta: "Helps the doctor in a hospital." },
    { situacion: "Police officer", respuesta: "Protects people and enforces the law." },
    { situacion: "Farmer", respuesta: "Works on a farm with animals or plants." },
    { situacion: "Student", respuesta: "Studies in a school or university." },
    { situacion: "Driver", respuesta: "Drives a car, bus, or taxi." },
    { situacion: "Singer", respuesta: "Sings songs on stage." },
    { situacion: "Engineer", respuesta: "Designs and builds machines or buildings." },
  ];

  useEffect(() => {
    setSituaciones(shuffleArray(ejercicios));
    setRespuestas(shuffleArray(ejercicios));
  }, []);

  useEffect(() => {
    const totalIntentos = Object.keys(paresCorrectos).length + paresIncorrectos.length;
    if (totalIntentos === ejercicios.length) setCompleto(true);
  }, [paresCorrectos, paresIncorrectos]);

  // === GUARDAR PROGRESO EN LOCAL Y BACKEND ===
  const guardarProgreso = async (score: number) => {
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
        body: JSON.stringify({
          nivel,
          semana,
          tema,
          ejercicio,
          score, // 👈 número de pares correctos
          total: ejercicios.length, // 👈 total de pares posibles
        }),
      });

      if (!res.ok) console.error("Error al guardar progreso:", res.statusText);
    } catch (error) {
      console.error("Error al guardar el progreso:", error);
    }
  };

  // === SELECCIONAR PARES ===
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
    paresIncorrectos.some((p) =>
      tipo === "situacion" ? p.situacion === valor : p.respuesta === valor
    );

  const manejarFinalizacion = async () => {
    const score = Object.keys(paresCorrectos).length;
    await guardarProgreso(score);
    setFinalizado(true);
    setTimeout(() => {
      navigate(`/inicio/${nivel}`);
      window.location.reload();
    }, 3000);
  };

  const colorCorrecto = "#222a5c"; // azul institucional
  const colorIncorrecto = "#d9534f"; // rojo suave

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
                Match the profession with its correct description.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ textAlign: "center", fontWeight: "600", color: "#222a5c" }}>
                Professions
              </div>

              {/* === Lista de profesiones === */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  justifyContent: "center",
                }}
              >
                {situaciones.map((ej) => {
                  const correcto = paresCorrectos[ej.situacion];
                  const incorrecto = isIncorrecto("situacion", ej.situacion);
                  return (
                    <button
                      key={ej.situacion}
                      disabled={!!correcto || incorrecto}
                      className="opcion-btn"
                      style={{
                        padding: "0.6rem 0.9rem",
                        fontSize: "1rem",
                        borderRadius: "10px",
                        minWidth: "180px",
                        backgroundColor: correcto
                          ? colorCorrecto
                          : incorrecto
                          ? colorIncorrecto
                          : "#fff",
                        color: correcto || incorrecto ? "#fff" : "#222a5c",
                        border: "1px solid #222a5c",
                        cursor: correcto || incorrecto ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => handleSeleccion("situacion", ej.situacion)}
                    >
                      {ej.situacion}
                    </button>
                  );
                })}
              </div>

              <div style={{ textAlign: "center", fontWeight: "600", color: "#222a5c" }}>
                Descriptions
              </div>

              {/* === Lista de descripciones === */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  justifyContent: "center",
                }}
              >
                {respuestas.map((ej) => {
                  const situacion = Object.keys(paresCorrectos).find(
                    (k) => paresCorrectos[k] === ej.respuesta
                  );
                  const correcto = !!situacion;
                  const incorrecto = isIncorrecto("respuesta", ej.respuesta);
                  return (
                    <button
                      key={ej.respuesta}
                      disabled={correcto || incorrecto}
                      className="opcion-btn"
                      style={{
                        padding: "0.6rem 0.9rem",
                        fontSize: "1rem",
                        borderRadius: "10px",
                        minWidth: "230px",
                        backgroundColor: correcto
                          ? colorCorrecto
                          : incorrecto
                          ? colorIncorrecto
                          : "#fff",
                        color: correcto || incorrecto ? "#fff" : "#222a5c",
                        border: "1px solid #222a5c",
                        cursor: correcto || incorrecto ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => handleSeleccion("respuesta", ej.respuesta)}
                    >
                      {ej.respuesta}
                    </button>
                  );
                })}
              </div>

              <div
                className="botones-siguiente"
                style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}
              >
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
            Correct pairs:{" "}
            <strong>{Object.keys(paresCorrectos).length}</strong> / {ejercicios.length}
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
