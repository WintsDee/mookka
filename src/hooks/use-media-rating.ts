
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/use-profile";
import { MediaType } from "@/types";

export interface MediaRatingData {
  rating: number;
  review: string;
}

export function useMediaRating(mediaId: string, mediaType?: MediaType) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const { toast } = useToast();
  const { isAuthenticated } = useProfile();

  const fetchRating = useCallback(async () => {
    // Only fetch if we have a mediaId and user is authenticated
    if (!mediaId || !isAuthenticated) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('user_media')
        .select('user_rating, notes')
        .eq('media_id', mediaId)
        .eq('user_id', user.user.id)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Erreur lors de la récupération de la note:", error);
        return;
      }
      
      if (data) {
        const rating = data.user_rating || 0;
        setUserRating(rating);
        setUserReview(data.notes || '');
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la note:", error);
    } finally {
      setIsLoading(false);
    }
  }, [mediaId, isAuthenticated]);
  
  useEffect(() => {
    fetchRating();
  }, [fetchRating]);

  const saveRating = async (values: MediaRatingData) => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour noter un média",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error("Utilisateur non connecté");
      }
      
      // Check if the media already exists in the user's library
      const { data: existingMedia } = await supabase
        .from('user_media')
        .select('id')
        .eq('media_id', mediaId)
        .eq('user_id', user.user.id)
        .maybeSingle();
      
      if (existingMedia) {
        // Update existing rating
        const { error } = await supabase
          .from('user_media')
          .update({
            user_rating: values.rating,
            notes: values.review,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingMedia.id);
          
        if (error) throw error;
      } else {
        // Create a new entry
        const { error } = await supabase
          .from('user_media')
          .insert({
            user_id: user.user.id,
            media_id: mediaId,
            user_rating: values.rating,
            notes: values.review,
            status: 'completed'
          });
          
        if (error) throw error;
      }
      
      setUserRating(values.rating);
      setUserReview(values.review);
      
      toast({
        title: "Critique enregistrée",
        description: `Votre critique a été enregistrée`,
      });
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de la note:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre critique",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isLoading,
    isSubmitting,
    userRating,
    userReview,
    saveRating,
  };
}
