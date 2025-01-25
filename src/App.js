import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AsignarChofer from './pages/AsignarChofer';
import VerVehiculos from './pages/VerVehiculos';
import HistorialInformesAdmin from './pages/HistorialInformesAdmin';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import VehiculosAsignados from "./pages/VehiculosAsignados";
import InformeDiario from "./pages/InformeDiario";
import DashboardChofer from './pages/DashboardChofer';
import InformacionPersonal from './pages/InformacionPersonal';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const fetchedRole = userDoc.data().role;
            setUserRole(fetchedRole);  // Set the user role
          }
        } catch (error) {
          console.error('Error al obtener el rol del usuario:', error);
        }
      } else {
        setUser(null);
        setUserRole(null);  // Limpiar rol cuando no hay usuario
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Si estamos cargando, mostramos un mensaje
  if (loading) {
    return <p>Cargando...</p>;
  }

  // Si no hay usuario autenticado, redirigir a login
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // Si el usuario está autenticado, mostramos las rutas correspondientes
  return (
    <Routes>
      {/* Rutas específicas para administradores */}
      {userRole === 'administrador' && (
        <>
          <Route path="/dashboard" element={<Dashboard userRole={userRole} />} />
          <Route path="/informacion-personal" element={<InformacionPersonal />} />
          <Route path="/asignar-chofer" element={<AsignarChofer />} />
          <Route path="/ver-vehiculos" element={<VerVehiculos />} />
          <Route path="/historial-informes" element={<HistorialInformesAdmin />} />
        </>
      )}

      {/* Rutas específicas para choferes */}
      {userRole === 'chofer' && (
        <>
          <Route path="/dashboard-chofer" element={<DashboardChofer />} />
          <Route path="/informacion-personal" element={<InformacionPersonal />} />
          <Route path="/vehiculos-asignados" element={<VehiculosAsignados />} />
          <Route path="/informe-diario" element={<InformeDiario />} />
        </>
      )}

      {/* Redirección por defecto, que lleva directamente al dashboard de acuerdo al rol */}
      <Route path="*" element={userRole === 'administrador' ? <Navigate to="/dashboard" /> : <Navigate to="/dashboard-chofer" />} />
    </Routes>
  );
}

export default App;
