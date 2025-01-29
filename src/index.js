import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importar BrowserRouter
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Importar el archivo serviceWorkerRegistration desde la carpeta src
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; 

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <AuthProvider>
    <React.StrictMode>
      <BrowserRouter> {/* Envolvemos la aplicación con BrowserRouter */}
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </AuthProvider>
);

// Registramos el Service Worker para habilitar la funcionalidad PWA
serviceWorkerRegistration.register();
