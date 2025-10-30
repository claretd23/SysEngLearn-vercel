import '../styles/ForgotPassword.css';
import logo from '../assets/logo.png';
import { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState(''); // Estado para el correo ingresado
  const [message, setMessage] = useState(''); // Estado para mostrar mensajes de éxito o error

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Petición al backend para enviar enlace de recuperación
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/forgot-password`, { email });
      setMessage('📩 Se envió un enlace a tu correo electrónico.');
    } catch (error) {
      console.error(error);
      setMessage('❌ Error al enviar el correo. Intenta de nuevo.');
    }
  };

  return (
    <div className="main-container forgot-container">
      <div className="card forgot-card">
        <div className="Fcard2">
          {/* Logo */}
          <div className="logo forgot-logo">
            <img src={logo} alt="Logo" className="logo-image" />
          </div>

          {/* Formulario de recuperación */}
          <form className="Fform" onSubmit={handleSubmit}>
            <div className="Ffield">
              {/* Icono de email */}
              <svg className="input-icon email-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M3 6h18v12H3z" />
                <path d="M3 6l9 7 9-7" />
              </svg>
              <input
                type="email"
                className="Finput-field"
                placeholder="E-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Botón de envío */}
            <div className="Fbtn">
              <button type="submit" className="Fbutton1">

                Send link
              </button>
            </div>

            {/* Link para iniciar sesión */}
            <p className="info-text">
              Do you already have an account?<a href="/login">Log in</a>
            </p>

            {/* Mensaje de feedback */}
            {message && <p className="info-text">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
