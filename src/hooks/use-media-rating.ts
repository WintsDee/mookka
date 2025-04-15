
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/use-profile";

export interface MediaRatingData {
  rating: number;
  review: string;
}

export function useMediaRating(mediaId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const { toast } = useToast();
  const { isAuthenticated } = useProfile();

  useEffect(() => {
    const fetchRating = async () => {
      if (!isAuthenticated || !mediaId) return;
      
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
    };
    
    fetchRating();
  }, [mediaId, isAuthenticated]);

  const saveRating = async (values: MediaRatingData) => {
    if (!isAuthenticated) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour noter ce média",
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
      
      // Vérifier si le média existe déjà dans la bibliothèque de l'utilisateur
      const { data: existingMedia } = await supabase
        .from('user_media')
        .select('id')
        .eq('media_id', mediaId)
        .eq('user_id', user.user.id)
        .maybeSingle();
      
      if (existingMedia) {
        // Mettre à jour la note existante
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
        // Créer une nouvelle entrée
        const { error } = await supabase
          .from('user_media')
          .insert({
            user_id: user.user.id,
            media_id: mediaId,
            user_rating: values.rating,
            notes: values.review,
            status: 'rated'
          });
          
        if (error) throw error;
      }
      
      setUserRating(values.rating);
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
