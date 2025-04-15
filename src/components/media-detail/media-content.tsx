
import React from "react";
import { MediaRating } from "@/components/media-rating";
import { MediaCollectionsSection } from "@/components/media-collections-section";
import { MediaAdditionalInfo } from "@/components/media-additional-info";
import { MediaType } from "@/types";

interface MediaContentProps {
  id: string;
  type: MediaType;
  formattedMedia: any;
  additionalInfo: any;
}

export function MediaContent({ id, type, formattedMedia, additionalInfo }: MediaContentProps) {
  return (
    <div className="p-6 space-y-6">
      {id && type && (
        <MediaRating 
          mediaId={id} 
          mediaType={type}
          initialRating={0}
        />
      )}
      
      {id && (
        <MediaCollectionsSection mediaId={id} />
      )}
      
      {formattedMedia.description && (
        <div>
          <h2 className="text-lg font-medium mb-2">Synopsis</h2>
          <p className="text-sm text-muted-foreground">{formattedMedia.description}</p>
        </div>
      )}
      
      <div>
        <h2 className="text-lg font-medium mb-2">Informations</h2>
        <MediaAdditionalInfo {...additionalInfo} />
      </div>
    </div>
  );
}
