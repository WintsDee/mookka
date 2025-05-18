
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

  const addToLibrary = async (status: MediaStatus, notes: string) => {
    setIsAddingToLibrary(true);
    
    try {
      console.log(`Adding ${mediaTitle} (${mediaId}) to library with status ${status}`);
      
      await addMediaToLibrary({
        mediaId,
        mediaType,
        status,
        notes
      });
      
      toast({
        title: "Média ajouté",
        description: `"${mediaTitle}" a été ajouté à votre bibliothèque.`
      });
      
      setIsAddingToLibrary(false);
      return true;
    } catch (error) {
      setIsAddingToLibrary(false);
      throw error;
    }
  };

  const addRating = async (notes: string, rating?: number) => {
    setIsAddingToLibrary(true);
    
    try {
      await addMediaToLibrary({
        mediaId,
        mediaType,
        status: 'completed',
        notes,
        rating
      });
      
      toast({
        title: "Média noté",
        description: `"${mediaTitle}" a été noté avec succès.`
      });
      
      setIsAddingToLibrary(false);
      return true;
    } catch (error) {
      setIsAddingToLibrary(false);
      throw error;
    }
  };

  return {
    isAddingToLibrary,
    addToLibrary,
    addRating
  };
}
