
import React from "react";
import { Link } from "react-router-dom";
import { Media } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface MediaCardProps {
  media: Media;
  size?: "small" | "medium" | "large";
}

const MediaCard = ({ media, size = "medium" }: MediaCardProps) => {
  const { id, title, type, coverImage, year, rating, genres } = media;
  
  // Déterminer les classes en fonction de la taille
  const sizeClasses = {
    small: "w-32 h-48",
    medium: "w-40 h-60",
    large: "w-48 h-72"
  };
  
  return (
    <Link to={`/media/${type}/${id}`} className="block animate-fade-in">
      <div className={cn("media-card", sizeClasses[size])}>
        <div className="relative w-full h-full">
          <img 
            src={coverImage} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 p-3 w-full">
              <h3 className="text-white font-bold text-sm line-clamp-2">{title}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-white/80">{year}</span>
                {rating && (
                  <div className="flex items-center">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                    <span className="text-xs text-white/80">{rating}</span>
                  </div>
                )}
              </div>
              {genres && genres.length > 0 && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {genres.slice(0, 2).map((genre) => (
                    <Badge key={genre} variant="outline" className="text-[0.6rem] py-0">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={cn(
          "absolute top-0 right-0 w-2 h-8", 
          `bg-media-${type}`,
        )} />
      </div>
    </Link>
  );
};

export { MediaCard };
