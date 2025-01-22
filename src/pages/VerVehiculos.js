import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function VerVehiculos() {
  const navigate = useNavigate();

  // Estado para almacenar los vehículos
  const [vehiculos, setVehiculos] = useState([]);
  
  // Estado para almacenar los valores del formulario
  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    marca: '',
    modelo: '',
    patente: '',
  });

  // Simulación de datos iniciales (puedes sustituir esto con datos de tu backend)
  useEffect(() => {
    const vehiculosIniciales = [
      { marca: 'Toyota', modelo: 'Hilux', patente: 'ABC123' },
      { marca: 'Ford', modelo: 'Ranger', patente: 'XYZ789' },
      { marca: 'Nissan', modelo: 'Navara', patente: 'DEF456' },
    ];
    setVehiculos(vehiculosIniciales);
  }, []);

  // Función para manejar los cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoVehiculo({
      ...nuevoVehiculo,
      [name]: value,
    });
  };

  // Función para manejar el envío del formulario y agregar un vehículo
  const handleAddVehiculo = (e) => {
    e.preventDefault();

    // Verificamos si todos los campos están completos
    if (nuevoVehiculo.marca && nuevoVehiculo.modelo && nuevoVehiculo.patente) {
      setVehiculos([...vehiculos, nuevoVehiculo]); // Agregamos el nuevo vehículo a la lista
      setNuevoVehiculo({ marca: '', modelo: '', patente: '' }); // Limpiamos el formulario
    } else {
      alert('Por favor, complete todos los campos.');
    }
  };

  // Función para eliminar un vehículo
  const handleDeleteVehiculo = (index) => {
    const vehiculosRestantes = vehiculos.filter((_, i) => i !== index);
    setVehiculos(vehiculosRestantes); // Actualizamos la lista eliminando el vehículo seleccionado
  };

  return (
    <div>
      <h1>Ver Vehículos</h1>
      
      {/* Formulario para agregar un vehículo */}
      <h2>Agregar Nuevo Vehículo</h2>
      <form onSubmit={handleAddVehiculo}>
        <div>
          <label>Marca:</label>
          <input
            type="text"
            name="marca"
            value={nuevoVehiculo.marca}
            onChange={handleInputChange}
            placeholder="Ej: Toyota"
          />
        </div>
        <div>
          <label>Modelo:</label>
          <input
            type="text"
            name="modelo"
            value={nuevoVehiculo.modelo}
            onChange={handleInputChange}
            placeholder="Ej: Hilux"
          />
        </div>
        <div>
          <label>Patente:</label>
          <input
            type="text"
            name="patente"
            value={nuevoVehiculo.patente}
            onChange={handleInputChange}
            placeholder="Ej: ABC123"
          />
        </div>
        <button type="submit">Agregar Vehículo</button>
      </form>

      {/* Lista de vehículos */}
      {vehiculos.length > 0 ? (
        <table border="1" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Patente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((vehiculo, index) => (
              <tr key={index}>
                <td>{vehiculo.marca}</td>
                <td>{vehiculo.modelo}</td>
                <td>{vehiculo.patente}</td>
                <td>
                  {/* Botón de eliminación */}
                  <button onClick={() => handleDeleteVehiculo(index)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay vehículos registrados.</p>
      )}

      {/* Botón para regresar */}
      <button onClick={() => navigate(-1)}>Volver</button>
    </div>
  );
}

export default VerVehiculos;
