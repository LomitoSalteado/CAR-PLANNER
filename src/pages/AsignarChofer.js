import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Importa tu configuración de Firebase
import { collection, getDocs, query, where, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import "../Styles/AsignarChofer.css";

function AsignarChofer() {
  const [choferes, setChoferes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [choferSeleccionado, setChoferSeleccionado] = useState('');
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState('');
  const [asignaciones, setAsignaciones] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    // Función para cargar choferes desde Firebase
    const fetchChoferes = async () => {
      try {
        const choferQuery = query(collection(db, 'users'), where('role', '==', 'chofer'));
        const querySnapshot = await getDocs(choferQuery);
        const choferesList = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((chofer) => chofer.name && chofer.name.trim() !== '');
        setChoferes(choferesList);
      } catch (err) {
        setError('Error al cargar los choferes.');
        console.error(err);
      }
    };

    // Función para cargar vehículos desde Firebase
    const fetchVehiculos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'vehiculos'));
        const vehiculosList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setVehiculos(vehiculosList);
      } catch (err) {
        setError('Error al cargar los vehículos.');
        console.error(err);
      }
    };

    // Función para cargar asignaciones desde Firebase
    const fetchAsignaciones = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'asignaciones'));
        const asignacionesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAsignaciones(asignacionesList);
      } catch (err) {
        setError('Error al cargar las asignaciones.');
        console.error(err);
      }
    };

    fetchChoferes();
    fetchVehiculos();
    fetchAsignaciones();
  }, []); // Ejecutar una vez al cargar el componente

  // Función para manejar la asignación de chofer a vehículo
  const handleAsignar = async () => {
    if (!choferSeleccionado || !vehiculoSeleccionado) {
      alert('Por favor, seleccione un chofer y un vehículo.');
      return;
    }

    const chofer = choferes.find((chofer) => chofer.id === choferSeleccionado);
    const vehiculo = vehiculos.find((vehiculo) => vehiculo.id === vehiculoSeleccionado);

    const nuevaAsignacion = {
      chofer: {
        nombre: chofer.name,
        rut: chofer.rut,
        licenseClass: chofer.licenseClass,
      },
      vehiculo: {
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        patente: vehiculo.patente,
      },
      fecha: new Date().toLocaleString(),
    };

    try {
      // Añadir asignación a la base de datos
      await addDoc(collection(db, 'asignaciones'), nuevaAsignacion);
      // Actualizar el estado local con la nueva asignación
      setAsignaciones((prevAsignaciones) => [...prevAsignaciones, nuevaAsignacion]);

      // Actualizar el estado del vehículo a 'asignado'
      await updateDoc(doc(db, 'vehiculos', vehiculo.id), {
        estado: 'asignado',
      });

      // Resetear los campos de selección
      setChoferSeleccionado('');
      setVehiculoSeleccionado('');
    } catch (err) {
      setError('Error al asignar el chofer al vehículo.');
      console.error(err);
    }
  };

  // Función para manejar la eliminación de una asignación
  const handleEliminarAsignacion = async (id) => {
    try {
      if (!id) {
        console.error("ID no válido para eliminar la asignación");
        return;
      }

      const asignacionAEliminar = asignaciones.find((asignacion) => asignacion.id === id);

      if (!asignacionAEliminar) {
        console.error("Asignación no encontrada");
        return;
      }

      // Eliminar la asignación de la base de datos
      await deleteDoc(doc(db, 'asignaciones', id));

      // Actualizar el estado local eliminando la asignación eliminada
      setAsignaciones((prevAsignaciones) => prevAsignaciones.filter((asignacion) => asignacion.id !== id));

      // Actualizar el estado del vehículo a 'disponible' si la asignación tiene un vehículo
      if (asignacionAEliminar && asignacionAEliminar.vehiculo) {
        const vehiculoId = asignacionAEliminar.vehiculo.id;

        if (vehiculoId) {
          await updateDoc(doc(db, 'vehiculos', vehiculoId), {
            estado: 'disponible',
          });
        } else {
          console.error("ID de vehículo no encontrado");
        }
      }
    } catch (err) {
      setError('Error al eliminar la asignación.');
      console.error(err);
    }
  };

  return (
    <div className="asignar-chofer-container">
      <h1>Asignar Chofer a Vehículo</h1>
      {error && <p className="error-message">{error}</p>}

      <div>
        <label>Choferes Disponibles:</label>
        <select
          value={choferSeleccionado}
          onChange={(e) => setChoferSeleccionado(e.target.value)}
          className="select-chofer"
        >
          <option value="">Seleccione un Chofer</option>
          {choferes.map((chofer) => (
            <option key={chofer.id} value={chofer.id}>
              {chofer.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Vehículos Disponibles:</label>
        <select
          value={vehiculoSeleccionado}
          onChange={(e) => setVehiculoSeleccionado(e.target.value)}
          className="select-vehiculo"
        >
          <option value="">Seleccione un Vehículo</option>
          {vehiculos.map((vehiculo) => (
            <option key={vehiculo.id} value={vehiculo.id}>
              {vehiculo.marca} {vehiculo.modelo}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleAsignar} className="button">
        Asignar Chofer
      </button>

      <h2>Asignaciones Realizadas</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre Chofer</th>
            <th>RUT Chofer</th>
            <th>Licencia Chofer</th>
            <th>Marca Vehículo</th>
            <th>Modelo Vehículo</th>
            <th>Patente Vehículo</th>
            <th>Fecha Asignación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asignaciones.map((asignacion) => (
            <tr key={asignacion.id}>
              <td>{asignacion.chofer.nombre}</td>
              <td>{asignacion.chofer.rut}</td>
              <td>{asignacion.chofer.licenseClass}</td>
              <td>{asignacion.vehiculo.marca}</td>
              <td>{asignacion.vehiculo.modelo}</td>
              <td>{asignacion.vehiculo.patente}</td>
              <td>{asignacion.fecha}</td>
              <td>
                <button
                  onClick={() => handleEliminarAsignacion(asignacion.id)}
                  className="button-eliminar"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => navigate('/')} className="button-volver">
        Volver
      </button>
    </div>
  );
}

export default AsignarChofer;
