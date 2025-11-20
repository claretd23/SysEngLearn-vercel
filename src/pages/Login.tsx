import '../styles/Login.css';
import logo from "../../assets/LOGO.svg";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext, FormEvent } from 'react';
import { loginUser } from '../services/apiClient';
import { AuthContext } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Contexto para guardar token y usuario

  const [email, setEmail] = useState(''); // Email ingresado
  const [password, setPassword] = useState(''); // Contraseña ingresada
  const [errorMsg, setErrorMsg] = useState(''); // Mensaje de error si falla login

  // Maneja el submit del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('📤 Intentando login con:', { email, password });

    try {
      // Llamada al backend para login
      const data = await loginUser(email, password);
      console.log('✅ Login exitoso:', data);

      // Guardamos token y usuario en contexto y localStorage
      login(data.token, data.user);
      localStorage.setItem('token', data.token);

      // Determinamos ruta según nivel o rol del usuario
      const nivel = data.user.level ? data.user.level.trim().toUpperCase() : null;
      const role = data.user.role ? data.user.role.trim().toLowerCase() : null;

      console.log('Nivel recibido:', nivel);
      console.log('Role recibido:', role);

      if (nivel && ["A1", "A2", "B1", "B2", "C1", "C2"].includes(nivel)) {
        navigate(`/inicio/${nivel}`); // Redirige a la página de inicio según nivel
      } else if (role === "admin" || role === "superadmin") {
        navigate("/admin"); // Redirige al dashboard admin
      } else {
        navigate("/user-home"); // Redirige a la página de usuario general
      }
    } catch (error: any) {
      // Captura errores y muestra mensaje
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error desconocido. Revisa la consola.";

      console.error("❌ Error en login:", error.response || error);
      setErrorMsg(message);
      alert(`Login failed: ${message}`);
    }
  };

  return (
    <div className="main-container">
      <div className="login-wrapper">
        
        {/* Lado izquierdo con logo */}
        <div className="login-left">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        {/* Lado derecho con formulario */}
        <div className="login-right">
          <h2>Welcome Back</h2>

          <form className="form" onSubmit={handleSubmit}>
            {/* Campo email */}
            <div className="field">
              <svg
                className="input-icon email-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M3 6h18v12H3z" />
                <path d="M3 6l9 7 9-7" />
              </svg>
              <input
                type="email"
                className="input-field"
                placeholder="E-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Campo password */}
            <div className="field">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 17C13.1046 17 14 16.1046 14 15V12H10V15C10 16.1046 10.8954 17 12 17Z"
                  fill="currentColor"
                />
                <path
                  d="M17 8V7C17 4.79086 15.2091 3 13 3H11C8.79086 3 7 4.79086 7 7V8H5V20H19V8H17ZM9 7C9 5.89543 9.89543 5 11 5H13C14.1046 5 15 5.89543 15 7V8H9V7Z"
                  fill="currentColor"
                />
              </svg>
              <input
                type="password"
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Botón login */}
            <div className="btn">
              <button type="submit" className="button1">
                Login
              </button>
            </div>

            {/* Mensaje de error */}
            {errorMsg && (
              <p className="info-text" style={{ color: 'red' }}>
                {errorMsg}
              </p>
            )}

            {/* Links de recuperación y registro */}
            <p className="info-text">
              <Link to="/forgot-password">Recover password</Link>
            </p>
            <p className="info-text">
              Don't have an account? Contact the administrator.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
