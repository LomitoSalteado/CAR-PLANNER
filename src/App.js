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

// Importar el Hook de Media Queries
import { useMediaQuery } from 'react-responsive';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  // Detectar tamaños de pantalla
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 769px) and (max-width: 1024px)' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          }
        } catch (error) {
          console.error('Error al obtener el rol del usuario:', error);
        }
      } else {
        setUser(null);
        setUserRole(null);
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
    <div className="container">
      <Routes>
        {userRole === 'administrador' && (
          <>
            <Route path="/dashboard" element={<Dashboard userRole={userRole} />} />
            <Route path="/informacion-personal" element={<InformacionPersonal />} />
            <Route path="/asignar-chofer" element={<AsignarChofer />} />
            <Route path="/ver-vehiculos" element={<VerVehiculos />} />
            <Route path="/historial-informes" element={<HistorialInformesAdmin />} />
          </>
        )}

        {userRole === 'chofer' && (
          <>
            <Route path="/dashboard-chofer" element={<DashboardChofer />} />
            <Route path="/informacion-personal" element={<InformacionPersonal />} />
            <Route path="/vehiculos-asignados" element={<VehiculosAsignados />} />
            <Route path="/informe-diario" element={<InformeDiario />} />
          </>
        )}

        <Route path="*" element={userRole === 'administrador' ? <Navigate to="/dashboard" /> : <Navigate to="/dashboard-chofer" />} />
      </Routes>
    </div>
  );
}

export default App;
