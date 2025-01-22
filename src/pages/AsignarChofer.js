import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AsignarChofer() {
  const navigate = useNavigate();

  const [chofer, setChofer] = useState({
    nombre: '',
    licencia: '',
    turno: 'diurno', // Valor por defecto
    vehiculoAsignado: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChofer({ ...chofer, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del chofer asignado:', chofer);
    // Aquí iría la lógica para guardar los datos en tu backend o base de datos
    alert('Chofer asignado con éxito');
  };

  return (
    <div>
      <h1>Asignar Chofer</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={chofer.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Licencia:</label>
          <input
            type="text"
            name="licencia"
            value={chofer.licencia}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Turno:</label>
          <select
            name="turno"
            value={chofer.turno}
            onChange={handleInputChange}
            required
          >
            <option value="diurno">Diurno</option>
            <option value="nocturno">Nocturno</option>
          </select>
        </div>
        <div>
          <label>Vehículo Asignado:</label>
          <input
            type="text"
            name="vehiculoAsignado"
            value={chofer.vehiculoAsignado}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Asignar</button>
      </form>
      
      {/* Botón para volver a la página anterior */}
      <button onClick={() => navigate(-1)}>Volver</button>
    </div>
  );
}

export default AsignarChofer;
