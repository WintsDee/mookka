
import React from "react";
import { MediaRating } from "@/components/media-rating";
import { MediaType } from "@/types";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { NotLoggedInCard } from "@/components/media-rating/not-logged-in-card";

interface CritiqueTabProps {
  mediaId: string;
  mediaType: MediaType;
  initialRating?: number;
}

export function CritiqueTab({ mediaId, mediaType, initialRating = 0 }: CritiqueTabProps) {
  const { isAuthenticated } = useProfile();

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Critiquer ce média</h2>
      
      {!isAuthenticated ? (
        <NotLoggedInCard />
      ) : (
        <MediaRating 
          mediaId={mediaId} 
          mediaType={mediaType}
          initialRating={initialRating}
        />
      )}
    </div>
  );
}
