
import React from "react";
import { MediaAdditionalInfoCard } from "./media-detail/additional-info/media-additional-info-card";

interface MediaAdditionalInfoProps {
  mediaType: string;
  releaseDate?: string;
  duration?: string;
  director?: string;
  cast?: string[];
  studio?: string;
  publisher?: string;
  developer?: string;
  author?: string;
  pages?: number;
  seasons?: number;
  episodes?: number;
  platform?: string;
  awards?: string[];
  originalTitle?: string;
  language?: string;
  budget?: string;
  revenue?: string;
  productionCountries?: string;
  creators?: string;
  status?: string;
  networks?: string;
  nextEpisode?: string;
  isbn?: string;
  isbn10?: string;
  printType?: string;
  maturityRating?: string;
  publishDate?: string;
  esrbRating?: string;
  metacritic?: number;
  genres?: string;
  website?: string;
  tags?: string[];
}

export function MediaAdditionalInfo(props: MediaAdditionalInfoProps) {
  return <MediaAdditionalInfoCard {...props} />;
}
