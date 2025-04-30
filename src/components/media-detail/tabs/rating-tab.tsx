
import React, { useState } from "react";
import { MediaRating } from "@/components/media-rating";
import { MediaType } from "@/types";
import { Loader2 } from "lucide-react";
import { useMediaRating } from "@/hooks/use-media-rating";
import { addMediaToLibrary } from "@/services/media";
import { useToast } from "@/hooks/use-toast";

interface CritiqueTabProps {
  mediaId: string;
  mediaType: MediaType;
  initialRating?: number;
  initialReview?: string;
}

export function CritiqueTab({ mediaId, mediaType, initialRating = 0, initialReview = "" }: CritiqueTabProps) {
  const { toast } = useToast();
  
  if (!mediaId || !mediaType) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleRatingComplete = async (rating?: number) => {
    try {
      await addMediaToLibrary({
        mediaId,
        mediaType,
        status: 'completed',
        notes: initialReview,
        rating
      });
      
      toast({
        title: "Critique enregistrée",
        description: "Votre critique a été enregistrée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la critique:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre critique",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">Critiquer ce média</h2>
      
      <MediaRating 
        mediaId={mediaId} 
        mediaType={mediaType}
        initialNotes={initialReview}
        onRatingComplete={handleRatingComplete}
      />
    </div>
  );
}
