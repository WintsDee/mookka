
import { useState, useEffect } from "react";
import { RatingSlider } from "./rating-slider";
import { ReviewTextarea } from "./review-textarea";
import { NotLoggedInCard } from "./not-logged-in-card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { MediaType } from "@/types";
import { addMediaToLibrary } from "@/services/media";

interface MediaRatingProps {
  mediaId: string;
  mediaType: MediaType;
  initialNotes?: string;
  initialRating?: number;
  initialReview?: string;
  onRatingComplete?: (rating?: number) => void;
}

export function MediaRating({ 
  mediaId, 
  mediaType, 
  initialNotes = "",
  initialRating = 0,
  initialReview = "",
  onRatingComplete
}: MediaRatingProps) {
  const [rating, setRating] = useState<number>(initialRating);
  const [review, setReview] = useState<string>(initialReview || initialNotes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      
      if (user && !initialRating && !initialReview) {
        // Check if a rating already exists only if no initial value is provided
        try {
          const { data } = await supabase
            .from('user_media')
            .select('user_rating, notes')
            .eq('user_id', user.id)
            .eq('media_id', mediaId)
            .maybeSingle();
            
          if (data) {
            if (data.user_rating) {
              setRating(data.user_rating);
            }
            if (data.notes && !initialNotes && !initialReview) {
              setReview(data.notes);
            }
          }
        } catch (error) {
          console.error("Error fetching rating data:", error);
        }
      }
    };
    
    checkAuthStatus();
  }, [mediaId, initialNotes, initialRating, initialReview]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleReviewChange = (newReview: string) => {
    setReview(newReview);
  };
  
  const handleSubmit = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to rate media",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add media to library with "completed" status
      await addMediaToLibrary({
        mediaId,
        mediaType,
        status: 'completed',
        notes: review,
        rating
      });
      
      toast({
        title: "Rating submitted",
        description: "Your rating has been successfully recorded.",
      });
      
      // Call callback if provided
      if (onRatingComplete) {
        onRatingComplete(rating);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Error",
        description: "Unable to save your rating.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return <NotLoggedInCard />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Rate this media</h3>
          <p className="text-sm text-muted-foreground">
            What rating would you give this media?
          </p>
        </div>
        
        <RatingSlider 
          value={rating} 
          onChange={handleRatingChange} 
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium">Your review (optional)</h3>
        <ReviewTextarea 
          value={review} 
          onChange={handleReviewChange} 
        />
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Submit
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
