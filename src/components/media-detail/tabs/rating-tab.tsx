
import React from "react";
import { MediaRating } from "@/components/media-rating";
import { MediaType } from "@/types";
import { Loader2 } from "lucide-react";
import { useMediaRating } from "@/hooks/use-media-rating";

interface CritiqueTabProps {
  mediaId: string;
  mediaType: MediaType;
  initialRating?: number;
  initialReview?: string;
}

export function CritiqueTab({ 
  mediaId, 
  mediaType, 
  initialRating = 0, 
  initialReview = "" 
}: CritiqueTabProps) {
  
  if (!mediaId || !mediaType) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Votre critique</h2>
        <p className="text-sm text-muted-foreground">
          Partagez votre avis et attribuez une note à ce média
        </p>
      </div>
      
      <MediaRating 
        mediaId={mediaId} 
        mediaType={mediaType}
        initialNotes={initialReview}
      />
    </div>
  );
}
