
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MediaType } from "@/types";
import { useAuth } from "@/providers/auth-provider";

export function useMediaLibraryManagement(
  mediaId: string,
  mediaType: MediaType,
  mediaTitle: string
) {
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const checkIfInLibrary = async () => {
    if (!user || !mediaId) {
      setIsLoading(false);
      return false;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_media')
        .select('*')
        .eq('user_id', user.id)
        .eq('media_id', mediaId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error checking library:", error);
        return false;
      }

      const inLibrary = !!data;
      setIsInLibrary(inLibrary);
      return inLibrary;
    } catch (error) {
      console.error("Error checking library:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addToLibrary = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter à votre bibliothèque",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAdding(true);
      
      // Check if media exists in the media table first
      const { data: mediaExists, error: mediaCheckError } = await supabase
        .from('media')
        .select('id')
        .eq('id', mediaId)
        .maybeSingle();
        
      if (mediaCheckError) {
        throw mediaCheckError;
      }
      
      // If media doesn't exist, create it first
      if (!mediaExists) {
        const { error: mediaInsertError } = await supabase
          .from('media')
          .insert({
            id: mediaId,
            title: mediaTitle,
            type: mediaType,
            external_id: mediaId
          });
          
        if (mediaInsertError) {
          throw mediaInsertError;
        }
      }
      
      // Add to user's library
      const { error } = await supabase
        .from('user_media')
        .insert({
          user_id: user.id,
          media_id: mediaId,
          added_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (error) {
        if (error.code === '23505') {
          // Already in library
          setIsInLibrary(true);
          return;
        }
        throw error;
      }
      
      setIsInLibrary(true);
      toast({
        title: "Ajouté à la bibliothèque",
        description: `${mediaTitle} a été ajouté à votre bibliothèque.`,
      });
    } catch (error: any) {
      console.error("Error adding to library:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter à votre bibliothèque",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const removeFromLibrary = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour modifier votre bibliothèque",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsRemoving(true);
      const { error } = await supabase
        .from('user_media')
        .delete()
        .eq('user_id', user.id)
        .eq('media_id', mediaId);
        
      if (error) {
        throw error;
      }
      
      setIsInLibrary(false);
      toast({
        title: "Retiré de la bibliothèque",
        description: `${mediaTitle} a été retiré de votre bibliothèque.`,
      });
    } catch (error: any) {
      console.error("Error removing from library:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de retirer de votre bibliothèque",
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
    }
  };

  // Initialize on mount
  useState(() => {
    checkIfInLibrary();
  });

  return {
    isInLibrary,
    isLoading,
    isAdding,
    isRemoving,
    addToLibrary,
    removeFromLibrary,
    checkIfInLibrary
  };
}
