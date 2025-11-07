import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../ejercicios.css";

interface EjercicioListening {
  audioSrc: string;
  respuesta: string;
}

const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

const pairColors = ["#aabc36", "#f28c28", "#36aabc", "#ab36bc", "#ff5c5c", "#36bc8f", "#bc9636", "#6b36bc", "#36bca3", "#e1bc36"];

export default function Tema1_Ej3() {
  const { nivel, semana, tema, ejercicio } = useParams();
  const navigate = useNavigate();
  const id = `${nivel}-${semana}-${tema}-${ejercicio}`;

  const [ejercicios, setEjercicios] = useState<EjercicioListening[]>([]);
  const [opciones, setOpciones] = useState<EjercicioListening[]>([]);
  const [seleccion, setSeleccion] = useState<{ audio?: string; respuesta?: string }>({});
  const [paresCorrectos, setParesCorrectos] = useState<{ [key: string]: string }>({});
  const [paresIncorrectos, setParesIncorrectos] = useState<{ audio: string; respuesta: string }[]>([]);
  const [finalizado, setFinalizado] = useState(false);
  const [completo, setCompleto] = useState(false);

  const audiosRef = useRef<HTMLAudioElement[]>([]);

  // Carga inicial
  useEffect(() => {
    const lista: EjercicioListening[] = [
      { audioSrc: "/audios/sem3/audio1.mp3", respuesta: "My name is Anna." },           // What's your name?
      { audioSrc: "/audios/sem3/audio2.mp3", respuesta: "I’m 13 years old." },          // How old are you?
      { audioSrc: "/audios/sem3/audio3.mp3", respuesta: "I’m from Mexico." },           // Where are you from?
      { audioSrc: "/audios/sem3/audio4.mp3", respuesta: "I live at 32 Park Street." },  // What’s your address?
      { audioSrc: "/audios/sem3/audio5.mp3", respuesta: "My birthday is on July 20th." },// When is your birthday?
      { audioSrc: "/audios/sem3/audio6.mp3", respuesta: "It’s 4567-8923." },            // What’s your phone number?
      { audioSrc: "/audios/sem3/audio7.mp3", respuesta: "I live at 15 Green Avenue." }, // Where do you live?
      { audioSrc: "/audios/sem3/audio8.mp3", respuesta: "My favorite hobby is reading." }, // What is your favorite hobby?
      { audioSrc: "/audios/sem3/audio9.mp3", respuesta: "My favorite singer is Shakira." }, // Who is your favorite singer?
      { audioSrc: "/audios/sem3/audio10.mp3", respuesta: "I’m fine, thank you." },      // How are you?
    ];
    setEjercicios(shuffleArray(lista));
    setOpciones(shuffleArray(lista));
  }, []);

  // Marcar completado cuando todos los pares se hayan intentado
  useEffect(() => {
    const totalIntentos = Object.keys(paresCorrectos).length + paresIncorrectos.length;
    if (totalIntentos === ejercicios.length) setCompleto(true);
  }, [paresCorrectos, paresIncorrectos, ejercicios.length]);

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

  const handleSeleccion = (tipo: "audio" | "respuesta", valor: string) => {
    const nuevaSeleccion = { ...seleccion, [tipo]: valor };
    setSeleccion(nuevaSeleccion);

    if (nuevaSeleccion.audio && nuevaSeleccion.respuesta) {
      const parCorrecto = ejercicios.find(
        ej => ej.audioSrc === nuevaSeleccion.audio && ej.respuesta === nuevaSeleccion.respuesta
      );

      if (parCorrecto) {
        setParesCorrectos(prev => ({ ...prev, [parCorrecto.audioSrc]: parCorrecto.respuesta }));
      } else {
        setParesIncorrectos(prev => [...prev, { audio: nuevaSeleccion.audio!, respuesta: nuevaSeleccion.respuesta! }]);
      }

      setSeleccion({});
    }
  };

  const isIncorrecto = (tipo: "audio" | "respuesta", valor: string) =>
    paresIncorrectos.some(p => (tipo === "audio" ? p.audio === valor : p.respuesta === valor));

  const getColor = (audio: string) => {
    const keys = Object.keys(paresCorrectos);
    const index = keys.indexOf(audio);
    return index >= 0 ? pairColors[index % pairColors.length] : undefined;
  };

  const manejarFinalizacion = async () => {
    await guardarProgreso();
    setFinalizado(true);
    setTimeout(() => {
      navigate(`/inicio/${nivel}`);
    }, 3000);
  };

  return (
    <div className="ejercicio-container">
      {!finalizado ? (
        <>
          <header className="ejercicio-header">
            <h1 className="titulo-ejercicio">EXERCISE 3</h1>
          </header>

          <section className="tarjeta-ejercicio">
            <div className="instruccion-box">
              <p className="instruccion-ejercicio">
                Listen to the question 🔊 and select the correct answer.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ textAlign: "center", fontWeight: "600", color: "#222a5c" }}>Questions</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                {ejercicios.map(ej => {
                  const color = getColor(ej.audioSrc);
                  const incorrecto = isIncorrecto("audio", ej.audioSrc);
                  return (
                    <button
                      key={ej.audioSrc}
                      disabled={!!color || incorrecto}
                      className="btn-audio"
                      style={{
                        padding: "0.5rem 0.8rem",
                        fontSize: "1.2rem",
                        borderRadius: "8px",
                        minWidth: "140px",
                        backgroundColor: color ? color : incorrecto ? "#ccc" : "#fff",
                        color: color || incorrecto ? "#fff" : "#222a5c",
                        border: "1px solid #222a5c",
                        cursor: color || incorrecto ? "not-allowed" : "pointer",
                      }}
                      onClick={() => {
                        audiosRef.current[ejercicios.indexOf(ej)]?.play();
                        handleSeleccion("audio", ej.audioSrc);
                      }}
                    >
                      🔊
                      <audio ref={el => (audiosRef.current[ejercicios.indexOf(ej)] = el!)} src={ej.audioSrc} />
                    </button>
                  );
                })}
              </div>

              <div style={{ textAlign: "center", fontWeight: "600", color: "#222a5c" }}>Answers</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                {opciones.map(ej => {
                  const audio = Object.keys(paresCorrectos).find(k => paresCorrectos[k] === ej.respuesta);
                  const color = audio ? getColor(audio) : undefined;
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
                        minWidth: "140px",
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
                  Finish
                </button>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="finalizado" style={{ fontSize: "1.3rem" }}>
          <h2>✅ You have completed the listening exercise!</h2>
          <p>
            Correct matches: <strong>{Object.keys(paresCorrectos).length}</strong> / {ejercicios.length}
          </p>
          <p>Redirecting to the start of the level...</p>
        </div>
      )}
    </div>
  );
}
