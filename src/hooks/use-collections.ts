
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCollections() {
  const [isAddingToCollection, setIsAddingToCollection] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const addMediaToCollection = async ({ collectionId, mediaId }: { collectionId: string; mediaId: string }) => {
    setIsAddingToCollection(true);
    
    try {
      const { error } = await supabase
        .from('collection_items')
        .insert({
          collection_id: collectionId,
          media_id: mediaId
        });

      if (error) throw error;
      
      setShowSuccessAnimation(true);
    } catch (error) {
      console.error('Erreur lors de l\'ajout à la collection:', error);
      throw error;
    } finally {
      setIsAddingToCollection(false);
    }
  };

  const hideSuccessAnimation = () => {
    setShowSuccessAnimation(false);
  };

  return {
    addMediaToCollection,
    isAddingToCollection,
    showSuccessAnimation,
    hideSuccessAnimation
  };
}
