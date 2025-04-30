
import { useState, useEffect } from "react";
import { MediaStatus, MediaType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { addMediaToLibrary } from "@/services/media";

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
  
  const [selectedStatus, setSelectedStatus] = useState<MediaStatus | null>(null);
  const [notes, setNotes] = useState("");
  const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);
  const [showRatingStep, setShowRatingStep] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

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
    }
  }, [isOpen, mediaType]);

  const handleStatusSelect = (status: MediaStatus) => {
    setSelectedStatus(status);
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
  };

  const handleAddToLibrary = async () => {
    if (!selectedStatus) return;
    
    setIsAddingToLibrary(true);
    
    try {
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
      
    } catch (error) {
      console.error("Erreur d'ajout à la bibliothèque:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce média à votre bibliothèque",
        variant: "destructive",
      });
      setIsAddingToLibrary(false);
    }
  };

  const handleRatingComplete = async (rating?: number) => {
    try {
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
    } catch (error) {
      console.error("Erreur d'ajout avec notation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la note à ce média",
        variant: "destructive",
      });
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
    handleStatusSelect,
    handleNotesChange,
    handleAddToLibrary,
    handleRatingComplete,
    handleViewLibrary
  };
}
