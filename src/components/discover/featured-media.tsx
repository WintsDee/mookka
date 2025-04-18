
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Plus, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FeaturedMediaProps {
  media: any;
  isMobile?: boolean;
}

export function FeaturedMedia({ media, isMobile = true }: FeaturedMediaProps) {
  const navigate = useNavigate();
  
  if (!media) return null;
  
  const handleMediaClick = () => {
    navigate(`/media/${media.type}/${media.id}`);
  };
  
  return (
    <div 
      className="relative w-full rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm"
      onClick={handleMediaClick}
    >
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0">
        <img 
          src={media.coverImage} 
          alt={media.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-6 pb-8 flex flex-col h-full justify-end">
        {/* Badge for media type */}
        <div className="mb-2">
          <span className={cn(
            "inline-block px-2 py-1 rounded-md text-xs font-medium",
            media.type === 'film' && "bg-media-film/90 text-white",
            media.type === 'serie' && "bg-media-serie/90 text-white",
            media.type === 'book' && "bg-media-book/90 text-white",
            media.type === 'game' && "bg-media-game/90 text-white"
          )}>
            {media.type === 'film' ? 'Film' : 
             media.type === 'serie' ? 'Série' :
             media.type === 'book' ? 'Livre' : 'Jeu'}
          </span>
          
          {media.rating && (
            <span className="inline-flex items-center ml-2 bg-black/40 text-yellow-400 px-2 py-1 rounded-md text-xs">
              <Star className="w-3 h-3 mr-1 fill-yellow-400" /> {media.rating.toFixed(1)}
            </span>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-1">{media.title}</h2>
        
        {media.year && (
          <p className="text-gray-300 text-sm mb-2">{media.year}</p>
        )}
        
        {media.genres && media.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {media.genres.slice(0, 3).map((genre: string) => (
              <span 
                key={genre} 
                className="text-xs bg-black/30 text-gray-300 px-2 py-1 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex space-x-2 mt-2">
          <Button 
            size={isMobile ? "sm" : "default"}
            className="bg-primary hover:bg-primary/90"
          >
            <Play className="mr-1 h-4 w-4" /> Détails
          </Button>
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            className="bg-white/10 hover:bg-white/20 border-white/20"
          >
            <Plus className="mr-1 h-4 w-4" /> Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
}
