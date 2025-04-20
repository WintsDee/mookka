
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMediaRating } from "@/hooks/use-media-rating";
import { RatingSlider } from "./rating-slider";
import { ReviewTextarea } from "./review-textarea";
import { NotLoggedInCard } from "./not-logged-in-card";
import { useProfile } from "@/hooks/use-profile";
import { Loader2 } from "lucide-react";
import { NotesTextarea } from "../media-detail/progression/notes-textarea";

interface MediaRatingProps {
  mediaId: string;
  mediaType: string;
  initialNotes?: string;
  onRatingComplete?: () => void;
}

export function MediaRating({ 
  mediaId, 
  mediaType, 
  initialNotes = "", 
  onRatingComplete 
}: MediaRatingProps) {
  const { isAuthenticated } = useProfile();
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState("");
  const [notes, setNotes] = useState(initialNotes);
  
  const { 
    submitRating, 
    isSubmitting, 
    userRating, 
    userReview 
  } = useMediaRating(mediaId, mediaType);
  
  useEffect(() => {
    if (userRating) {
      setRating(userRating);
    }
    
    if (userReview) {
      setReview(userReview);
    }
  }, [userRating, userReview]);
  
  const handleSubmitRating = async () => {
    if (rating === null) return;
    
    try {
      await submitRating({ 
        rating, 
        review,
        notes,
        status: 'completed'
      });
      
      if (onRatingComplete) {
        onRatingComplete();
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };
  
  if (!isAuthenticated) {
    return <NotLoggedInCard />;
  }
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Votre note</h3>
          <RatingSlider 
            rating={rating} 
            onChange={setRating} 
          />
        </div>
        
        <ReviewTextarea 
          review={review} 
          onChange={setReview} 
        />
        
        <NotesTextarea 
          notes={notes} 
          onNotesChange={setNotes} 
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmitRating} 
          disabled={rating === null || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Ajouter à ma bibliothèque"
          )}
        </Button>
      </div>
    </div>
  );
}
