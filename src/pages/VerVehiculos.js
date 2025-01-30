import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';  // Importa la configuración de Firebase
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../Styles/VerVehiculos.css';  // Importar el archivo de estilos

function VerVehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    marca: '',
    modelo: '',
    patente: '',
    fechaMantenimiento: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Cargar vehículos desde Firebase
  useEffect(() => {
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
    fetchVehiculos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoVehiculo({
      ...nuevoVehiculo,
      [name]: value,
    });
  };

  const handleAddVehiculo = async (e) => {
    e.preventDefault();

    if (!nuevoVehiculo.marca || !nuevoVehiculo.modelo || !nuevoVehiculo.patente || !nuevoVehiculo.fechaMantenimiento) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    try {
      const vehiculoRef = collection(db, 'vehiculos');
      const docRef = await addDoc(vehiculoRef, nuevoVehiculo);

      setVehiculos([...vehiculos, { id: docRef.id, ...nuevoVehiculo }]);
      setNuevoVehiculo({ marca: '', modelo: '', patente: '', fechaMantenimiento: '' });
    } catch (err) {
      setError('Error al agregar el vehículo.');
      console.error(err);
    }
  };

  const handleDeleteVehiculo = async (id) => {
    try {
      await deleteDoc(doc(db, 'vehiculos', id));
      setVehiculos(vehiculos.filter((vehiculo) => vehiculo.id !== id));
    } catch (err) {
      setError('Error al eliminar el vehículo.');
      console.error(err);
    }
  };

  const handleBack = () => {
    navigate('/'); // Cambiar según la ruta deseada
  };

  return (
    <div className="ver-vehiculos-container">
      <h1>Ver Vehículos</h1>
      {error && <p className="error-message">{error}</p>}

      <h2>Agregar Nuevo Vehículo</h2>
      <form onSubmit={handleAddVehiculo} className="form-container">
        <div className="form-group">
          <label>Marca:</label>
          <input
            type="text"
            name="marca"
            value={nuevoVehiculo.marca}
            onChange={handleInputChange}
            placeholder="Ej: Toyota"
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Modelo:</label>
          <input
            type="text"
            name="modelo"
            value={nuevoVehiculo.modelo}
            onChange={handleInputChange}
            placeholder="Ej: Hilux"
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Patente:</label>
          <input
            type="text"
            name="patente"
            value={nuevoVehiculo.patente}
            onChange={handleInputChange}
            placeholder="Ej: ABC123"
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Fecha de Mantenimiento:</label>
          <input
            type="date"
            name="fechaMantenimiento"
            value={nuevoVehiculo.fechaMantenimiento}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>
        <button type="submit" className="button">Agregar Vehículo</button>
      </form>

      <h2>Vehículos Registrados</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Patente</th>
            <th>Fecha de Mantenimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((vehiculo) => (
            <tr key={vehiculo.id}>
              <td>{vehiculo.marca}</td>
              <td>{vehiculo.modelo}</td>
              <td>{vehiculo.patente}</td>
              <td>{vehiculo.fechaMantenimiento}</td>
              <td>
                <button
                  onClick={() => handleDeleteVehiculo(vehiculo.id)}
                  className="button-eliminar"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleBack} className="button-volver">Volver</button>
    </div>
  );
}

export default VerVehiculos;
