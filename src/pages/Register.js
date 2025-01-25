import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('chofer'); // Valor por defecto para el rol
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseClass, setLicenseClass] = useState(''); // Cambiado de licenseNumber a licenseClass
  const [rut, setRut] = useState(''); // Nuevo estado para el RUT
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Limpiar mensaje de error antes de intentar crear usuario

    if (!name.trim() || !address.trim() || !phone.trim() || !licenseClass.trim() || !rut.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Guardar el rol y la información personal en Firestore
        await setDoc(doc(db, 'users', user.uid), {
          role: role,
          email: user.email,
          name: name,
          address: address,
          phone: phone,
          licenseClass: licenseClass, // Guardamos la clase de licencia
          rut: rut, // Guardar RUT
          createdAt: new Date(),
        });

        // Redirigir a la página de login después de completar el registro
        navigate('/login');
      })
      .catch((error) => {
        setError(error.message);
        console.error('Error al registrar usuario: ', error.message);
      });
  };

  return (
    <div>
      <h2>Registro Completo</h2>
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
        <div>
          <label>Rol</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="chofer">Chofer</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>
        <div>
          <label>Nombre Completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Dirección</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Teléfono</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Licencia Clase </label>
          <input
            type="text"
            value={licenseClass}
            onChange={(e) => setLicenseClass(e.target.value)}
            required
            maxLength="2" // Limita la longitud de la licencia
          />
        </div>
        <div>
          <label>RUT (sin puntos ni guion)</label>
          <input
            type="text"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
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
