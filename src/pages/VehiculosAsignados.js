import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; 
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth'; // Importar para la autenticación
import '../Styles/VehiculosAsignados.css';

const VehiculosAsignados = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [choferId, setChoferId] = useState(null); // Estado para el RUT del chofer
  const navigate = useNavigate();

  // Obtener el RUT del chofer desde Firestore
  useEffect(() => {
    const fetchChoferId = async () => {
      try {
        const auth = getAuth(); // Obtén la instancia de autenticación
        const user = auth.currentUser; // Obtén el usuario autenticado
        
        if (user) {
          // Obtener el documento del chofer correspondiente al usuario autenticado
          const choferRef = doc(db, 'users', user.uid); // Asumimos que los choferes están en la colección 'users'
          const choferSnap = await getDoc(choferRef);
          
          if (choferSnap.exists()) {
            const choferData = choferSnap.data();
            setChoferId(choferData.rut); // Guarda el RUT del chofer
          } else {
            setError("No se encontró información del chofer.");
          }
        } else {
          setError("No estás autenticado.");
        }
      } catch (err) {
        console.error("Error al obtener el RUT del chofer:", err);
        setError("No se pudo obtener la información del chofer.");
      }
    };

    fetchChoferId();
  }, []);

  // Cargar los vehículos asignados cuando el choferId esté disponible
  useEffect(() => {
    const fetchVehiculosAsignados = async () => {
      if (!choferId) return; // Si no se ha obtenido el RUT, no hace la consulta

      try {
        const asignacionesRef = collection(db, 'asignaciones');
        const q = query(asignacionesRef, where('chofer.rut', '==', choferId)); // Usa el RUT dinámico
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("No se encontraron vehículos asignados para este chofer.");
        } else {
          const fetchedVehiculos = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              marca: data.vehiculo.marca,
              modelo: data.vehiculo.modelo,
              patente: data.vehiculo.patente,
              fechaAsignacion: data.fecha,
            };
          });

          setVehiculos(fetchedVehiculos);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar los vehículos:", err);
        setError("No se pudieron cargar los vehículos.");
        setLoading(false);
      }
    };

    fetchVehiculosAsignados();
  }, [choferId]); // Reintenta cuando el choferId esté disponible

  if (loading) {
    return <p>Cargando vehículos asignados...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="vehiculos-container">
      <h1>Vehículos Asignados</h1>
      {vehiculos.length === 0 ? (
        <p>No tienes vehículos asignados.</p>
      ) : (
        <table className="vehiculos-table">
          <thead>
            <tr>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Patente</th>
              <th>Fecha de Asignación</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((vehiculo) => (
              <tr key={vehiculo.id}>
                <td>{vehiculo.marca}</td>
                <td>{vehiculo.modelo}</td>
                <td>{vehiculo.patente}</td>
                <td>{vehiculo.fechaAsignacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="back-button-container">
        <button onClick={() => navigate('/dashboard-chofer')} className="back-button">Volver</button>
      </div>
    </div>
  );
};

export default VehiculosAsignados;
