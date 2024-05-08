/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

const InstallPWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault(); // Evita que el evento 'beforeinstallprompt' dispare el cuadro de diálogo de instalación automáticamente
      setIsInstallable(true);
      window.deferredPrompt = event; // Almacena el evento para usarlo más tarde
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt(); // Muestra el cuadro de diálogo de instalación
      window.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('El usuario aceptó instalar la PWA');
        } else {
          console.log('El usuario rechazó instalar la PWA');
        }
        window.deferredPrompt = null; // Limpia el evento para evitar que se vuelva a mostrar el cuadro de diálogo
        setIsInstallable(false);
      });
    }
  };

  return (
    <div>
      {isInstallable && (
        <button onClick={handleInstallClick}>Instalar PWA</button>
      )}
    </div>
  );
};

export default InstallPWA;
