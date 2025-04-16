
import React from "react";
import { MediaType } from "@/types";
import { FilmProgression } from "@/components/media-detail/progression/film-progression";
import { SerieProgression } from "@/components/media-detail/progression/serie-progression";
import { BookProgression } from "@/components/media-detail/progression/book-progression";
import { GameProgression } from "@/components/media-detail/progression/game-progression";
import { ProgressionLoading } from "./progression-loading";
import { useProgression } from "./use-progression";
import { ProgressionTabProps } from "./progression-types";

export function ProgressionTab({ mediaId, mediaType, mediaDetails }: ProgressionTabProps) {
  const {
    isLoading,
    progression,
    handleProgressionUpdate
  } = useProgression(mediaId, mediaType, mediaDetails);

  if (isLoading) {
    return <ProgressionLoading />;
  }

  const renderProgressionComponent = () => {
    switch (mediaType) {
      case 'film':
        return (
          <FilmProgression 
            mediaDetails={mediaDetails}
            progression={progression}
            onUpdate={handleProgressionUpdate}
          />
        );
      case 'serie':
        return (
          <SerieProgression 
            mediaDetails={mediaDetails}
            progression={progression}
            onUpdate={handleProgressionUpdate}
          />
        );
      case 'book':
        return (
          <BookProgression 
            mediaDetails={mediaDetails}
            progression={progression}
            onUpdate={handleProgressionUpdate}
          />
        );
      case 'game':
        return (
          <GameProgression 
            mediaDetails={mediaDetails}
            progression={progression}
            onUpdate={handleProgressionUpdate}
          />
        );
      default:
        return <p>Type de média non pris en charge</p>;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">Suivi de progression</h2>
      {renderProgressionComponent()}
    </div>
  );
}
