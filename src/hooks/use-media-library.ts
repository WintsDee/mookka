
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/use-profile"; 
import { supabase } from "@/integrations/supabase/client";
import { Media, MediaType, MediaStatus } from "@/types";
import { parseMediaStatus, getDefaultStatus } from "@/services/media";

export function useMediaLibrary() {
  const [loading, setLoading] = useState(false);
  const { profile } = useProfile();
  const { toast } = useToast();
  
  // Ajouter un média à la bibliothèque
  const addToLibrary = async (media: Media) => {
    try {
      setLoading(true);
      
      if (!profile?.id) {
        throw new Error("Vous devez être connecté pour ajouter un média à votre bibliothèque");
      }
      
      // Utiliser la fonction utilitaire pour obtenir le statut approprié
      const defaultStatus = getDefaultStatus(media.type);
      
      // Vérifier si le média existe déjà dans la bibliothèque
      const { data: existingMedia } = await supabase
        .from('user_media')
        .select('*')
        .eq('user_id', profile.id)
        .eq('media_id', media.id)
        .single();
        
      if (existingMedia) {
        toast({
          title: "Déjà dans votre bibliothèque",
          description: `${media.title} est déjà dans votre bibliothèque.`
        });
        return;
      }
      
      // Ajouter le média à la bibliothèque
      const { error } = await supabase
        .from('user_media')
        .insert({
          user_id: profile.id,
          media_id: media.id,
          status: defaultStatus,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      toast({
        title: "Ajouté à votre bibliothèque",
        description: `${media.title} a été ajouté à votre bibliothèque.`
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout à votre bibliothèque.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Mettre à jour le statut d'un média
  const updateStatus = async (mediaId: string, status: string, mediaType: MediaType) => {
    try {
      setLoading(true);
      
      if (!profile?.id) {
        throw new Error("Vous devez être connecté pour modifier votre bibliothèque");
      }
      
      // Utiliser la fonction parseMediaStatus pour s'assurer que le statut est valide
      const validStatus = parseMediaStatus(status, mediaType);
      
      const { error } = await supabase
        .from('user_media')
        .update({
          status: validStatus,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', profile.id)
        .eq('media_id', mediaId);
        
      if (error) throw error;
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut du média a été mis à jour avec succès."
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Supprimer un média de la bibliothèque
  const removeFromLibrary = async (mediaId: string, mediaTitle: string) => {
    try {
      setLoading(true);
      
      if (!profile?.id) {
        throw new Error("Vous devez être connecté pour modifier votre bibliothèque");
      }
      
      const { error } = await supabase
        .from('user_media')
        .delete()
        .eq('user_id', profile.id)
        .eq('media_id', mediaId);
        
      if (error) throw error;
      
      toast({
        title: "Retiré de votre bibliothèque",
        description: `${mediaTitle} a été retiré de votre bibliothèque.`
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    addToLibrary,
    updateStatus,
    removeFromLibrary
  };
}
