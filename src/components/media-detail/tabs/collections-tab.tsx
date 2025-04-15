
import React from "react";
import { MediaCollectionsSection } from "@/components/media-collections-section";

interface CollectionsTabProps {
  mediaId: string;
}

export function CollectionsTab({ mediaId }: CollectionsTabProps) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Gérer les collections</h2>
      <MediaCollectionsSection mediaId={mediaId} />
    </div>
  );
}
