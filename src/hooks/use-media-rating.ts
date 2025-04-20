
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MediaStatus } from "@/types";

// Define the MediaRatingData type
export interface MediaRatingData {
  rating: number;
  review?: string;
  notes?: string;
  status?: MediaStatus;
}

interface RatingSubmission {
  rating: number;
  review?: string;
  notes?: string;
  status?: MediaStatus;
}

export function useMediaRating(mediaId: string, mediaType: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [userReview, setUserReview] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUserRating = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_media')
        .select('user_rating, notes')
        .eq('user_id', user.id)
        .eq('media_id', mediaId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user rating:", error);
        return;
      }

      if (data) {
        setUserRating(data.user_rating);
        setUserReview(data.notes || null);
      }
    } catch (error) {
      console.error("Error in fetchUserRating:", error);
    }
  };

  useEffect(() => {
    if (mediaId) {
      fetchUserRating();
    }
  }, [mediaId]);

  const submitRating = async ({ rating, review = "", notes = "", status }: RatingSubmission) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour noter ce média",
          variant: "destructive",
        });
        return;
      }

      // Check if the user already has this media in their library
      const { data: existingUserMedia, error: checkError } = await supabase
        .from('user_media')
        .select('id')
        .eq('user_id', user.id)
        .eq('media_id', mediaId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingUserMedia) {
        // Update the existing entry
        const { error: updateError } = await supabase
          .from('user_media')
          .update({
            user_rating: rating,
            notes: notes,
            ...(status && { status }),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUserMedia.id);

        if (updateError) throw updateError;
      } else {
        // Insert a new entry
        const { error: insertError } = await supabase
          .from('user_media')
          .insert({
            user_id: user.id,
            media_id: mediaId,
            user_rating: rating,
            notes: notes,
            status: status || 'completed',
            added_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      // Update state
      setUserRating(rating);
      setUserReview(notes);

      toast({
        title: "Évaluation enregistrée",
        description: "Votre note a bien été enregistrée",
      });

      return true;
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre note",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitRating,
    isSubmitting,
    userRating,
    userReview,
  };
}
