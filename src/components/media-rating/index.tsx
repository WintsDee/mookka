
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
        // Vérifier si une notation existe déjà seulement si aucune valeur initiale n'est fournie
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
        title: "Non connecté",
        description: "Vous devez être connecté pour noter un média",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Ajouter le média à la bibliothèque avec le statut "terminé"
      await addMediaToLibrary({
        mediaId,
        mediaType,
        status: 'completed',
        notes: review,
        rating
      });
      
      toast({
        title: "Note soumise",
        description: "Votre note a été enregistrée avec succès.",
      });
      
      // Appel du callback si fourni
      if (onRatingComplete) {
        onRatingComplete(rating);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission de la note :", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre note.",
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
          <h3 className="font-medium text-lg">Donnez votre note</h3>
          <p className="text-sm text-muted-foreground">
            Quelle note donneriez-vous à ce média ?
          </p>
        </div>
        
        <RatingSlider 
          value={rating} 
          onChange={handleRatingChange} 
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium">Votre avis (optionnel)</h3>
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
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Soumettre
        </Button>
      </div>
    </div>
  );
}
