
import React, { useState, useEffect } from "react";
import { MediaRating } from "@/components/media-rating";
import { MediaType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";

interface RatingTabProps {
  mediaId: string;
  mediaType: MediaType;
  initialRating?: number;
}

export function RatingTab({ mediaId, mediaType, initialRating = 0 }: RatingTabProps) {
  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useProfile();

  useEffect(() => {
    const fetchUserRating = async () => {
      if (!isAuthenticated || !mediaId) {
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
          setRating(data.user_rating || 0);
          setReview(data.notes || "");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la note:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserRating();
  }, [mediaId, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Noter ce média</h2>
      <MediaRating 
        mediaId={mediaId} 
        mediaType={mediaType}
        initialRating={rating}
        initialReview={review}
      />
    </div>
  );
}
