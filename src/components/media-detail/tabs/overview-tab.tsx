
import React from "react";
import { MediaAdditionalInfo } from "@/components/media-additional-info";
import { MediaType } from "@/types";

interface OverviewTabProps {
  description?: string;
  additionalInfo: any;
  mediaId: string;
  mediaType: MediaType;
}

export function OverviewTab({ description, additionalInfo, mediaId, mediaType }: OverviewTabProps) {
  const formattedDescription = description ? description.replace(/<br>/g, '\n') : '';

  return (
    <div className="space-y-6 pb-8">
      {formattedDescription && (
        <div>
          <h2 className="text-lg font-medium mb-2">Synopsis</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{formattedDescription}</p>
        </div>
      )}
      
      <div>
        <h2 className="text-lg font-medium mb-2">Informations</h2>
        <MediaAdditionalInfo {...additionalInfo} />
      </div>
    </div>
  );
}
