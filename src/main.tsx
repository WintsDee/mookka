
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// On attend que la page soit chargée pour rendre l'app
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById("root");
  if (root) {
    createRoot(root).render(<App />);
  }
});
