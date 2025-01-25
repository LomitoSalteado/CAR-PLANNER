import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importar BrowserRouter
import App from './App';
import { AuthProvider } from './context/AuthContext';

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
