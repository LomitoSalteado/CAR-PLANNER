import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

function HistorialInformesAdmin() {
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate(); // Hook para redireccionar

  // Función para obtener los informes de Firestore
  useEffect(() => {
    const fetchInformes = async () => {
      try {
        const informesSnapshot = await getDocs(collection(db, 'informes'));
        const informesList = informesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInformes(informesList);
      } catch (error) {
        console.error('Error al obtener los informes:', error);
        setMessage('Hubo un error al cargar los informes');
      }
      setLoading(false);
    };

    fetchInformes();
  }, []);

  // Función para eliminar un informe
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'informes', id));
      setInformes(informes.filter((informe) => informe.id !== id));
      setMessage('Informe eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el informe:', error);
      setMessage('Hubo un error al eliminar el informe');
    }
  };

  // Función para manejar el expandir/colapsar de los detalles
  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Función para manejar el botón "Volver" (redirigir al Dashboard)
  const handleVolver = () => {
    navigate('/dashboard'); // Redirige a Dashboard
  };

  // Función para exportar a CSV
  const headers = [
    { label: 'Fecha', key: 'fecha' },
    { label: 'Nombre del Chofer', key: 'nombreChofer' },
    { label: 'Patente', key: 'patenteVehiculo' },
    { label: 'Kilometraje Inicial', key: 'kilometrajeInicial' },
    { label: 'Kilometraje Final', key: 'kilometrajeFinal' },
    { label: 'Marca Vehículo', key: 'marcaVehiculo' },
    { label: 'Modelo Vehículo', key: 'modeloVehiculo' },
    { label: 'Observaciones', key: 'observaciones' },
    { label: 'RUT', key: 'rut' },
  ];

  const dataForCSV = informes.map((informe) => ({
    ...informe,
    fecha: informe.fecha && informe.fecha.seconds
      ? new Date(informe.fecha.seconds * 1000).toLocaleString()
      : 'Fecha inválida',
  }));

  if (loading) {
    return <p>Cargando informes...</p>;
  }

  return (
    <div className="historial-container">
      <h1 className="titulo">Historial de Informes</h1>
      {message && <p className="error-message">{message}</p>}

      <table className="informes-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Chofer</th>
            <th>Patente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {informes.map((informe) => (
            <React.Fragment key={informe.id}>
              <tr>
                <td>{new Date(informe.fecha.seconds * 1000).toLocaleString()}</td>
                <td>{informe.nombreChofer}</td>
                <td>{informe.patenteVehiculo}</td>
                <td>
                  <button
                    onClick={() => toggleDetails(informe.id)}
                    className="toggle-details-btn"
                  >
                    {expandedId === informe.id ? 'Ocultar Detalles' : 'Ver Detalles'}
                  </button>
                  <button
                    onClick={() => handleDelete(informe.id)}
                    className="delete-btn"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>

              {expandedId === informe.id && (
                <tr>
                  <td colSpan="4">
                    <p><strong>Kilometraje Inicial:</strong> {informe.kilometrajeInicial}</p>
                    <p><strong>Kilometraje Final:</strong> {informe.kilometrajeFinal}</p>
                    <p><strong>Observaciones:</strong> {informe.observaciones}</p>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Botones "Volver" y "Exportar" al final */}
      <div className="action-buttons">
        <button
          onClick={handleVolver}
          className="volver-btn"
        >
          Volver
        </button>

        <CSVLink data={dataForCSV} headers={headers} filename="informes.csv">
          <button className="export-btn">
            Exportar a CSV
          </button>
        </CSVLink>
      </div>
    </div>
  );
}

export default HistorialInformesAdmin;
