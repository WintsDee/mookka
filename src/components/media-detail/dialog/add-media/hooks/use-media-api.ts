
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
      console.log(`Début de l'ajout du média ${mediaId} (${mediaType}) à la bibliothèque avec le statut: ${status}`);
      
      // 1. Vérifier l'authentification
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Erreur d'authentification:", sessionError);
        throw new Error("Session utilisateur introuvable. Veuillez vous reconnecter.");
      }
      
      if (!sessionData.session) {
        console.error("Pas de session utilisateur trouvée");
        throw new Error("Veuillez vous connecter pour ajouter ce média à votre bibliothèque.");
      }
      
      const userId = sessionData.session.user.id;
      console.log(`Utilisateur authentifié: ${userId}`);
      
      // 2. Vérifier si le média existe déjà dans la table media
      console.log(`Recherche du média avec external_id=${mediaId} et type=${mediaType} dans la base de données`);
      const { data: existingMedia, error: mediaCheckError } = await supabase
        .from("media")
        .select("id")
        .eq("external_id", mediaId)
        .eq("type", mediaType)
        .maybeSingle();
      
      if (mediaCheckError) {
        console.error("Erreur lors de la vérification du média:", mediaCheckError);
        throw new Error(`Erreur lors de la vérification du média dans la base de données: ${mediaCheckError.message}`);
      }
      
      // Variable pour stocker l'ID du média dans notre base
      let internalMediaId: string;
      
      // 3. Si le média n'existe pas encore, l'ajouter
      if (!existingMedia) {
        console.log("Le média n'existe pas encore dans la base de données, création d'une nouvelle entrée");
        
        const newMediaId = uuidv4();
        console.log(`UUID généré pour le nouveau média: ${newMediaId}`);
        
        const insertData = {
          id: newMediaId,
          external_id: mediaId,
          title: mediaTitle,
          type: mediaType
        };
        
        console.log("Données à insérer:", insertData);
        
        const { error: insertError } = await supabase
          .from("media")
          .insert(insertData);
        
        if (insertError) {
          console.error("Erreur lors de l'insertion du média:", insertError);
          throw new Error(`Erreur lors de l'ajout du média à la base de données: ${insertError.message}`);
        }
        
        internalMediaId = newMediaId;
        console.log(`Média créé avec succès, ID interne: ${internalMediaId}`);
      } else {
        internalMediaId = existingMedia.id;
        console.log(`Média trouvé dans la base de données, ID interne: ${internalMediaId}`);
      }
      
      // 4. Vérifier si l'utilisateur a déjà ce média dans sa bibliothèque
      console.log(`Vérification si l'utilisateur a déjà ce média dans sa bibliothèque`);
      const { data: existingUserMedia, error: userMediaCheckError } = await supabase
        .from("user_media")
        .select("id, status")
        .eq("user_id", userId)
        .eq("media_id", internalMediaId)
        .maybeSingle();
      
      if (userMediaCheckError) {
        console.error("Erreur lors de la vérification de la bibliothèque:", userMediaCheckError);
        throw new Error(`Erreur lors de la vérification de la bibliothèque: ${userMediaCheckError.message}`);
      }
      
      // 5. Ajouter ou mettre à jour dans la bibliothèque de l'utilisateur
      if (existingUserMedia) {
        console.log(`Le média est déjà dans la bibliothèque avec le statut: ${existingUserMedia.status}, mise à jour vers: ${status}`);
        
        const updateData = {
          status,
          notes,
          updated_at: new Date().toISOString()
        };
        
        console.log("Données de mise à jour:", updateData);
        
        const { error: updateError } = await supabase
          .from("user_media")
          .update(updateData)
          .eq("id", existingUserMedia.id);
        
        if (updateError) {
          console.error("Erreur lors de la mise à jour du média:", updateError);
          throw new Error(`Erreur lors de la mise à jour de la bibliothèque: ${updateError.message}`);
        }
        
        console.log("Média mis à jour avec succès");
      } else {
        console.log(`Ajout du média à la bibliothèque avec le statut: ${status}`);
        
        const insertData = {
          user_id: userId,
          media_id: internalMediaId,
          status,
          notes,
          added_at: new Date().toISOString()
        };
        
        console.log("Données à insérer:", insertData);
        
        const { error: addError } = await supabase
          .from("user_media")
          .insert(insertData);
        
        if (addError) {
          console.error("Erreur lors de l'ajout à la bibliothèque:", addError);
          
          if (addError.code === '23505') {
            throw new Error("Ce média est déjà dans votre bibliothèque");
          } else {
            throw new Error(`Erreur lors de l'ajout à votre bibliothèque: ${addError.message}`);
          }
        }
        
        console.log("Média ajouté avec succès à la bibliothèque");
      }
      
      console.log("Opération terminée avec succès");
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
      console.log(`Début de l'ajout de la note ${rating} pour le média ${mediaId}`);
      
      // Vérifier l'authentification
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error("Erreur d'authentification:", sessionError);
        throw new Error("Session utilisateur introuvable. Veuillez vous reconnecter.");
      }
      
      const userId = sessionData.session.user.id;
      console.log(`Utilisateur authentifié: ${userId}`);
      
      // 1. Trouver l'ID interne du média
      console.log(`Recherche de l'ID interne du média avec external_id=${mediaId}`);
      const { data: mediaData, error: mediaError } = await supabase
        .from("media")
        .select("id")
        .eq("external_id", mediaId)
        .eq("type", mediaType)
        .maybeSingle();
      
      if (mediaError) {
        console.error("Erreur lors de la recherche du média:", mediaError);
        throw new Error(`Erreur lors de la recherche du média: ${mediaError.message}`);
      }
      
      if (!mediaData) {
        console.error("Média non trouvé dans la base de données");
        throw new Error("Le média n'existe pas dans la base de données. Veuillez d'abord l'ajouter à votre bibliothèque.");
      }
      
      const internalMediaId = mediaData.id;
      console.log(`ID interne du média trouvé: ${internalMediaId}`);
      
      // 2. Trouver l'entrée dans user_media
      console.log(`Recherche de l'entrée dans user_media pour l'utilisateur ${userId} et le média ${internalMediaId}`);
      const { data: userMedia, error: userMediaError } = await supabase
        .from("user_media")
        .select("id")
        .eq("user_id", userId)
        .eq("media_id", internalMediaId)
        .maybeSingle();
      
      if (userMediaError) {
        console.error("Erreur lors de la recherche dans la bibliothèque:", userMediaError);
        throw new Error(`Erreur lors de la recherche dans votre bibliothèque: ${userMediaError.message}`);
      }
      
      if (!userMedia) {
        console.error("Média non trouvé dans la bibliothèque de l'utilisateur");
        throw new Error("Ajoutez d'abord ce média à votre bibliothèque avant de le noter");
      }
      
      console.log(`Entrée trouvée dans user_media avec l'ID: ${userMedia.id}`);
      
      // 3. Mettre à jour la note
      const updateData = {
        user_rating: rating,
        notes,
        updated_at: new Date().toISOString()
      };
      
      console.log("Mise à jour avec les données:", updateData);
      
      const { error: updateError } = await supabase
        .from("user_media")
        .update(updateData)
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
