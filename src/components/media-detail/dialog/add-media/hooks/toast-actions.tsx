
import React from "react";
import { Button } from "@/components/ui/button";

// This file exports React components that can be used in the toast actions

export const LoginButton = ({ onLogin }: { onLogin: () => void }) => (
  <Button 
    variant="outline"
    size="sm"
    onClick={onLogin}
    className="h-8 rounded-sm px-2 py-1 text-xs"
  >
    Se connecter
  </Button>
);

export const RetryButton = ({ onRetry }: { onRetry: () => void }) => (
  <Button
    variant="outline"
    size="sm"
    onClick={onRetry}
    className="h-8 rounded-sm px-2 py-1 text-xs"
  >
    Réessayer
  </Button>
);

export const ViewLibraryButton = ({ onViewLibrary }: { onViewLibrary: () => void }) => (
  <Button
    variant="outline"
    size="sm"
    onClick={onViewLibrary}
    className="h-8 rounded-sm px-2 py-1 text-xs"
  >
    Voir ma bibliothèque
  </Button>
);
