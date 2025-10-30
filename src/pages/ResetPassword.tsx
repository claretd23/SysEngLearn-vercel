import '../styles/ForgotPassword.css';
import logo from '../assets/logo.png';
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [searchParams] = useSearchParams(); // Obtiene los parámetros de la URL
  const token = searchParams.get('token'); // Token de recuperación
  const navigate = useNavigate(); // Hook para redirigir

  const [newPassword, setNewPassword] = useState(''); // Nueva contraseña
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirmación de contraseña
  const [message, setMessage] = useState(''); // Mensaje de éxito
  const [error, setError] = useState(''); // Mensaje de error

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validación: las contraseñas deben coincidir
    if (newPassword !== confirmPassword) {
      setError('❌ The passwords do not match');
      return;
    }

    try {
      // Llamada al backend para cambiar la contraseña
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/reset-password`, {
      token,
      newPassword
      });

      setMessage('✅ Password successfully updated');
      // Redirige a login después de 3 segundos
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      // Muestra error si falla la petición
      setError(err.response?.data?.message || '❌ Error changing password');
    }
  };

  // Si no hay token, muestra mensaje de error
  if (!token) return <p className="info-text">❌Invalid or not provided token.</p>;

  return (
    <div className="main-container forgot-container">
      <div className="card forgot-card">
        <div className="Fcard2">
          {/* Logo */}
          <div className="logo forgot-logo">
            <img src={logo} alt="Logo" className="logo-image" />
          </div>

          {/* Formulario de cambio de contraseña */}
          <form className="Fform" onSubmit={handleSubmit}>
            {/* Campo nueva contraseña */}
            <div className="Ffield">
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 17a2 2 0 0 0 2-2V9a2 2 0 0 0-4 0v6a2 2 0 0 0 2 2z" />
                <path d="M17 9V7a5 5 0 0 0-10 0v2" />
                <path d="M5 21h14a2 2 0 0 0 2-2v-6H3v6a2 2 0 0 0 2 2z" />
              </svg>
              <input
                type="password"
                className="Finput-field"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {/* Campo confirmar contraseña */}
            <div className="Ffield">
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 17a2 2 0 0 0 2-2V9a2 2 0 0 0-4 0v6a2 2 0 0 0 2 2z" />
                <path d="M17 9V7a5 5 0 0 0-10 0v2" />
                <path d="M5 21h14a2 2 0 0 0 2-2v-6H3v6a2 2 0 0 0 2 2z" />
              </svg>
              <input
                type="password"
                className="Finput-field"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Botón enviar */}
            <div className="Fbtn">
              <button type="submit" className="button1">Change password </button>
            </div>

            {/* Mensajes de éxito o error */}
            {message && <p className="info-text success-text">{message}</p>}
            {error && <p className="info-text error-text">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
