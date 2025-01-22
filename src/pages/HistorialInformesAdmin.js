import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; 
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

function HistorialInformesAdmin() {
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Función para obtener los informes de Firestore
  useEffect(() => {
    const fetchInformes = async () => {
      try {
        const informesSnapshot = await getDocs(collection(db, 'informes')); 
        const informesList = informesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
      setInformes(informes.filter(informe => informe.id !== id)); 
      setMessage('Informe eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el informe:', error);
      setMessage('Hubo un error al eliminar el informe');
    }
  };

  // Función para exportar los informes como CSV
  const handleExport = () => {
    const csvData = informes.map((informe) => ({
      nombreChofer: informe.nombreChofer,
      turno: informe.turno,
      vehiculo: informe.vehiculo,
      fecha: informe.fecha,
      comentarios: informe.comentarios,
    }));

    // Convertir a CSV
    const csvContent = "data:text/csv;charset=utf-8,"
      + ['Nombre Chofer', 'Turno', 'Vehículo', 'Fecha', 'Comentarios'].join(',') + '\n' 
      + csvData.map((row) => Object.values(row).join(',')).join('\n');

    // Crear un enlace y hacer que se descargue
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "informes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para volver a la página anterior
  const handleBack = () => {
    window.history.back(); // Vuelve a la página anterior
  };

  if (loading) {
    return <p>Cargando informes...</p>;
  }

  return (
    <div>
      <h1>Historial de Informes - Administrador</h1>
      {message && <p>{message}</p>}

      {informes.length === 0 ? (
        <p>No hay informes disponibles</p>
      ) : (
        <>
          <button onClick={handleExport}>Exportar Informes</button>
          <table>
            <thead>
              <tr>
                <th>Nombre del Chofer</th>
                <th>Turno</th>
                <th>Vehículo</th>
                <th>Fecha</th>
                <th>Comentarios</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {informes.map((informe) => (
                <tr key={informe.id}>
                  <td>{informe.nombreChofer}</td>
                  <td>{informe.turno}</td>
                  <td>{informe.vehiculo}</td>
                  <td>{informe.fecha}</td>
                  <td>{informe.comentarios}</td>
                  <td>
                    <button onClick={() => handleDelete(informe.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <button onClick={handleBack}>Volver</button>
    </div>
  );
}

export default HistorialInformesAdmin;
