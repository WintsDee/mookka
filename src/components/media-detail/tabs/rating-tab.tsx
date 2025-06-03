import React, { memo, useMemo } from "react";
import { MediaRating } from "@/components/media-rating";
import { MediaType } from "@/types";
import { Loader2, Star, MessageCircle } from "lucide-react";
import { useMediaRating } from "@/hooks/use-media-rating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CritiqueTabProps {
  mediaId: string;
  mediaType: MediaType;
  initialRating?: number;
  initialReview?: string;
}

const CritiqueTabComponent = ({ 
  mediaId, 
  mediaType, 
  initialRating = 0, 
  initialReview = "" 
}: CritiqueTabProps) => {
  // Validation des props requises
  const isValidProps = useMemo(() => {
    return Boolean(mediaId && mediaType && mediaId.trim() !== '');
  }, [mediaId, mediaType]);

  // Hook conditionnel avec fallback
  const ratingHookResult = useMediaRating(
    isValidProps ? mediaId : '', 
    isValidProps ? mediaType : 'film'
  );

  // Loading state sécurisé
  if (!isValidProps) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertDescription>
            Impossible de charger les critiques : données du média manquantes.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { userRating, userReview, isSubmitting } = ratingHookResult || {};

  // Loading state avec meilleure UX
  if (!mediaId || !mediaType) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Chargement de vos critiques...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Votre critique</h2>
          {userRating && (
            <Badge variant="secondary" className="ml-auto">
              {userRating}/10
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Partagez votre avis et attribuez une note à ce média
        </p>
      </div>

      {/* Existing Review Summary (si existe) */}
      {userRating && userReview && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Votre critique actuelle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Note :</span>
              <Badge variant="outline">{userRating}/10</Badge>
            </div>
            {userReview && (
              <div className="space-y-1">
                <span className="text-sm font-medium">Avis :</span>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {userReview}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Rating Component */}
      <MediaRating 
        mediaId={mediaId} 
        mediaType={mediaType}
        initialNotes={initialReview || userReview || ""}
      />
    </div>
  );
};

// Mémoïsation pour éviter les re-rendus inutiles
export const CritiqueTab = memo(CritiqueTabComponent, (prevProps, nextProps) => {
  return (
    prevProps.mediaId === nextProps.mediaId &&
    prevProps.mediaType === nextProps.mediaType &&
    prevProps.initialRating === nextProps.initialRating &&
    prevProps.initialReview === nextProps.initialReview
  );
});

CritiqueTab.displayName = 'CritiqueTab';
