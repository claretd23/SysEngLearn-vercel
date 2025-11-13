import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../ejercicios.css";

interface EjercicioMatching {
  situacion: string;
  respuesta: string;
}

const API_URL = import.meta.env.VITE_API_URL;
const pairColors = ["#aabc36", "#f28c28", "#36aabc", "#ab36bc", "#ff5c5c", "#36bc8f", "#bc9636", "#6b36bc", "#36bca3", "#e1bc36"];

export default function Tema2_Ej2() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;
  const navigate = useNavigate();

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

  const [situaciones, setSituaciones] = useState<EjercicioMatching[]>([]);
  const [respuestas, setRespuestas] = useState<EjercicioMatching[]>([]);
  const [seleccion, setSeleccion] = useState<{ situacion?: string; respuesta?: string }>({});
  const [paresCorrectos, setParesCorrectos] = useState<{ [key: string]: string }>({});
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [completado, setCompletado] = useState(false);

  // Mezclar listas al inicio
  useEffect(() => {
    const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);
    setSituaciones(shuffle(ejercicios));
    setRespuestas(shuffle(ejercicios));
  }, []);

  // Guardar progreso al completar
  const guardarProgreso = async () => {
    try {
      const completados = JSON.parse(localStorage.getItem("ejercicios_completados") || "[]");
      if (!completados.includes(id)) {
        completados.push(id);
        localStorage.setItem("ejercicios_completados", JSON.stringify(completados));
      }

      const token = localStorage.getItem("token");
      if (!token) return console.warn("Sin token, guardado local únicamente.");

      const res = await fetch(`${API_URL}/progreso`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, completado: true }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error al guardar progreso:", res.status, errorText);
        setMensaje("Error en el servidor");
        return;
      }

      console.log("Progreso guardado correctamente");
      setMensaje("Progress saved successfully");
    } catch (error) {
      console.error("Error al conectar:", error);
      setMensaje("Connection error");
    }
  };

  // Al emparejar
  const handleSeleccion = (tipo: "situacion" | "respuesta", valor: string) => {
    const nuevaSeleccion = { ...seleccion, [tipo]: valor };
    setSeleccion(nuevaSeleccion);

    if (nuevaSeleccion.situacion && nuevaSeleccion.respuesta) {
      const correcto = ejercicios.find(
        (ej) =>
          ej.situacion === nuevaSeleccion.situacion &&
          ej.respuesta === nuevaSeleccion.respuesta
      );

      if (correcto) {
        setParesCorrectos((prev) => ({
          ...prev,
          [correcto.situacion]: correcto.respuesta,
        }));
      }
      setSeleccion({});
    }
  };

  const getColor = (situacion: string) => {
    const keys = Object.keys(paresCorrectos);
    const index = keys.indexOf(situacion);
    return index >= 0 ? pairColors[index % pairColors.length] : undefined;
  };

  // Verificar si completó todo
  useEffect(() => {
    if (Object.keys(paresCorrectos).length === ejercicios.length && !completado) {
      setCompletado(true);
      guardarProgreso();
      setTimeout(() => navigate(`/inicio/${nivel}`), 3000);
    }
  }, [paresCorrectos]);

  return (
    <div className="ejercicio-container">
      {!completado ? (
        <>
          <header className="ejercicio-header">
            <h1 className="titulo-ejercicio">EXERCISE 2</h1>
            <p className="instruccion-ejercicio">
              Match the sentences with the correct imperatives.
            </p>
          </header>

          <div className="tarjeta-ejercicio" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Sentences */}
            <div style={{ textAlign: "center", fontWeight: "600", color: "#222a5c" }}>Sentences</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
              {situaciones.map((ej) => {
                const color = getColor(ej.situacion);
                return (
                  <button
                    key={ej.situacion}
                    disabled={!!color}
                    className="opcion-btn"
                    onClick={() => handleSeleccion("situacion", ej.situacion)}
                    style={{
                      backgroundColor: color || "#fff",
                      color: color ? "#fff" : "#222a5c",
                      border: "1px solid #222a5c",
                      borderRadius: "8px",
                      padding: "0.5rem 0.8rem",
                      minWidth: "180px",
                      cursor: color ? "not-allowed" : "pointer",
                    }}
                  >
                    {ej.situacion}
                  </button>
                );
              })}
            </div>

            {/* Imperatives */}
            <div style={{ textAlign: "center", fontWeight: "600", color: "#222a5c" }}>Imperatives</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
              {respuestas.map((ej) => {
                const situacion = Object.keys(paresCorrectos).find(k => paresCorrectos[k] === ej.respuesta);
                const color = situacion ? getColor(situacion) : undefined;
                return (
                  <button
                    key={ej.respuesta}
                    disabled={!!color}
                    className="opcion-btn"
                    onClick={() => handleSeleccion("respuesta", ej.respuesta)}
                    style={{
                      backgroundColor: color || "#fff",
                      color: color ? "#fff" : "#222a5c",
                      border: "1px solid #222a5c",
                      borderRadius: "8px",
                      padding: "0.5rem 0.8rem",
                      minWidth: "120px",
                      cursor: color ? "not-allowed" : "pointer",
                    }}
                  >
                    {ej.respuesta}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="finalizado" style={{ fontSize: "1.3rem", textAlign: "center" }}>
          <h2>You have completed the exercise!</h2>
          <p>
            Correct pairs: <strong>{Object.keys(paresCorrectos).length}</strong> / {ejercicios.length}
          </p>
          {mensaje && <p style={{ color: "#222a5c", fontWeight: "600" }}>{mensaje}</p>}
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
