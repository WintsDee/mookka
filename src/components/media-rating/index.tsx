
import React, { useState } from "react";
import { Button } from "../ui/button";
import { NotLoggedInCard } from "./not-logged-in-card";
import { RatingSlider } from "./rating-slider";
import { ReviewTextarea } from "./review-textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MediaType } from "@/types";

interface MediaRatingProps {
  mediaId: string;
  mediaType: MediaType;
  initialNotes?: string;
  onRatingComplete: (rating?: number) => void;
}

export function MediaRating({
  mediaId,
  mediaType,
  initialNotes = "",
  onRatingComplete
}: MediaRatingProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState(initialNotes);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  React.useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Erreur lors de la vérification de l'authentification:", error);
          setIsLoggedIn(false);
          return;
        }
        setIsLoggedIn(!!data.user);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleRatingChange = (value: number | null) => {
    setRating(value);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Appel de la fonction de callback avec la note
      onRatingComplete(rating !== null ? rating : undefined);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la note:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre note",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn === null) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isLoggedIn === false) {
    return <NotLoggedInCard />;
  }

  return (
    <div className="space-y-6 py-2">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Notez ce média</h3>
        <p className="text-sm text-muted-foreground">
          Votre note aide la communauté à découvrir de nouveaux contenus de qualité.
        </p>
      </div>
      
      <RatingSlider value={rating} onChange={handleRatingChange} />
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Avis (optionnel)</h3>
        <ReviewTextarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Partagez votre avis sur ce média..."
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => onRatingComplete(undefined)}
          disabled={isLoading}
        >
          Ignorer
        </Button>
        
        <Button onClick={handleSubmit} disabled={isLoading || rating === null}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer"
          )}
        </Button>
      </div>
    </div>
  );
}
