
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  LoginButton, 
  RetryButton, 
  ViewLibraryButton 
} from "./toast-actions";

interface UseErrorHandlingProps {
  mediaTitle: string;
  onOpenChange: (open: boolean) => void;
}

export function useErrorHandling({ mediaTitle, onOpenChange }: UseErrorHandlingProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastErrorId, setLastErrorId] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setErrorMessage(null);
    setIsRetrying(false);
    setLastErrorId(null);
  }, []);

  const handleError = useCallback((error: any, retryCallback?: () => void) => {
    console.error("Error occurred:", error);
    
    // Extraire un message d'erreur significatif
    let errorMsg = "Une erreur est survenue";
    let errorId = error && typeof error === 'object' ? JSON.stringify(error) : String(Date.now()); // Identifiant unique pour cette erreur
    
    if (error instanceof Error) {
      errorMsg = error.message;
      errorId = error.message; // Utiliser le message comme identifiant
    } else if (typeof error === 'string') {
      errorMsg = error;
      errorId = error;
    } else if (error && error.message) {
      errorMsg = error.message;
      errorId = error.message;
    }
    
    // Éviter d'afficher plusieurs toasts pour les mêmes erreurs
    if (errorMessage === errorMsg || lastErrorId === errorId) {
      console.log("Erreur déjà affichée, ignorée:", errorMsg);
      return;
    }
    
    setErrorMessage(errorMsg);
    setLastErrorId(errorId);
    
    // Classification des erreurs par catégorie
    
    // 1. Erreurs d'authentification
    if (
      errorMsg.includes("non connecté") || 
      errorMsg.includes("non authentifié") ||
      errorMsg.includes("Session utilisateur introuvable") ||
      errorMsg.includes("Session expirée") ||
      errorMsg.includes("Veuillez vous connecter") ||
      errorMsg.includes("Veuillez vous reconnecter")
    ) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour ajouter ce média à votre bibliothèque.",
        variant: "destructive",
        action: <LoginButton onLogin={() => navigate('/auth')} />
      });
    } 
    
    // 2. Erreurs d'API externe
    else if (
      errorMsg.includes("Impossible de récupérer les données") ||
      errorMsg.includes("source externe") ||
      errorMsg.includes("service externe")
    ) {
      toast({
        title: "Erreur de service",
        description: "Les services externes sont temporairement indisponibles. Réessayez plus tard.",
        variant: "destructive"
      });
    } 
    
    // 3. Erreurs de réseau
    else if (
      errorMsg.includes("connexion") || 
      errorMsg.includes("réseau") ||
      errorMsg.includes("timeout") || 
      errorMsg.includes("trop de temps")
    ) {
      if (!isRetrying && retryCallback) {
        toast({
          title: "Problème de connexion",
          description: "Problème de réseau détecté. Voulez-vous réessayer ?",
          action: <RetryButton onRetry={() => {
            setIsRetrying(true);
            setErrorMessage(null);
            retryCallback();
          }} />
        });
      }
    } 
    
    // 4. Erreurs de duplication
    else if (
      errorMsg.includes("déjà dans votre bibliothèque") ||
      errorMsg.includes("23505")
    ) {
      toast({
        title: "Déjà dans la bibliothèque",
        description: `"${mediaTitle}" fait déjà partie de votre collection.`,
        action: <ViewLibraryButton onViewLibrary={() => {
          onOpenChange(false);
          navigate('/bibliotheque');
        }} />
      });
    }
    
    // 5. Erreurs de format UUID
    else if (
      errorMsg.includes("UUID") ||
      errorMsg.includes("format d'identifiant") ||
      errorMsg.includes("invalid input syntax for type uuid")
    ) {
      toast({
        title: "Erreur technique",
        description: "Un problème technique est survenu avec l'identifiant du média.",
        variant: "destructive"
      });
    }
    
    // 6. Autres erreurs - afficher une seule fois
    else {
      toast({
        title: "Erreur",
        description: errorMsg,
        variant: "destructive",
      });
    }
  }, [errorMessage, isRetrying, lastErrorId, mediaTitle, navigate, onOpenChange, toast]);

  return {
    errorMessage,
    isRetrying,
    handleError,
    clearError
  };
}
