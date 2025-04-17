
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { addMediaToLibrary, removeMediaFromLibrary, isMediaInLibrary } from "@/services/media";
import { useAuth } from "@/providers/auth-provider";
import { MediaType } from "@/types";

/**
 * Custom hook for managing media library operations
 */
export function useMediaLibrary(mediaId: string, mediaType: MediaType, mediaTitle: string) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isInLibrary, setIsInLibrary] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  // Check if media is in the user's library
  useEffect(() => {
    const checkLibraryStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const inLibrary = await isMediaInLibrary(mediaId);
        setIsInLibrary(inLibrary);
      } catch (error) {
        console.error("Erreur lors de la vérification de la bibliothèque:", error);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier la bibliothèque",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkLibraryStatus();
  }, [mediaId, user, toast]);

  // Add media to library
  const addToLibrary = useCallback(async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter des médias à votre bibliothèque",
        variant: "destructive"
      });
      return;
    }
    
    setIsAdding(true);
    
    try {
      await addMediaToLibrary({
        mediaId,
        mediaType,
        status: "to_consume" // Status par défaut
      }, mediaType);
      
      setIsInLibrary(true);
      toast({
        title: "Ajouté à la bibliothèque",
        description: `${mediaTitle} a été ajouté à votre bibliothèque`
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout à la bibliothèque:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce média à votre bibliothèque",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  }, [mediaId, mediaType, mediaTitle, toast, user]);

  // Remove media from library
  const removeFromLibrary = useCallback(async () => {
    if (!user) return;
    
    setIsRemoving(true);
    
    try {
      await removeMediaFromLibrary(mediaId);
      
      setIsInLibrary(false);
      toast({
        title: "Supprimé de la bibliothèque",
        description: `${mediaTitle} a été supprimé de votre bibliothèque`
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la bibliothèque:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer ce média de votre bibliothèque",
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
    }
  }, [mediaId, mediaTitle, toast, user]);

  return {
    isInLibrary,
    isLoading,
    isAdding,
    isRemoving,
    addToLibrary,
    removeFromLibrary
  };
}
