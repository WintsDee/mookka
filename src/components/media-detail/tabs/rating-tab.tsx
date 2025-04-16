
import React from "react";
import { MediaRating } from "@/components/media-rating";
import { MediaType } from "@/types";
import { Loader2 } from "lucide-react";

interface CritiqueTabProps {
  mediaId: string;
  mediaType: MediaType;
  initialRating?: number;
  initialReview?: string;
}

export function CritiqueTab({ mediaId, mediaType, initialRating = 0, initialReview = "" }: CritiqueTabProps) {
  if (!mediaId || !mediaType) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">Critiquer ce média</h2>
      
      <MediaRating 
        mediaId={mediaId} 
        mediaType={mediaType}
        initialRating={initialRating}
        initialReview={initialReview}
      />
    </div>
  );
}
