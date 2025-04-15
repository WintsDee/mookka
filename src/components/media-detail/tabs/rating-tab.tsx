
import React from "react";
import { MediaRating } from "@/components/media-rating";
import { MediaType } from "@/types";

interface RatingTabProps {
  mediaId: string;
  mediaType: MediaType;
  initialRating?: number;
}

export function RatingTab({ mediaId, mediaType, initialRating = 0 }: RatingTabProps) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Noter ce média</h2>
      <MediaRating 
        mediaId={mediaId} 
        mediaType={mediaType}
        initialRating={initialRating}
      />
    </div>
  );
}
