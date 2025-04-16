
import { useState, useEffect } from 'react';

type UpdateStatus = 'pending' | 'available' | 'updating' | 'updated' | 'error';

export function useServiceWorkerUpdate() {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('pending');
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Vérifier si le SW est déjà enregistré
      navigator.serviceWorker.getRegistration().then(reg => {
        if (reg) {
          setRegistration(reg);
          
          // Vérifier s'il y a des mises à jour en attente
          if (reg.waiting) {
            setUpdateStatus('available');
          }
        }

        // Enregistrer le service worker s'il n'existe pas
        if (!reg) {
          navigator.serviceWorker.register('/service-worker.js')
            .then(newReg => {
              setRegistration(newReg);
              console.log('Service Worker enregistré');
            })
            .catch(error => {
              console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
              setUpdateStatus('error');
            });
        }
      });

      // Écouter les mises à jour
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateStatus('updated');
      });
    }
  }, []);

  useEffect(() => {
    if (!registration) return;

    // Vérifier s'il y a une mise à jour
    const handleUpdate = () => {
      if (registration.waiting) {
        setUpdateStatus('available');
      }
    };

    // Configurer un écouteur d'événements pour les changements d'état
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          setUpdateStatus('available');
        }
      });
    });

    // Vérifier immédiatement
    handleUpdate();

    // Vérifier périodiquement les mises à jour
    const interval = setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000); // Vérifier chaque heure

    return () => clearInterval(interval);
  }, [registration]);

  const applyUpdate = () => {
    if (registration && registration.waiting) {
      setUpdateStatus('updating');
      // Envoyer un message au service worker pour passer à la nouvelle version
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return { updateStatus, applyUpdate, reloadPage };
}
