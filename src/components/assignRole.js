// /src/components/AssignRole.js

import { useState } from 'react';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';  // Importa la configuración de Firebase

function AssignRole() {
  const [userEmail, setUserEmail] = useState('');
  const [role, setRole] = useState('user');  // Valor predeterminado para el rol

  // Función para asignar el rol al usuario
  const assignRole = async () => {
    const userRef = doc(db, 'users', userEmail);  // Referencia al documento del usuario en Firestore

    try {
      // Actualiza el documento del usuario con el nuevo rol
      await setDoc(userRef, { role }, { merge: true });  // merge: true para no sobrescribir otros campos
      alert(`Rol ${role} asignado correctamente al usuario ${userEmail}`);
    } catch (error) {
      console.error("Error al asignar el rol: ", error);
      alert("Error al asignar el rol. Inténtalo de nuevo.");
    }
  };

  return (
    <div>
      <h2>Asignar Rol a Usuario</h2>
      <div>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}  // Actualiza el correo del usuario
          placeholder="Correo del usuario"
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        <button onClick={assignRole}>Asignar Rol</button>
      </div>
    </div>
  );
}

export default AssignRole;
