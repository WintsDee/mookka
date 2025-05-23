
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
  const [lastErrorTimestamp, setLastErrorTimestamp] = useState<number>(0);

  const clearError = useCallback(() => {
    setErrorMessage(null);
    setIsRetrying(false);
    setLastErrorId(null);
  }, []);

  const handleError = useCallback((error: any, retryCallback?: () => void) => {
    console.error("Error occurred:", error);
    
    // Extraire un message d'erreur significatif
    let errorMsg = "Une erreur est survenue";
    let errorId = error && typeof error === 'object' ? JSON.stringify(error) : String(Date.now());
    
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
    
    // Éviter d'afficher plusieurs toasts pour les mêmes erreurs dans un court laps de temps
    const now = Date.now();
    const isDuplicate = errorMessage === errorMsg && lastErrorId === errorId;
    const isTooFrequent = (now - lastErrorTimestamp) < 3000; // 3 secondes
    
    if (isDuplicate || isTooFrequent) {
      console.log("Erreur déjà affichée ou trop fréquente, ignorée:", errorMsg);
      return;
    }
    
    setErrorMessage(errorMsg);
    setLastErrorId(errorId);
    setLastErrorTimestamp(now);
    
    // Classification des erreurs par catégorie
    
    // 1. Erreurs d'authentification
    if (
      errorMsg.includes("non connecté") || 
      errorMsg.includes("non authentifié") ||
      errorMsg.includes("Session utilisateur introuvable") ||
      errorMsg.includes("Session expirée") ||
      errorMsg.includes("Veuillez vous connecter") ||
      errorMsg.includes("Veuillez vous reconnecter") ||
      errorMsg.includes("autorisation") ||
      errorMsg.includes("autorisation")
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
      errorMsg.includes("Impossible de récupérer les informations") ||
      errorMsg.includes("source externe") ||
      errorMsg.includes("service externe") ||
      errorMsg.includes("indisponible") ||
      errorMsg.includes("API") ||
      errorMsg.includes("introuvable dans la source")
    ) {
      toast({
        title: "Service indisponible",
        description: errorMsg,
        variant: "destructive",
        action: retryCallback ? <RetryButton onRetry={() => {
          setIsRetrying(true);
          retryCallback();
        }} /> : undefined
      });
    } 
    
    // 3. Erreurs de réseau
    else if (
      errorMsg.toLowerCase().includes("connexion") || 
      errorMsg.toLowerCase().includes("réseau") ||
      errorMsg.toLowerCase().includes("timeout") || 
      errorMsg.toLowerCase().includes("trop de temps") ||
      errorMsg.toLowerCase().includes("network") ||
      errorMsg.toLowerCase().includes("internet")
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
      } else {
        toast({
          title: "Problème de connexion",
          description: "Vérifiez votre connexion internet et réessayez.",
          variant: "destructive"
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
    
    // 5. Erreurs de référence et clés étrangères
    else if (
      errorMsg.includes("Référence incorrecte") ||
      errorMsg.includes("23503") ||
      errorMsg.includes("n'existe pas dans la base") ||
      errorMsg.includes("a référence") ||
      errorMsg.includes("n'existe pas dans notre base de données")
    ) {
      toast({
        title: "Erreur de référence",
        description: "Une référence est manquante dans la base de données. Réessayez dans quelques instants.",
        variant: "destructive"
      });
      
      // Tenter de récupérer automatiquement après un court délai si un callback est fourni
      if (retryCallback && !isRetrying) {
        setTimeout(() => {
          setIsRetrying(true);
          retryCallback();
        }, 2000);
      }
    }
    
    // 6. Erreurs de format UUID
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
    
    // 7. Erreurs spécifiques à l'API pour les fetch de média
    else if (
      errorMsg.includes("récupérer") && (errorMsg.includes("média") || errorMsg.includes("informations"))
    ) {
      toast({
        title: "Échec de récupération",
        description: "Impossible de récupérer les informations du média. Veuillez réessayer plus tard.",
        variant: "destructive",
        action: retryCallback ? <RetryButton onRetry={() => {
          setIsRetrying(true);
          retryCallback();
        }} /> : undefined
      });
    }
    
    // 8. Autres erreurs - afficher une seule fois
    else {
      toast({
        title: "Erreur",
        description: errorMsg,
        variant: "destructive",
      });
    }
  }, [errorMessage, isRetrying, lastErrorId, lastErrorTimestamp, mediaTitle, navigate, onOpenChange, toast]);

  return {
    errorMessage,
    isRetrying,
    handleError,
    clearError
  };
}
