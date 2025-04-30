
import React, { useState } from "react";
import { RatingSlider } from "./rating-slider";
import { ReviewTextarea } from "./review-textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Star } from "lucide-react";
import { MediaType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { NotLoggedInCard } from "./not-logged-in-card";
import { useAuthState } from "@/hooks/use-auth-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaRating } from "@/hooks/use-media-rating";

export interface MediaRatingProps {
  mediaId: string;
  mediaType: MediaType;
  initialNotes?: string;
  onRatingComplete?: (rating?: number) => void;
}

export function MediaRating({ 
  mediaId, 
  mediaType, 
  initialNotes = "", 
  onRatingComplete 
}: MediaRatingProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState(initialNotes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, session } = useAuthState();
  const { isRatingLoading } = useMediaRating(mediaId);
  
  const handleRatingChange = (value: number) => {
    setRating(value);
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
  
  const handleSubmit = async () => {
    if (onRatingComplete) {
      setIsSubmitting(true);
      
      try {
        await onRatingComplete(rating !== null ? rating : undefined);
      } catch (error) {
        console.error("Error during rating submission:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  if (!isAuthenticated) {
    return <NotLoggedInCard />;
  }
  
  if (isRatingLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const userAvatarUrl = session?.user?.user_metadata?.avatar_url || null;
  const userName = session?.user?.user_metadata?.full_name || session?.user?.email || "Utilisateur";
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <Avatar className="h-10 w-10 mr-3 border border-border/50">
            <AvatarImage 
              src={userAvatarUrl || undefined}
              alt={userName}
              className="object-cover"
            />
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              {userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{userName}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Votre avis est important</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">Note</p>
            <RatingSlider value={rating} onChange={handleRatingChange} />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Critique</p>
            <ReviewTextarea 
              value={notes} 
              onChange={handleNotesChange}
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Star className="h-4 w-4" />
                  Publier ma critique
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
