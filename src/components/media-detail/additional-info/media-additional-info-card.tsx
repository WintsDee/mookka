
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookInfo } from "./book-info";
import { FilmInfo } from "./film-info";
import { SerieInfo } from "./serie-info";
import { GameInfo } from "./game-info";
import { CommonInfo } from "./common-info";
import { BadgesSection } from "./badges-section";
import { ExternalLink } from "lucide-react";

export function MediaAdditionalInfoCard({
  mediaType,
  ...props
}) {
  // Get type-specific info component
  const TypeInfo = () => {
    switch (mediaType) {
      case 'film':
        return <FilmInfo {...props} />;
      case 'serie':
        return <SerieInfo {...props} />;
      case 'book':
        return <BookInfo {...props} />;
      case 'game':
        return <GameInfo {...props} />;
      default:
        return null;
    }
  };

  // Convert website URLs to clickable links
  const renderWebsite = () => {
    if (props.website) {
      return (
        <div className="info-item">
          <span className="text-sm font-medium">Site web</span>
          <a 
            href={props.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary flex items-center gap-1"
          >
            {props.website.replace(/^https?:\/\/(www\.)?/, '')}
            <ExternalLink size={12} />
          </a>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-secondary/40 border-border">
      <CardContent className="p-4 space-y-6">
        <CommonInfo 
          releaseDate={props.releaseDate}
          duration={props.duration}
          language={props.language}
          metacritic={props.metacritic}
          renderWebsite={renderWebsite}
          website={props.website}
        />
        <TypeInfo />
        {props.awards && props.awards.length > 0 && (
          <BadgesSection title="Récompenses" items={props.awards} />
        )}
        {props.tags && props.tags.length > 0 && (
          <BadgesSection title="Tags" items={props.tags} />
        )}
      </CardContent>
    </Card>
  );
}
