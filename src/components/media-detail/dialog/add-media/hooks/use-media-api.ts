
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

  const addToLibrary = async (status: MediaStatus, notes?: string) => {
    try {
      setIsAddingToLibrary(true);
      
      const userId = (await supabase.auth.getSession()).data.session?.user.id;
      
      if (!userId) {
        throw new Error("Session utilisateur introuvable. Veuillez vous reconnecter.");
      }
      
      // 1. Vérifier si le média existe déjà dans la base de données
      const { data: existingMedia, error: mediaCheckError } = await supabase
        .from("media")
        .select("id")
        .eq("external_id", mediaId)
        .eq("type", mediaType)
        .maybeSingle();
      
      if (mediaCheckError) {
        console.error("Erreur lors de la vérification du média:", mediaCheckError);
        throw new Error("Erreur lors de la vérification du média dans la base de données");
      }
      
      // 2. Variable pour stocker l'ID interne du média
      let internalMediaId: string;
      
      // 3. Si le média n'existe pas encore, l'ajouter
      if (!existingMedia) {
        // Générer un nouveau UUID pour le média
        const newMediaId = uuidv4();
        
        // Insérer le nouveau média
        const { error: insertError } = await supabase
          .from("media")
          .insert({
            id: newMediaId,
            external_id: mediaId,
            title: mediaTitle,
            type: mediaType
          });
        
        if (insertError) {
          console.error("Erreur lors de l'ajout du média:", insertError);
          throw new Error("Erreur lors de l'ajout du média à la base de données");
        }
        
        internalMediaId = newMediaId;
      } else {
        // Utiliser l'ID du média existant
        internalMediaId = existingMedia.id;
      }
      
      // 4. Vérifier si l'utilisateur a déjà ce média dans sa bibliothèque
      const { data: existingUserMedia, error: userMediaCheckError } = await supabase
        .from("user_media")
        .select("id")
        .eq("user_id", userId)
        .eq("media_id", internalMediaId)
        .maybeSingle();
      
      if (userMediaCheckError) {
        console.error("Erreur lors de la vérification de la bibliothèque:", userMediaCheckError);
        throw new Error("Erreur lors de la vérification de la bibliothèque");
      }
      
      // 5. Ajouter ou mettre à jour dans la bibliothèque
      if (existingUserMedia) {
        // Si le média est déjà dans la bibliothèque, mettre à jour
        const { error: updateError } = await supabase
          .from("user_media")
          .update({
            status,
            notes,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingUserMedia.id);
        
        if (updateError) {
          console.error("Erreur lors de la mise à jour du média:", updateError);
          throw new Error("Erreur lors de la mise à jour de votre bibliothèque");
        }
      } else {
        // Si le média n'est pas dans la bibliothèque, l'ajouter
        const { error: addError } = await supabase
          .from("user_media")
          .insert({
            user_id: userId,
            media_id: internalMediaId,
            status,
            notes
          });
        
        if (addError) {
          console.error("Erreur lors de l'ajout à la bibliothèque:", addError);
          throw new Error("Erreur lors de l'ajout à votre bibliothèque");
        }
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
      
      // 1. Rechercher le média interne
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
      
      // 2. Rechercher l'entrée dans user_media
      const { data: userMedia, error: userMediaError } = await supabase
        .from("user_media")
        .select("id")
        .eq("user_id", userId)
        .eq("media_id", mediaData.id)
        .maybeSingle();
      
      if (userMediaError) {
        throw new Error("Erreur lors de la recherche dans votre bibliothèque");
      }
      
      if (!userMedia) {
        throw new Error("Ajoutez d'abord ce média à votre bibliothèque");
      }
      
      // 3. Mettre à jour la note
      const { error: updateError } = await supabase
        .from("user_media")
        .update({
          user_rating: rating,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq("id", userMedia.id);
      
      if (updateError) {
        throw new Error("Erreur lors de la mise à jour de la note");
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
