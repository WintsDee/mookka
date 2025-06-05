
import React, { memo, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "@/components/social/types";
import { Media } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActivityItemProps {
  activity: Activity;
  media: Media;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

const ActivityItemComponent = ({
  activity,
  media,
  onLike,
  onComment,
  onShare,
}: ActivityItemProps) => {
  const [imageError, setImageError] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [mediaImageLoaded, setMediaImageLoaded] = useState(false);

  // Mémoïser le fallback de l'avatar
  const avatarFallback = useMemo(() => {
    return activity.user.name 
      ? activity.user.name.substring(0, 2).toUpperCase()
      : "U";
  }, [activity.user.name]);

  // Mémoïser le timestamp formaté
  const formattedTime = useMemo(() => {
    return formatDistanceToNow(new Date(activity.timestamp), { 
      addSuffix: true,
      locale: fr
    });
  }, [activity.timestamp]);

  // Gestionnaire d'erreur d'image mémoïsé
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!imageError) {
      setImageError(true);
      (e.target as HTMLImageElement).src = "/placeholder.svg";
    }
  };
    
  return (
    <Card className="bg-secondary/40 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10 rounded-full overflow-hidden border border-border/20">
              <AvatarImage 
                src={activity.user.avatar} 
                alt={activity.user.name}
                className={`object-cover transition-opacity duration-200 ${avatarLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setAvatarLoaded(true)}
                loading="lazy"
              />
              <AvatarFallback className={`bg-primary/10 text-primary transition-opacity duration-200 ${avatarLoaded ? 'opacity-0' : 'opacity-100'}`}>
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span>{" "}
              {activity.action}{" "}
              <span className="font-medium">{activity.media.title}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {formattedTime}
            </p>
          </div>
        </div>
        
        {media && (
          <div className="mt-3 flex items-start gap-3">
            <Link to={`/media/${media.type}/${activity.media.id}`}>
              <div className="relative w-16 h-24 flex-shrink-0">
                <img
                  src={media.coverImage}
                  alt={media.title}
                  className={`w-full h-full rounded-md object-cover transition-opacity duration-200 ${mediaImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setMediaImageLoaded(true)}
                  onError={handleImageError}
                  loading="lazy"
                />
                {!mediaImageLoaded && (
                  <div className="absolute inset-0 bg-muted animate-pulse rounded-md" />
                )}
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/media/${media.type}/${activity.media.id}`} className="hover:underline">
                <h3 className="font-medium text-sm line-clamp-1">{media.title}</h3>
              </Link>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {media.description ? media.description.slice(0, 100) + (media.description.length > 100 ? "..." : "") : "Aucune description disponible"}
              </p>
            </div>
          </div>
        )}
        
        <div className="flex justify-between mt-4">
          <button 
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            onClick={onLike}
          >
            <Heart size={14} />
            <span>J'aime</span>
          </button>
          <button 
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            onClick={onComment}
          >
            <MessageCircle size={14} />
            <span>Commenter</span>
          </button>
          <button 
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            onClick={onShare}
          >
            <Share2 size={14} />
            <span>Partager</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

// Mémoïsation avec comparaison personnalisée
export const ActivityItem = memo(ActivityItemComponent, (prevProps, nextProps) => {
  return (
    prevProps.activity.id === nextProps.activity.id &&
    prevProps.activity.timestamp === nextProps.activity.timestamp &&
    prevProps.media?.id === nextProps.media?.id &&
    prevProps.onLike === nextProps.onLike &&
    prevProps.onComment === nextProps.onComment &&
    prevProps.onShare === nextProps.onShare
  );
});

ActivityItem.displayName = 'ActivityItem';
