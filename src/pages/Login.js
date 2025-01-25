import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Asegúrate de que tengas la referencia a Firestore configurada
import '../Styles/Login.css'; // Importamos el archivo de estilo desde la carpeta Styles

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Intentar iniciar sesión con las credenciales
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verificar si el usuario es un chofer
      const userDocRef = doc(db, 'users', user.uid); // Asegúrate de que tu colección de usuarios se llama "users"
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.role === 'chofer') {
          // Si es un chofer, redirige al dashboard de chofer
          navigate('/dashboard-chofer');
        } else {
          // Si no es un chofer, redirige al dashboard general
          navigate('/dashboard');
        }
      } else {
        throw new Error('Usuario no encontrado en la base de datos');
      }
    } catch (err) {
      setError('Error al iniciar sesión: ' + err.message);
    }
  };

  return (
    <div id="login-container">
      <h1>CarPlanner</h1> {/* Título principal */}
      <h2>Inicio de sesión</h2> {/* Subtítulo */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Iniciar sesión</button>
      </form>
      <p>
        ¿No tienes cuenta?{' '}
        <button onClick={() => navigate('/register')}>Registrarse</button>
      </p>
    </div>
  );
}

export default Login;
