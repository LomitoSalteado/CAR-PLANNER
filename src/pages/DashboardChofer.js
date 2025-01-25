import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import '../Styles/DashboardChofer.css';

function DashboardChofer() {
  const navigate = useNavigate();

  // Función para manejar las opciones del dashboard
  const handleOptionClick = (option) => {
    switch (option) {
      case 'informacion-personal':
        navigate('/informacion-personal');
        break;
      case 'vehiculos-asignados':
        navigate('/vehiculos-asignados');
        break;
      case 'informe-diario':
        navigate('/informe-diario');
        break;
      default:
        break;
    }
  };

  return (
    <div id="dashboard-chofer">
      <h2>Bienvenido a CarPlanner</h2>
      <div className="button-group">
        <button 
          onClick={() => handleOptionClick('informacion-personal')} 
          className="btn btn-primary"
        >
          Información Personal
        </button>
        <button 
          onClick={() => handleOptionClick('vehiculos-asignados')} 
          className="btn btn-primary"
        >
          Vehículo Asignado
        </button>
        <button 
          onClick={() => handleOptionClick('informe-diario')} 
          className="btn btn-primary"
        >
          Informe Diario
        </button>
      </div>
      <button 
        onClick={() => signOut(auth)} 
        className="btn btn-secondary"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default DashboardChofer;
