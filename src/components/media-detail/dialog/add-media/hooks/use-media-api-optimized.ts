
import { useState } from "react";
import { MediaStatus, MediaType } from "@/types";
import { addMediaToLibrary } from "@/services/media";
import { useToast } from "@/hooks/use-toast";

interface UseMediaApiProps {
  mediaId: string;
  mediaType: MediaType;
  mediaTitle: string;
}

export function useMediaApiOptimized({ mediaId, mediaType, mediaTitle }: UseMediaApiProps) {
  const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);
  const { toast } = useToast();

  const addToLibrary = async (status: MediaStatus, notes?: string) => {
    if (isAddingToLibrary) return false; // Éviter les doublons
    
    try {
      setIsAddingToLibrary(true);
      console.log(`Ajout optimisé: ${mediaId} (${mediaType}) -> ${status}`);
      
      await addMediaToLibrary({ 
        mediaId, 
        mediaType, 
        status, 
        notes 
      });
      
      toast({
        title: "Succès",
        description: `"${mediaTitle}" ajouté à votre bibliothèque`,
        variant: "default"
      });
      
      return true;
    } catch (error) {
      console.error("Erreur addToLibrary optimisé:", error);
      
      const errorMessage = error instanceof Error ? 
        error.message : 
        "Erreur lors de l'ajout du média";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsAddingToLibrary(false);
    }
  };

  const addRating = async (notes?: string, rating?: number) => {
    if (isAddingToLibrary) return false;
    
    try {
      setIsAddingToLibrary(true);
      console.log(`Ajout note optimisé: ${mediaId} -> ${rating}/10`);
      
      await addMediaToLibrary({
        mediaId,
        mediaType,
        notes,
        rating
      });
      
      toast({
        title: "Évaluation enregistrée",
        description: rating ? 
          `Note ${rating}/10 pour "${mediaTitle}"` : 
          `Avis enregistré pour "${mediaTitle}"`,
      });
      
      return true;
    } catch (error) {
      console.error("Erreur addRating optimisé:", error);
      
      const errorMessage = error instanceof Error ? 
        error.message : 
        "Erreur lors de l'ajout de la note";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      
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
