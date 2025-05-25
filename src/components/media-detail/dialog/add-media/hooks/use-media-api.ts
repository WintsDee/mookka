
import { useState } from "react";
import { MediaStatus, MediaType } from "@/types";
import { addMediaToLibrary } from "@/services/media";
import { useToast } from "@/hooks/use-toast";

interface UseMediaApiProps {
  mediaId: string;
  mediaType: MediaType;
  mediaTitle: string;
}

export function useMediaApi({ mediaId, mediaType, mediaTitle }: UseMediaApiProps) {
  const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);
  const { toast } = useToast();

  const addToLibrary = async (status: MediaStatus, notes?: string) => {
    try {
      setIsAddingToLibrary(true);
      console.log(`Début de l'ajout du média ${mediaId} (${mediaType}) avec statut: ${status} à la bibliothèque`);
      
      // Délai court pour s'assurer que l'UI se met à jour
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = await addMediaToLibrary({ 
        mediaId, 
        mediaType, 
        status, 
        notes 
      });
      
      console.log("Média ajouté avec succès à la bibliothèque");
      
      toast({
        title: "Succès",
        description: `"${mediaTitle}" a été ajouté à votre bibliothèque`,
        variant: "default"
      });
      
      return true;
    } catch (error) {
      console.error("Erreur dans addToLibrary:", error);
      
      // Afficher l'erreur spécifique à l'utilisateur
      let errorMessage = "Une erreur est survenue lors de l'ajout du média";
      
      if (error instanceof Error) {
        if (error.message.includes("Statut de média invalide")) {
          errorMessage = `Statut invalide pour ce type de média. Veuillez réessayer.`;
        } else if (error.message.includes("Session expirée")) {
          errorMessage = "Votre session a expiré. Veuillez vous reconnecter.";
        } else if (error.message.includes("déjà dans votre bibliothèque")) {
          errorMessage = "Ce média est déjà dans votre bibliothèque";
        } else {
          errorMessage = error.message;
        }
      }
      
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
    try {
      setIsAddingToLibrary(true);
      console.log(`Début de l'ajout de la note ${rating} pour le média ${mediaId}`);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await addMediaToLibrary({
        mediaId,
        mediaType,
        notes,
        rating
      });
      
      console.log("Note ajoutée avec succès");
      
      toast({
        title: "Évaluation enregistrée",
        description: rating ? `Vous avez attribué ${rating}/10 à "${mediaTitle}"` : `Votre avis sur "${mediaTitle}" a été enregistré`,
      });
      
      return true;
    } catch (error) {
      console.error("Erreur dans addRating:", error);
      
      let errorMessage = "Une erreur est survenue lors de l'ajout de la note";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
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
