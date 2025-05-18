
import React from "react";
import { useNavigate } from "react-router-dom";

// This file exports React components that can be used in the toast actions
// It must be a .tsx file since it contains JSX

export const LoginButton = ({ onLogin }: { onLogin: () => void }) => (
  <button 
    className="bg-white text-black px-2 py-1 rounded text-xs"
    onClick={onLogin}
  >
    Se connecter
  </button>
);

export const RetryButton = ({ onRetry }: { onRetry: () => void }) => (
  <button 
    className="bg-white text-black px-2 py-1 rounded text-xs"
    onClick={onRetry}
  >
    Réessayer
  </button>
);

export const ViewLibraryButton = ({ onViewLibrary }: { onViewLibrary: () => void }) => (
  <button 
    className="bg-white text-black px-2 py-1 rounded text-xs"
    onClick={onViewLibrary}
  >
    Voir ma bibliothèque
  </button>
);
