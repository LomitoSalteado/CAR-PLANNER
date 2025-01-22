import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Importa BrowserRouter
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>  {/* Envolvemos la aplicación con BrowserRouter solo aquí */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
