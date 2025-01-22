import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AsignarChofer from './pages/AsignarChofer';
import VerVehiculos from './pages/VerVehiculos';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import HistorialInformesAdmin from './pages/HistorialInformesAdmin';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/asignar-chofer" element={<AsignarChofer />} />
      <Route path="/ver-vehiculos" element={<VerVehiculos />} />
      <Route path="/historial-informes" element={<HistorialInformesAdmin />} /> {/* Nueva ruta */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
