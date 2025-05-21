
import { useState } from "react";
import { MediaStatus, MediaType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface UseMediaApiProps {
  mediaId: string;
  mediaType: MediaType;
  mediaTitle: string;
}

export function useMediaApi({ mediaId, mediaType, mediaTitle }: UseMediaApiProps) {
  const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);

  const validateMediaId = (): string => {
    // Vérifier si l'ID est déjà un UUID valide
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(mediaId)) {
      return mediaId;
    }
    
    // Si ce n'est pas un UUID valide, générer un UUID basé sur l'ID externe
    // et le type pour garantir la cohérence
    const stableId = `${mediaType}-${mediaId}`;
    return uuidv4(); // On génère un nouvel UUID pour garantir sa validité
  }

  const addToLibrary = async (status: MediaStatus, notes?: string) => {
    try {
      setIsAddingToLibrary(true);
      
      const userId = (await supabase.auth.getSession()).data.session?.user.id;
      
      if (!userId) {
        throw new Error("Session utilisateur introuvable. Veuillez vous reconnecter.");
      }
      
      // Utiliser un ID valide pour la base de données
      const validDbId = validateMediaId();
      
      const { error } = await supabase
        .from("user_media")
        .insert({
          id: validDbId, // ID interne généré avec UUID
          external_id: mediaId, // ID externe de l'API
          user_id: userId,
          media_type: mediaType,
          status,
          notes,
          title: mediaTitle,
        });
      
      if (error) {
        console.error("Erreur lors de l'ajout du média:", error);
        throw new Error(error.message);
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout du média:", error);
      throw error;
    } finally {
      setIsAddingToLibrary(false);
    }
  };

  const addRating = async (notes?: string, rating?: number) => {
    try {
      setIsAddingToLibrary(true);
      
      const userId = (await supabase.auth.getSession()).data.session?.user.id;
      
      if (!userId) {
        throw new Error("Session utilisateur introuvable. Veuillez vous reconnecter.");
      }
      
      // Récupérer d'abord l'entrée du média pour l'utilisateur
      const { data: existingMedia, error: fetchError } = await supabase
        .from("user_media")
        .select()
        .eq("user_id", userId)
        .eq("external_id", mediaId)
        .eq("media_type", mediaType)
        .single();
      
      if (fetchError && fetchError.code !== "PGRST116") {
        throw new Error(fetchError.message);
      }
      
      // Si le média n'existe pas, on le crée
      if (!existingMedia) {
        throw new Error("Le média doit d'abord être ajouté à la bibliothèque.");
      }
      
      // Mise à jour de la note
      const { error: updateError } = await supabase
        .from("user_media")
        .update({
          rating,
          notes
        })
        .eq("id", existingMedia.id);
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la note:", error);
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
