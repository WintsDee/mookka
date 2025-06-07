
import React, { useState, useEffect } from "react";
import { RatingSlider } from "./rating-slider";
import { ReviewTextarea } from "./review-textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Star, CheckCircle } from "lucide-react";
import { MediaType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { NotLoggedInCard } from "./not-logged-in-card";
import { useAuthState } from "@/hooks/use-auth-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaRating } from "@/hooks/use-media-rating";
import { useToast } from "@/hooks/use-toast";

export interface MediaRatingProps {
  mediaId: string;
  mediaType: MediaType;
  initialNotes?: string;
  onRatingComplete?: (rating?: number) => void;
  onRatingError?: () => void;
}

export function MediaRating({ 
  mediaId, 
  mediaType, 
  initialNotes = "", 
  onRatingComplete,
  onRatingError
}: MediaRatingProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState(initialNotes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const { isAuthenticated, session } = useAuthState();
  const { toast } = useToast();
  
  const { 
    submitRating, 
    isSubmitting: isRatingSubmitting, 
    userRating, 
    userReview 
  } = useMediaRating(mediaId, mediaType);
  
  // Initialiser avec les données existantes
  useEffect(() => {
    if (userRating !== null && userRating !== undefined) {
      setRating(userRating);
    }
    if (userReview) {
      setNotes(userReview);
    }
  }, [userRating, userReview]);
  
  const handleRatingChange = (value: number) => {
    setRating(value);
    setHasChanged(true);
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setHasChanged(true);
  };
  
  const handleSubmit = async () => {
    if (!rating || rating === 0) {
      toast({
        title: "Note requise",
        description: "Veuillez attribuer une note avant de publier votre critique",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log('Soumission de la critique:', { rating, notes, mediaId, mediaType });
      
      const success = await submitRating({
        rating,
        review: notes,
        notes: notes
      });
      
      if (success) {
        console.log('Critique soumise avec succès');
        setHasChanged(false);
        
        toast({
          title: "Critique publiée",
          description: "Votre critique a été enregistrée avec succès",
        });
        
        if (onRatingComplete) {
          onRatingComplete(rating);
        }
      } else {
        console.error('Échec de la soumission de la critique');
        if (onRatingError) {
          onRatingError();
        }
      }
    } catch (error) {
      console.error("Erreur lors de la soumission de la critique:", error);
      
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre critique. Veuillez réessayer.",
        variant: "destructive",
      });
      
      if (onRatingError) {
        onRatingError();
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isAuthenticated) {
    return <NotLoggedInCard />;
  }
  
  if (isRatingSubmitting && !userRating) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }
  
  const userAvatarUrl = session?.user?.user_metadata?.avatar_url || null;
  const userName = session?.user?.user_metadata?.full_name || session?.user?.email || "Utilisateur";
  const isUpdating = userRating && userRating > 0;
  
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
              <span>
                {isUpdating ? "Modifiez votre avis" : "Votre avis compte"}
              </span>
              {isUpdating && (
                <CheckCircle className="h-3 w-3 ml-1 text-green-600" />
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Note</p>
              {rating && rating > 0 && (
                <span className="text-sm text-muted-foreground">
                  {rating}/10
                </span>
              )}
            </div>
            <RatingSlider value={rating || 0} onChange={handleRatingChange} />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Critique {notes.length > 0 && <span className="text-muted-foreground">({notes.length} caractères)</span>}
            </p>
            <ReviewTextarea 
              value={notes} 
              onChange={handleNotesChange}
              placeholder={isUpdating ? "Modifiez votre critique..." : "Partagez votre avis sur ce média..."}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            {hasChanged && (
              <Button 
                variant="outline"
                onClick={() => {
                  if (userRating) setRating(userRating);
                  if (userReview) setNotes(userReview);
                  setHasChanged(false);
                }}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
            )}
            
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !rating || rating === 0}
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
                  {isUpdating ? "Mettre à jour ma critique" : "Publier ma critique"}
                </>
              )}
            </Button>
          </div>
          
          {!hasChanged && isUpdating && (
            <p className="text-xs text-muted-foreground text-center">
              Votre critique est déjà publiée. Modifiez-la pour voir les changements.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
