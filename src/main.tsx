
import { createRoot } from 'react-dom/client'
import React from 'react';
import App from './App.tsx'
import './index.css'
import { preloadCriticalComponents, preloadSecondaryComponents } from './preload.ts';

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

// Preload critical images
const preloadImages = () => {
  const imagesToPreload = [
    '/lovable-uploads/59160824-2c34-4d40-82c6-d9f9f5b4d1f3.png', // Logo
    '/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png', // Background
  ];
  
  imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// Start preloading images
preloadImages();
