
import { useState } from "react";
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

  const clearError = () => {
    setErrorMessage(null);
    setIsRetrying(false);
  };

  const handleError = (error: any, retryCallback?: () => void) => {
    console.error("Error occurred:", error);
    
    // Extract meaningful error message
    let errorMsg = "Une erreur est survenue";
    
    if (error instanceof Error) {
      errorMsg = error.message;
    }
    
    // Ne pas afficher plusieurs toasts pour les mêmes erreurs
    if (errorMessage === errorMsg) {
      return;
    }
    
    // Classification des erreurs par catégorie
    
    // 1. Erreurs d'authentification
    if (
      errorMsg.includes("non connecté") || 
      errorMsg.includes("non authentifié") ||
      errorMsg.includes("Session utilisateur introuvable") ||
      errorMsg.includes("Session expirée") ||
      errorMsg.includes("Veuillez vous reconnecter")
    ) {
      setErrorMessage("Vous devez être connecté pour ajouter un média à votre bibliothèque.");
      
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
      setErrorMessage("Les informations du média n'ont pas pu être récupérées. Veuillez réessayer.");
      
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
      setErrorMessage("Problème de connexion. Vérifiez votre réseau et réessayez.");
      
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
      setErrorMessage(`"${mediaTitle}" est déjà dans votre bibliothèque.`);
      
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
      setErrorMessage("Format d'identifiant de média incorrect.");
      
      toast({
        title: "Erreur technique",
        description: "Un problème technique est survenu avec l'identifiant du média.",
        variant: "destructive"
      });
    }
    
    // 6. Autres erreurs - afficher une seule fois
    else {
      setErrorMessage(errorMsg);
      
      toast({
        title: "Erreur",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  return {
    errorMessage,
    isRetrying,
    handleError,
    clearError
  };
}
