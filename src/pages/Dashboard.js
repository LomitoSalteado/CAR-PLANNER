import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

function Dashboard() {
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    switch (option) {
      case 'asignarChofer':
        navigate('/asignar-chofer');
        break;
      case 'verVehiculos':
        navigate('/ver-vehiculos');
        break;
      case 'historialInformes':
        navigate('/historial-informes');
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div>
      <h1>Bienvenido al Dashboard</h1>

      <div>
        <button onClick={() => handleOptionClick('asignarChofer')}>
          Asignar Chofer
        </button>
        <button onClick={() => handleOptionClick('verVehiculos')}>
          Ver Vehículos
        </button>
        <button onClick={() => handleOptionClick('historialInformes')}>
          Historial de Informes
        </button>
      </div>

      <div>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default Dashboard;
