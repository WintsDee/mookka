
import { useState, useEffect } from "react";
import { MediaStatus, MediaType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { addMediaToLibrary } from "@/services/media";
import { useProfile } from "@/hooks/use-profile";
import { LoginButton, RetryButton, ViewLibraryButton } from "./toast-actions";

interface UseAddMediaStateProps {
  mediaId: string;
  mediaType: MediaType;
  mediaTitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function useAddMediaState({
  mediaId,
  mediaType,
  mediaTitle,
  isOpen,
  onOpenChange
}: UseAddMediaStateProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, checkAuthStatus } = useProfile();
  
  const [selectedStatus, setSelectedStatus] = useState<MediaStatus | null>(null);
  const [notes, setNotes] = useState("");
  const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);
  const [showRatingStep, setShowRatingStep] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  // Réinitialiser l'état lorsque le dialogue s'ouvre
  useEffect(() => {
    if (isOpen) {
      // Sélectionner le statut par défaut en fonction du type de média
      let defaultStatus: MediaStatus;
      switch (mediaType) {
        case 'book':
          defaultStatus = 'to-read';
          break;
        case 'game':
          defaultStatus = 'to-play';
          break;
        case 'film':
        case 'serie':
        default:
          defaultStatus = 'to-watch';
      }
      setSelectedStatus(defaultStatus);
      setNotes("");
      setShowRatingStep(false);
      setIsComplete(false);
      setShowSuccessAnimation(false);
      setIsAddingToLibrary(false);
      setErrorMessage(null);
      setRetrying(false);
    }
  }, [isOpen, mediaType]);

  // Vérifier l'authentification lors de l'ouverture du dialogue
  useEffect(() => {
    if (isOpen && !isAuthenticated) {
      const isUserAuthenticated = checkAuthStatus();
      if (!isUserAuthenticated) {
        setErrorMessage("Vous devez être connecté pour ajouter un média à votre bibliothèque");
      }
    }
  }, [isOpen, isAuthenticated, checkAuthStatus]);

  const handleStatusSelect = (status: MediaStatus) => {
    setSelectedStatus(status);
    setErrorMessage(null); // Clear any previous errors when user makes a new selection
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
  };

  const handleAddToLibrary = async () => {
    // Vérifier l'authentification avant de continuer
    if (!checkAuthStatus()) {
      setErrorMessage("Vous devez être connecté pour ajouter un média à votre bibliothèque");
      return;
    }
    
    if (!selectedStatus) {
      setErrorMessage("Veuillez sélectionner un statut");
      return;
    }
    
    setIsAddingToLibrary(true);
    setErrorMessage(null);
    
    try {
      console.log(`Adding ${mediaTitle} (${mediaId}) to library with status ${selectedStatus}`);
      
      // Si le statut est "completed", montrer l'étape de notation
      if (selectedStatus === 'completed') {
        // Avant de passer à l'étape de notation, on ajoute déjà le média à la bibliothèque
        // avec le statut "completed", mais sans note pour l'instant
        await addMediaToLibrary({
          mediaId,
          mediaType,
          status: selectedStatus,
          notes
        });
        
        setIsAddingToLibrary(false);
        setShowRatingStep(true);
        return;
      }
      
      // Pour les autres statuts, ajouter directement à la bibliothèque
      await addMediaToLibrary({
        mediaId,
        mediaType,
        status: selectedStatus,
        notes
      });
      
      // Afficher l'animation de succès
      setShowSuccessAnimation(true);
      
      toast({
        title: "Média ajouté",
        description: `"${mediaTitle}" a été ajouté à votre bibliothèque.`
      });
      
      // Après un court délai, marquer comme complet pour afficher le bouton
      setTimeout(() => {
        setIsComplete(true);
        // Après un autre délai, fermer automatiquement le dialogue
        setTimeout(() => {
          onOpenChange(false);
        }, 1500);
      }, 1000);
      
    } catch (error: any) {
      console.error("Erreur d'ajout à la bibliothèque:", error);
      
      // Extract meaningful error message
      let errorMsg = "Impossible d'ajouter ce média à votre bibliothèque";
      
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      // Classification des erreurs par catégorie pour une meilleure expérience utilisateur
      
      // 1. Erreurs d'authentification
      if (
        errorMsg.includes("non connecté") || 
        errorMsg.includes("non authentifié") ||
        errorMsg.includes("Session utilisateur introuvable") ||
        errorMsg.includes("Session expirée") ||
        errorMsg.includes("Veuillez vous reconnecter")
      ) {
        errorMsg = "Vous devez être connecté pour ajouter un média à votre bibliothèque.";
        
        // Option pour se connecter
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
        errorMsg = "Les informations du média n'ont pas pu être récupérées. Veuillez réessayer.";
        
        // Option pour retenter
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
        errorMsg = "Problème de connexion. Vérifiez votre réseau et réessayez.";
        
        // Option pour retenter
        if (!retrying) {
          toast({
            title: "Problème de connexion",
            description: "Problème de réseau détecté. Voulez-vous réessayer ?",
            action: <RetryButton onRetry={() => {
              setRetrying(true);
              setErrorMessage(null);
              handleAddToLibrary();
            }} />
          });
        }
      } 
      
      // 4. Erreurs de duplication
      else if (
        errorMsg.includes("déjà dans votre bibliothèque") ||
        errorMsg.includes("23505")
      ) {
        errorMsg = `"${mediaTitle}" est déjà dans votre bibliothèque.`;
        
        // Option pour voir la bibliothèque
        toast({
          title: "Déjà dans la bibliothèque",
          description: `"${mediaTitle}" fait déjà partie de votre collection.`,
          action: <ViewLibraryButton onViewLibrary={() => {
            onOpenChange(false);
            navigate('/bibliotheque');
          }} />
        });
      }
      
      // 5. Autres erreurs
      else {
        toast({
          title: "Erreur",
          description: errorMsg,
          variant: "destructive",
        });
      }
      
      // Set the error message for display in the UI
      setErrorMessage(errorMsg);
      setIsAddingToLibrary(false);
      setRetrying(false);
    }
  };

  const handleRatingComplete = async (rating?: number) => {
    try {
      setIsAddingToLibrary(true);
      
      // Mettre à jour le média avec la note uniquement
      // puisqu'il a déjà été ajouté avec le statut "completed"
      await addMediaToLibrary({
        mediaId,
        mediaType,
        status: 'completed',
        notes,
        rating
      });
      
      setShowRatingStep(false);
      setShowSuccessAnimation(true);
      
      toast({
        title: "Média noté",
        description: `"${mediaTitle}" a été noté avec succès.`
      });
      
      // Après un court délai, marquer comme complet pour afficher le bouton
      setTimeout(() => {
        setIsComplete(true);
        // Après un autre délai, fermer automatiquement le dialogue
        setTimeout(() => {
          onOpenChange(false);
        }, 1500);
      }, 1000);
    } catch (error: any) {
      console.error("Erreur d'ajout avec notation:", error);
      
      // Extract meaningful error message
      let errorMsg = "Impossible d'ajouter la note à ce média";
      
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      // Simplifier le message d'erreur pour l'utilisateur
      if (errorMsg.includes("Session") || errorMsg.includes("authentifi")) {
        errorMsg = "Votre session a expiré. Veuillez vous reconnecter pour noter ce média.";
      }
      
      setErrorMessage(errorMsg);
      
      toast({
        title: "Erreur",
        description: errorMsg,
        variant: "destructive",
      });
      
      setIsAddingToLibrary(false);
    }
  };

  const handleViewLibrary = () => {
    onOpenChange(false);
    navigate('/bibliotheque');
  };

  return {
    selectedStatus,
    notes,
    isAddingToLibrary,
    showRatingStep,
    isComplete,
    showSuccessAnimation,
    errorMessage,
    handleStatusSelect,
    handleNotesChange,
    handleAddToLibrary,
    handleRatingComplete,
    handleViewLibrary
  };
}
