
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MediaType } from "@/types";
import { CommonInfo } from "./common-info";
import { FilmInfo } from "./film-info";
import { SerieInfo } from "./serie-info";
import { BookInfo } from "./book-info";
import { GameInfo } from "./game-info";

interface MediaAdditionalInfoCardProps {
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

export function MediaAdditionalInfoCard(props: MediaAdditionalInfoCardProps) {
  const { mediaType } = props;
  
  return (
    <Card className="bg-secondary/40 border-border">
      <CardContent className="p-4 space-y-3">
        <CommonInfo 
          releaseDate={props.releaseDate} 
          duration={props.duration} 
        />
        
        {mediaType === 'film' && (
          <FilmInfo 
            director={props.director}
            studio={props.studio}
            originalTitle={props.originalTitle}
            language={props.language}
            budget={props.budget}
            revenue={props.revenue}
            productionCountries={props.productionCountries}
            cast={props.cast}
            awards={props.awards}
          />
        )}
        
        {mediaType === 'serie' && (
          <SerieInfo 
            creators={props.creators}
            seasons={props.seasons}
            episodes={props.episodes}
            status={props.status}
            networks={props.networks}
            originalTitle={props.originalTitle}
            language={props.language}
            nextEpisode={props.nextEpisode}
            cast={props.cast}
            awards={props.awards}
          />
        )}
        
        {mediaType === 'book' && (
          <BookInfo 
            author={props.author}
            publisher={props.publisher}
            pages={props.pages}
            isbn={props.isbn}
            isbn10={props.isbn10}
            language={props.language}
            printType={props.printType}
            maturityRating={props.maturityRating}
            publishDate={props.publishDate}
            awards={props.awards}
          />
        )}
        
        {mediaType === 'game' && (
          <GameInfo 
            developer={props.developer}
            publisher={props.publisher}
            platform={props.platform}
            esrbRating={props.esrbRating}
            metacritic={props.metacritic}
            genres={props.genres}
            website={props.website}
            tags={props.tags}
            awards={props.awards}
          />
        )}
      </CardContent>
    </Card>
  );
}
