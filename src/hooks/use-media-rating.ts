
import { useState, useEffect, useCallback } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUserRating = useCallback(async () => {
    if (!mediaId || !mediaType) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setUserRating(null);
        setUserReview(null);
        setUserMediaStatus(null);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_media')
        .select('user_rating, notes, status')
        .eq('user_id', session.user.id)
        .eq('media_id', mediaId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user rating:", error);
        setError("Impossible de charger votre note");
        return;
      }

      if (data) {
        setUserRating(data.user_rating || null);
        setUserReview(data.notes || null);
        setUserMediaStatus(data.status as MediaStatus || null);
      } else {
        // Reset state if no data found
        setUserRating(null);
        setUserReview(null);
        setUserMediaStatus(null);
      }
    } catch (error) {
      console.error("Error in fetchUserRating:", error);
      setError("Erreur lors du chargement de votre note");
    } finally {
      setIsLoading(false);
    }
  }, [mediaId, mediaType]);

  useEffect(() => {
    fetchUserRating();
  }, [fetchUserRating]);

  const submitRating = async ({ rating, review = "", notes = "", status }: RatingSubmission) => {
    if (!mediaId || !rating) {
      console.error("MediaId or rating missing");
      toast({
        title: "Erreur",
        description: "Données manquantes pour enregistrer la note",
        variant: "destructive",
      });
      return false;
    }

    setIsSubmitting(true);
    setError(null);
    
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
        throw new Error("Erreur lors de la vérification des données existantes");
      }

      const updateData: any = {
        user_rating: rating,
        notes: notes || review || null,
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
        const insertData = {
          user_id: session.user.id,
          media_id: mediaId,
          ...updateData,
          status: status || 'completed',
          added_at: new Date().toISOString()
        };

        const { error: insertError } = await supabase
          .from('user_media')
          .insert(insertData);

        if (insertError) throw insertError;
        
        // Update local state with new status
        setUserMediaStatus(status || 'completed');
      }

      // Update local state
      setUserRating(rating);
      setUserReview(notes || review || null);

      return true;
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      const errorMessage = error.message || "Impossible d'enregistrer votre note";
      setError(errorMessage);
      
      toast({
        title: "Erreur",
        description: errorMessage,
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
    isLoading,
    error,
    refetch: fetchUserRating
  };
}
