// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebaseConfig'; // Asegúrate de tener el archivo firebaseConfig.js bien configurado
import { onAuthStateChanged } from 'firebase/auth';

// Creamos el contexto
const AuthContext = createContext();

// Componente proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Guardamos al usuario
  const [loading, setLoading] = useState(true); // Estado para esperar la verificación del usuario

  useEffect(() => {
    // Verificamos el estado de la autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Si hay un usuario autenticado, lo guardamos
      } else {
        setUser(null); // Si no hay usuario, lo dejamos en null
      }
      setLoading(false); // Termina la carga cuando el usuario está verificado
    });

    // Limpiamos el listener cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  // El valor que proveeremos a los consumidores del contexto
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook para usar el contexto más fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};
