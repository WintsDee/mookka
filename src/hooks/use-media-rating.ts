
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/auth-provider";
import { MediaType } from "@/types";
import { updateMediaRating, getMediaRating } from "@/services/media";

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
  const { user } = useAuth();

  useEffect(() => {
    const fetchRating = async () => {
      // Only fetch if we have a mediaId and user is authenticated
      if (!mediaId || !user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const ratingData = await getMediaRating(mediaId);
        
        if (ratingData) {
          setUserRating(ratingData.rating);
          setUserReview(ratingData.review);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la note:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRating();
  }, [mediaId, user]);

  const saveRating = async (values: MediaRatingData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour noter un média",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateMediaRating(mediaId, values.rating, values.review);
      
      setUserRating(values.rating);
      setUserReview(values.review);
      
      toast({
        title: "Critique enregistrée",
        description: "Votre critique a été enregistrée",
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
