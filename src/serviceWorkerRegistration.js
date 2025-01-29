// Este archivo maneja la instalación del service worker.

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/127(\.[0-9]+){3}/)
  );
  
  export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      // El Service Worker solo se puede registrar en producción.
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
      if (publicUrl.origin !== window.location.origin) {
        // Si la URL pública no coincide con la URL de origen, no podemos registrar un service worker.
        return;
      }
  
      window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
        if (isLocalhost) {
          // Verifica si estamos en localhost, entonces muestra el service worker en el navegador.
          checkValidServiceWorker(swUrl, config);
        } else {
          // Si no estamos en localhost, simplemente registra el service worker.
          registerValidSW(swUrl, config);
        }
      });
    }
  }
  
  function registerValidSW(swUrl, config) {
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Nueva versión de la app disponible.
                console.log('Nuevo contenido disponible, por favor recargue la página.');
              } else {
                // Contenido almacenado en caché por primera vez.
                console.log('La aplicación está lista para usarse sin conexión.');
              }
            }
          };
        };
      })
      .catch((error) => {
        console.error('Error al registrar el service worker:', error);
      });
  }
  
  function checkValidServiceWorker(swUrl, config) {
    // Verifica si el service worker existe.
    fetch(swUrl)
      .then((response) => {
        if (
          response.status === 404 ||
          response.headers.get('content-type')?.indexOf('javascript') === -1
        ) {
          // Si no hay un archivo service-worker.js, no registramos el service worker.
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister();
          });
        } else {
          // Si el archivo service-worker.js es válido, lo registramos.
          registerValidSW(swUrl, config);
        }
      })
      .catch(() => {
        console.log('No se ha podido conectar al servidor. ¡No se puede registrar el service worker!');
      });
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.unregister();
      });
    }
  }
  