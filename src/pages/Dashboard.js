import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import '../Styles/Dashboard.css'; // Importamos el archivo de estilo desde la carpeta Styles

function Dashboard({ userRole }) {
  const navigate = useNavigate();

  // Función para manejar las opciones del dashboard
  const handleOptionClick = (option) => {
    switch (option) {
      case 'informacion-personal':
        navigate('/informacion-personal');
        break;
      case 'asignar-chofer':
        navigate('/asignar-chofer');
        break;
      case 'ver-vehiculos':
        navigate('/ver-vehiculos');
        break;
      case 'historial-informes':
        navigate('/historial-informes');
        break;
      case 'informe-diario':  // Para los choferes
        navigate('/informe-diario');
        break;
      default:
        break;
    }
  };

  return (
    <div id="dashboard-container">
      <h2>Bienvenido a CarPlanner Administrador</h2>

      {userRole === 'administrador' && (
        <div className="button-container">
          <button onClick={() => handleOptionClick('informacion-personal')}>Información Personal</button>
          <button onClick={() => handleOptionClick('asignar-chofer')}>Asignar Chofer</button>
          <button onClick={() => handleOptionClick('ver-vehiculos')}>Ver Vehículos</button>
          <button onClick={() => handleOptionClick('historial-informes')}>Ver Historial</button>
        </div>
      )}
      {userRole === 'chofer' && (
        <div className="button-container">
          <button onClick={() => handleOptionClick('informe-diario')}>Informe Diario</button>
        </div>
      )}
      <button className="logout" onClick={() => signOut(auth)}>Cerrar sesión</button>
    </div>
  );
}

export default Dashboard;
