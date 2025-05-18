
import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/use-profile";

interface UseAuthCheckProps {
  isOpen: boolean;
  onAuthError: (message: string) => void;
}

export function useAuthCheck({ isOpen, onAuthError }: UseAuthCheckProps) {
  const { isAuthenticated, checkAuthStatus } = useProfile();
  const [isChecking, setIsChecking] = useState(false);

  // Check authentication when dialog opens
  useEffect(() => {
    if (isOpen && !isAuthenticated && !isChecking) {
      setIsChecking(true);
      const isUserAuthenticated = checkAuthStatus();
      
      if (!isUserAuthenticated) {
        onAuthError("Vous devez être connecté pour ajouter un média à votre bibliothèque");
      }
      
      setIsChecking(false);
    }
  }, [isOpen, isAuthenticated, checkAuthStatus, onAuthError]);

  const verifyAuth = (): boolean => {
    const isUserAuth = checkAuthStatus();
    
    if (!isUserAuth) {
      onAuthError("Vous devez être connecté pour ajouter un média à votre bibliothèque");
      return false;
    }
    
    return true;
  };

  return {
    isAuthenticated,
    verifyAuth
  };
}
