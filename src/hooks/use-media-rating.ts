
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
  const [userMediaStatus, setUserMediaStatus] = useState<MediaStatus | null>(null);
  const { toast } = useToast();

  const fetchUserRating = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('user_media')
        .select('user_rating, notes, status')
        .eq('user_id', session.user.id)
        .eq('media_id', mediaId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user rating:", error);
        return;
      }

      if (data) {
        setUserRating(data.user_rating);
        setUserReview(data.notes || null);
        setUserMediaStatus(data.status as MediaStatus || null);
      } else {
        // Reset values if no data found
        setUserRating(null);
        setUserReview(null);
        setUserMediaStatus(null);
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour noter ce média",
          variant: "destructive",
        });
        return false;
      }

      // Check if the user already has this media in their library
      const { data: existingUserMedia, error: checkError } = await supabase
        .from('user_media')
        .select('id, status')
        .eq('user_id', session.user.id)
        .eq('media_id', mediaId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking existing media:", checkError);
        throw checkError;
      }

      const updateData = {
        user_rating: rating > 0 ? rating : null,
        notes: notes || null,
        updated_at: new Date().toISOString()
      };

      if (status) {
        updateData.status = status;
      }

      if (existingUserMedia) {
        // Update the existing entry
        const { error: updateError } = await supabase
          .from('user_media')
          .update(updateData)
          .eq('id', existingUserMedia.id);

        if (updateError) throw updateError;
        
        // Update local state with new status if provided
        if (status) {
          setUserMediaStatus(status);
        }
      } else {
        // Insert a new entry
        const { error: insertError } = await supabase
          .from('user_media')
          .insert({
            user_id: session.user.id,
            media_id: mediaId,
            ...updateData,
            status: status || 'completed',
            added_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
        
        // Update local state with new status
        if (status) {
          setUserMediaStatus(status);
        }
      }

      // Update state
      setUserRating(rating > 0 ? rating : null);
      setUserReview(notes || null);

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
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitRating,
    isSubmitting,
    userRating,
    userReview,
    userMediaStatus,
  };
}
