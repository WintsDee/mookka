
import React from "react";
import { MediaAdditionalInfo } from "@/components/media-additional-info";

interface OverviewTabProps {
  description?: string;
  additionalInfo: any;
}

export function OverviewTab({ description, additionalInfo }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {description && (
        <div>
          <h2 className="text-lg font-medium mb-2">Synopsis</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}
      
      <div>
        <h2 className="text-lg font-medium mb-2">Informations</h2>
        <MediaAdditionalInfo {...additionalInfo} />
      </div>
    </div>
  );
}
