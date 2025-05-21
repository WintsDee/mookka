
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
    return uuidv4(); // On génère un nouvel UUID pour garantir sa validité
  };

  const addToLibrary = async (status: MediaStatus, notes?: string) => {
    try {
      setIsAddingToLibrary(true);
      
      const userId = (await supabase.auth.getSession()).data.session?.user.id;
      
      if (!userId) {
        throw new Error("Session utilisateur introuvable. Veuillez vous reconnecter.");
      }
      
      // Vérifier d'abord si le média existe déjà dans la table media
      const { data: existingMedia, error: mediaCheckError } = await supabase
        .from("media")
        .select("id")
        .eq("external_id", mediaId)
        .eq("type", mediaType)
        .maybeSingle();
      
      let mediaDbId: string;
      
      if (mediaCheckError) {
        console.error("Erreur lors de la vérification du média:", mediaCheckError);
        throw new Error("Erreur lors de la vérification du média dans la base de données");
      }
      
      if (!existingMedia) {
        // Le média n'existe pas encore, l'ajouter à la table media
        const validDbId = validateMediaId();
        
        const { error: mediaInsertError } = await supabase
          .from("media")
          .insert({
            id: validDbId,
            external_id: mediaId,
            title: mediaTitle,
            type: mediaType,
          });
        
        if (mediaInsertError) {
          console.error("Erreur lors de l'ajout du média à la base:", mediaInsertError);
          throw new Error("Erreur lors de l'ajout du média à la base de données");
        }
        
        mediaDbId = validDbId;
      } else {
        // Le média existe déjà, utiliser son ID
        mediaDbId = existingMedia.id;
      }
      
      // Maintenant ajouter à la bibliothèque de l'utilisateur
      const { error } = await supabase
        .from("user_media")
        .insert({
          user_id: userId,
          media_id: mediaDbId,
          status,
          notes,
        });
      
      if (error) {
        console.error("Erreur lors de l'ajout du média à la bibliothèque:", error);
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
      
      // Rechercher d'abord le média dans la table media
      const { data: mediaData, error: mediaError } = await supabase
        .from("media")
        .select("id")
        .eq("external_id", mediaId)
        .eq("type", mediaType)
        .maybeSingle();
      
      if (mediaError) {
        throw new Error("Erreur lors de la recherche du média");
      }
      
      if (!mediaData) {
        throw new Error("Le média n'existe pas dans la base de données");
      }
      
      // Récupérer l'entrée du média pour l'utilisateur
      const { data: existingMedia, error: fetchError } = await supabase
        .from("user_media")
        .select()
        .eq("user_id", userId)
        .eq("media_id", mediaData.id)
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
