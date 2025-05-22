
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
      
      // Vérifier l'authentification
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error("Session utilisateur introuvable. Veuillez vous reconnecter.");
      }
      
      const userId = sessionData.session.user.id;
      
      console.log(`Ajout du média ${mediaId} (${mediaType}) à la bibliothèque avec le statut: ${status}`);
      
      // 1. Vérifier si le média existe déjà dans la table media
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
      
      // Variable pour stocker l'ID du média dans notre base
      let internalMediaId: string;
      
      // 2. Si le média n'existe pas encore, l'ajouter
      if (!existingMedia) {
        console.log("Le média n'existe pas encore, création d'une nouvelle entrée");
        
        const newMediaId = uuidv4();
        console.log("Generated UUID for new media:", newMediaId);
        
        const { error: insertError } = await supabase
          .from("media")
          .insert({
            id: newMediaId,
            external_id: mediaId,
            title: mediaTitle,
            type: mediaType
          });
        
        if (insertError) {
          console.error("Erreur lors de l'insertion du média:", insertError);
          throw new Error(`Erreur lors de l'ajout du média à la base de données: ${insertError.message}`);
        }
        
        internalMediaId = newMediaId;
        console.log(`Média créé avec l'ID interne: ${internalMediaId}`);
      } else {
        internalMediaId = existingMedia.id;
        console.log(`Média trouvé avec l'ID interne: ${internalMediaId}`);
      }
      
      // 3. Vérifier si l'utilisateur a déjà ce média dans sa bibliothèque
      const { data: existingUserMedia, error: userMediaCheckError } = await supabase
        .from("user_media")
        .select("id, status")
        .eq("user_id", userId)
        .eq("media_id", internalMediaId)
        .maybeSingle();
      
      if (userMediaCheckError) {
        console.error("Erreur lors de la vérification de la bibliothèque:", userMediaCheckError);
        throw new Error("Erreur lors de la vérification de la bibliothèque");
      }
      
      // 4. Ajouter ou mettre à jour dans la bibliothèque de l'utilisateur
      if (existingUserMedia) {
        console.log(`Le média est déjà dans la bibliothèque avec le statut: ${existingUserMedia.status}, mise à jour vers: ${status}`);
        
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
          throw new Error(`Erreur lors de la mise à jour de la bibliothèque: ${updateError.message}`);
        }
        
        console.log("Média mis à jour avec succès");
      } else {
        console.log(`Ajout du média à la bibliothèque avec le statut: ${status}`);
        
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
          
          // Gestion spécifique des erreurs de contrainte
          if (addError.code === '23505') {
            throw new Error(`Ce média est déjà dans votre bibliothèque`);
          } else {
            throw new Error(`Erreur lors de l'ajout à votre bibliothèque: ${addError.message}`);
          }
        }
        
        console.log("Média ajouté avec succès à la bibliothèque");
      }
      
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
      
      // Vérifier l'authentification
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error("Session utilisateur introuvable. Veuillez vous reconnecter.");
      }
      
      const userId = sessionData.session.user.id;
      
      // 1. Trouver l'ID interne du média
      const { data: mediaData, error: mediaError } = await supabase
        .from("media")
        .select("id")
        .eq("external_id", mediaId)
        .eq("type", mediaType)
        .maybeSingle();
      
      if (mediaError) {
        console.error("Erreur lors de la recherche du média:", mediaError);
        throw new Error("Erreur lors de la recherche du média");
      }
      
      if (!mediaData) {
        console.error("Média non trouvé dans la base de données");
        throw new Error("Le média n'existe pas dans la base de données");
      }
      
      const internalMediaId = mediaData.id;
      console.log(`ID interne du média trouvé: ${internalMediaId}`);
      
      // 2. Trouver l'entrée dans user_media
      const { data: userMedia, error: userMediaError } = await supabase
        .from("user_media")
        .select("id")
        .eq("user_id", userId)
        .eq("media_id", internalMediaId)
        .maybeSingle();
      
      if (userMediaError) {
        console.error("Erreur lors de la recherche dans la bibliothèque:", userMediaError);
        throw new Error("Erreur lors de la recherche dans votre bibliothèque");
      }
      
      if (!userMedia) {
        console.error("Média non trouvé dans la bibliothèque de l'utilisateur");
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
        console.error("Erreur lors de la mise à jour de la note:", updateError);
        throw new Error(`Erreur lors de la mise à jour de la note: ${updateError.message}`);
      }
      
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
