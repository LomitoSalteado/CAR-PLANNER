import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // Asegúrate de que esta ruta sea correcta

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Limpiar mensaje de error antes de intentar crear usuario

    const userRole = 'usuario';  // Asignamos el rol predeterminado

    console.log(`Correo ingresado: ${email}`);
    console.log(`Rol asignado: ${userRole}`);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Guardar rol y datos en Firestore
        await setDoc(doc(db, 'users', user.uid), {
          role: userRole,
          email: user.email,
          createdAt: new Date(),
        });

        // Redirigir al login después del registro exitoso
        navigate('/login');
      })
      .catch((error) => {
        setError(error.message);
        console.error('Error al registrar usuario: ', error.message);
      });
  };

  return (
    <div>
      <h2>Registro</h2>
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
        <button type="submit">Registrarse</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
      </div>
    </div>
  );
};

export default Register;
