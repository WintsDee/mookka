
import { useState } from "react";
import { MediaStatus, MediaType } from "@/types";
import { addMediaToLibrary } from "@/services/media";

interface UseMediaApiProps {
  mediaId: string;
  mediaType: MediaType;
  mediaTitle: string;
}

export function useMediaApi({ mediaId, mediaType, mediaTitle }: UseMediaApiProps) {
  const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);

  // Utilise le service addMediaToLibrary pour toutes les opérations
  const addToLibrary = async (status: MediaStatus, notes?: string) => {
    try {
      setIsAddingToLibrary(true);
      console.log(`Début de l'ajout du média ${mediaId} (${mediaType}) avec statut: ${status} à la bibliothèque`);
      
      await addMediaToLibrary({ 
        mediaId, 
        mediaType, 
        status, 
        notes 
      });
      
      console.log("Média ajouté avec succès à la bibliothèque");
      return true;
    } catch (error) {
      console.error("Erreur dans addToLibrary:", error);
      throw error;
    } finally {
      setIsAddingToLibrary(false);
    }
  };

  const addRating = async (notes?: string, rating?: number) => {
    try {
      setIsAddingToLibrary(true);
      console.log(`Début de l'ajout de la note ${rating} pour le média ${mediaId}`);
      
      await addMediaToLibrary({
        mediaId,
        mediaType,
        notes,
        rating
      });
      
      console.log("Note ajoutée avec succès");
      return true;
    } catch (error) {
      console.error("Erreur dans addRating:", error);
      throw error;
    } finally {
      setIsAddingToLibrary(false);
    }
  };

  return {
    isAddingToLibrary,
    addToLibrary,
    addRating
  };
}
