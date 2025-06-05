
import React, { memo, useMemo, useState } from "react";
import { MediaRating } from "@/components/media-rating";
import { MediaType } from "@/types";
import { Loader2, Star, MessageCircle, CheckCircle, AlertCircle } from "lucide-react";
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
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  // Validation des props renforcée
  const isValidProps = useMemo(() => {
    const isValid = Boolean(
      mediaId && 
      mediaType && 
      mediaId.trim() !== '' && 
      ['film', 'serie', 'book', 'game'].includes(mediaType)
    );
    return isValid;
  }, [mediaId, mediaType]);

  // Hook avec gestion d'erreur améliorée
  const ratingHookResult = useMediaRating(
    isValidProps ? mediaId : '', 
    isValidProps ? mediaType : 'film'
  );

  // Affichage sécurisé des états d'erreur
  if (!isValidProps) {
    return (
      <div className="space-y-6 p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Impossible de charger les critiques : identifiant du média manquant ou invalide.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Vérification de la réponse du hook avec fallback
  const { userRating, userReview, isSubmitting, isLoading } = ratingHookResult || {
    userRating: null,
    userReview: null,
    isSubmitting: false,
    isLoading: true
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Chargement de vos critiques...</p>
          </div>
        </div>
      </div>
    );
  }

  // Gestion du succès de soumission
  const handleRatingComplete = (rating?: number) => {
    setSubmitStatus('success');
    setLastSubmitTime(Date.now());
    
    setTimeout(() => {
      setSubmitStatus('idle');
    }, 3000);
  };

  const handleRatingError = () => {
    setSubmitStatus('error');
    setTimeout(() => {
      setSubmitStatus('idle');
    }, 3000);
  };

  // Affichage du message de statut
  const StatusMessage = () => {
    if (submitStatus === 'success') {
      return (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Votre critique a été enregistrée avec succès !
          </AlertDescription>
        </Alert>
      );
    }
    
    if (submitStatus === 'error') {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors de l'enregistrement. Veuillez réessayer.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Votre critique</h2>
          {userRating && userRating > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {userRating}/10
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Partagez votre avis et attribuez une note à ce média
        </p>
      </div>

      {/* Message de statut */}
      <StatusMessage />

      {/* Critique existante */}
      {userRating && userRating > 0 && (userReview || submitStatus === 'success') && (
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-green-600" />
              Votre critique publiée
              {submitStatus === 'success' && (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Note :</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                {userRating}/10
              </Badge>
            </div>
            {userReview && (
              <div className="space-y-1">
                <span className="text-sm font-medium">Avis :</span>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {userReview}
                </p>
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              {lastSubmitTime > 0 && submitStatus === 'success' && (
                <span>Mise à jour il y a quelques instants</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Composant de notation */}
      <MediaRating 
        mediaId={mediaId} 
        mediaType={mediaType}
        initialNotes={initialReview || userReview || ""}
        onRatingComplete={handleRatingComplete}
        onRatingError={handleRatingError}
      />

      {/* Conseils pour l'utilisateur */}
      {!userRating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Star className="w-3 h-3 text-blue-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">
                Première critique ?
              </p>
              <p className="text-xs text-blue-700">
                Attribuez une note et rédigez votre avis pour aider la communauté à découvrir de nouveaux contenus.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mémoïsation optimisée
export const CritiqueTab = memo(CritiqueTabComponent, (prevProps, nextProps) => {
  return (
    prevProps.mediaId === nextProps.mediaId &&
    prevProps.mediaType === nextProps.mediaType &&
    prevProps.initialRating === nextProps.initialRating &&
    prevProps.initialReview === nextProps.initialReview
  );
});

CritiqueTab.displayName = 'CritiqueTab';
