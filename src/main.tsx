
import { createRoot } from 'react-dom/client'
import React from 'react';
import App from './App.tsx'
import './index.css'
import { preloadCriticalComponents, preloadSecondaryComponents } from './preload.ts';

// Fonction de préchargement d'images améliorée pour chargement instantané
const preloadCriticalImages = () => {
  // Images critiques qui doivent être chargées immédiatement
  const criticalImages = [
    '/lovable-uploads/59160824-2c34-4d40-82c6-d9f9f5b4d1f3.png', // Logo
    '/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png', // Background
  ];
  
  // Préchargement en parallèle avec priorité haute
  criticalImages.forEach(src => {
    // Technique 1: Image object
    const img = new Image();
    img.src = src;
    img.fetchPriority = 'high';
    img.decoding = 'sync';
    
    // Technique 2: Préchargement via XHR pour mise en cache du navigateur
    const xhr = new XMLHttpRequest();
    xhr.open('GET', src, true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
      if (this.status === 200) {
        const objectURL = URL.createObjectURL(this.response);
        const tempImg = new Image();
        tempImg.src = objectURL;
        setTimeout(() => URL.revokeObjectURL(objectURL), 60); // Nettoyer après chargement
      }
    };
    xhr.send();
  });
};

// Préchargement immédiat - avant même le rendu React
preloadCriticalImages();

// Ensure React is in scope
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Preload critical components during initial load
  preloadCriticalComponents();
  
  // Preload secondary components during idle time
  setTimeout(() => {
    preloadSecondaryComponents();
  }, 2000);
}

// Précharger des images supplémentaires après le chargement initial
window.addEventListener('load', () => {
  const imagesToPreload = [
    // Autres images moins critiques à précharger
  ];
  
  if ('requestIdleCallback' in window) {
    // @ts-ignore - TypeScript ne reconnaît pas requestIdleCallback
    window.requestIdleCallback(() => {
      imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    });
  } else {
    // Fallback pour les navigateurs sans requestIdleCallback
    setTimeout(() => {
      imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }, 1000);
  }
});
