
import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MediaType } from "@/types";
import { useMediaRating } from "@/hooks/use-media-rating";
import { useAuthState } from "@/hooks/use-auth-state";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface QuickRatingProps {
  mediaId: string;
  mediaType: MediaType;
  onRatingUpdate?: (rating: number) => void;
}

export function QuickRating({ mediaId, mediaType, onRatingUpdate }: QuickRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuthState();
  const { toast } = useToast();
  
  const { submitRating, userRating } = useMediaRating(mediaId, mediaType);

  const handleRatingClick = async (rating: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour noter ce média",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await submitRating({ rating });
      if (success) {
        toast({
          title: "Note enregistrée",
          description: `Vous avez attribué ${rating}/10 à ce média`,
        });
        onRatingUpdate?.(rating);
      }
    } catch (error) {
      console.error("Erreur lors de la notation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModifyClick = () => {
    // Déclencher un événement pour naviguer vers l'onglet critique
    const customEvent = new CustomEvent('switchToTab', { 
      detail: { targetTab: 'critique' },
      bubbles: true 
    });
    document.dispatchEvent(customEvent);
  };

  if (!isAuthenticated) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-4">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <Star className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Notez ce média</p>
              <p className="text-xs text-muted-foreground mt-1">
                Connectez-vous pour attribuer une note
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/auth'}>
              Se connecter
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">
                {userRating ? `Votre note: ${userRating}/10` : "Notez ce média"}
              </p>
            </div>
            {userRating && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleModifyClick}
                className="text-xs h-6 px-2"
              >
                Modifier
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-1 justify-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
              <button
                key={rating}
                className={cn(
                  "p-1 transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
                onMouseEnter={() => setHoveredRating(rating)}
                onMouseLeave={() => setHoveredRating(null)}
                onClick={() => handleRatingClick(rating)}
                disabled={isSubmitting}
              >
                <Star
                  className={cn(
                    "w-6 h-6 transition-all duration-300",
                    rating <= (hoveredRating || userRating || 0)
                      ? "fill-yellow-400 text-yellow-400 drop-shadow-md"
                      : "text-gray-300 hover:text-yellow-200"
                  )}
                />
              </button>
            ))}
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
          
          {!userRating && (
            <p className="text-xs text-center text-muted-foreground">
              Cliquez sur une étoile pour noter
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
