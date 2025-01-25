import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { updateEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../Styles/InformacionPersonal.css"; // Correcta ruta del archivo CSS

const InformacionPersonal = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [licenseClass, setLicenseClass] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.name || "");
          setAddress(userData.address || "");
          setPhone(userData.phone || "");
          setRole(userData.role || "");
          setLicenseClass(userData.licenseClass || "");
          setRut(userData.rut || "");
          setEmail(user.email || "");
        } else {
          console.log("No se encontró la información del usuario.");
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSaveClick = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, "users", user.uid);

      // Actualizar Firestore
      await updateDoc(docRef, {
        address: address || "",
        phone: phone || "",
      });

      // Actualizar el correo en Firebase Auth
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      setSaveMessage("¡Datos guardados correctamente!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Error al actualizar información:", error);
      setSaveMessage("Hubo un error al guardar los datos.");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (!user) {
    return <div>Debes iniciar sesión para ver esta información.</div>;
  }

  return (
    <div className="form-container">
      <h1>Información Personal</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <form>
          <div>
            <label htmlFor="name">Nombre Completo:</label>
            <input
              type="text"
              id="name"
              className="read-only"
              value={name}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="address">Dirección:</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="phone">Teléfono:</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="role">Rol:</label>
            <input
              type="text"
              id="role"
              className="read-only"
              value={role}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="licenseClass">Licencia clase: </label>
            <input
              type="text"
              id="licenseClass"
              className="read-only"
              value={licenseClass}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="rut">RUT:</label>
            <input
              type="text"
              id="rut"
              className="read-only"
              value={rut}
              readOnly
            />
          </div>

          {/* Botones centrados */}
          <div className="button-container">
            <button type="button" onClick={handleSaveClick}>
              Guardar
            </button>
            <button type="button" onClick={handleBackClick}>
              Volver
            </button>
          </div>
        </form>
      )}
      {saveMessage && <p>{saveMessage}</p>}
    </div>
  );
};

export default InformacionPersonal;
