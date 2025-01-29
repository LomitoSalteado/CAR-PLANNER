import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where, addDoc, orderBy, limit } from "firebase/firestore"; // Importar funciones adicionales
import { Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importar para la autenticación
import '../Styles/InformeDiario.css';

const InformeDiario = () => {
  const [nombreChofer, setNombreChofer] = useState("");
  const [rut, setRut] = useState("");
  const [patenteVehiculo, setPatenteVehiculo] = useState("");
  const [kilometrajeInicial, setKilometrajeInicial] = useState("");
  const [kilometrajeFinal, setKilometrajeFinal] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth(); // Obtener el usuario autenticado
        const user = auth.currentUser; // Obtener el usuario autenticado

        if (user) {
          // Utilizamos el RUT del usuario autenticado
          const userRut = user.email.split("@")[0]; // Asumimos que el RUT es el email antes de la arroba. Cambia según tu lógica

          const asignacionesRef = collection(db, "asignaciones");
          const q = query(asignacionesRef, where("chofer.rut", "==", userRut)); // Filtrar por RUT
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const asignacionData = querySnapshot.docs[0].data();
            const { chofer, vehiculo } = asignacionData;

            setNombreChofer(chofer.nombre || "");
            setRut(chofer.rut || "");
            setPatenteVehiculo(vehiculo?.patente || "");
          } else {
            console.warn("No se encontró información de asignación para este usuario.");
          }

          // Obtener el último informe para establecer el kilometraje inicial
          const informesRef = collection(db, "informes");
          const informesQuery = query(informesRef, where("rut", "==", userRut), orderBy("fecha", "desc"), limit(1));
          const lastInformeSnapshot = await getDocs(informesQuery);

          if (!lastInformeSnapshot.empty) {
            const lastInforme = lastInformeSnapshot.docs[0].data();
            const lastKilometrajeFinal = lastInforme.kilometrajeFinal;
            setKilometrajeInicial(lastKilometrajeFinal); // Usamos el kilometrajeFinal del último informe como kilometrajeInicial
          }

        } else {
          console.warn("No hay un usuario autenticado.");
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []); // Ejecutar solo una vez al montarse el componente

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const informeData = {
        nombreChofer,
        rut,
        patenteVehiculo,
        kilometrajeInicial,
        kilometrajeFinal,
        observaciones,
        fecha: Timestamp.now(),
      };

      await addDoc(collection(db, "informes"), informeData);

      alert("Informe enviado con éxito.");
      navigate("/informe-exitoso");
    } catch (err) {
      console.error("Error al enviar el informe:", err);
      alert("Hubo un error al enviar el informe.");
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate("/"); // Ajusta la ruta según sea necesario
  };

  const handleRutChange = (e) => {
    // Obtener el valor y eliminar cualquier carácter que no sea número ni guion
    let value = e.target.value.replace(/[^0-9-]/g, "");

    // Formatear el RUT para que tenga el guion en la posición correcta
    if (value.length > 1 && value.indexOf("-") === -1) {
      value = value.slice(0, value.length - 1) + "-" + value.charAt(value.length - 1);
    }

    setRut(value);
  };

  return (
    <div id="informe-diario">
      <h1>Informe Diario</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre Chofer:</label>
          <input
            type="text"
            value={nombreChofer}
            onChange={(e) => setNombreChofer(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>RUT:</label>
          <input
            type="text"
            value={rut}
            onChange={handleRutChange}
            className="form-control"
            placeholder="Ingrese el RUT (ej. 12345678-9)"
          />
        </div>
        <div className="form-group">
          <label>Patente Vehículo:</label>
          <input
            type="text"
            value={patenteVehiculo}
            onChange={(e) => setPatenteVehiculo(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Kilometraje Inicial:</label>
          <input
            type="number"
            value={kilometrajeInicial}
            onChange={(e) => setKilometrajeInicial(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Kilometraje Final:</label>
          <input
            type="number"
            value={kilometrajeFinal}
            onChange={(e) => setKilometrajeFinal(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Observaciones:</label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows="4"
            className="form-control"
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Enviando..." : "Enviar Informe"}
        </button>
        <button type="button" onClick={handleVolver} className="btn btn-primary">
          Volver
        </button>
      </form>
    </div>
  );
};

export default InformeDiario;
