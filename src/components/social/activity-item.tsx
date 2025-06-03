
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
          <Avatar className="w-10 h-10 rounded-full overflow-hidden border border-border/20">
            <AvatarImage 
              src={activity.user.avatar} 
              alt={activity.user.name}
              className="object-cover"
              loading="eager"
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
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
          <div className="mt-3 flex items-center gap-3">
            <Link to={`/media/${media.type}/${activity.media.id}`}>
              <img
                src={media.coverImage}
                alt={media.title}
                className="w-16 h-24 rounded-md object-cover"
                loading="eager"
                onError={handleImageError}
              />
            </Link>
            <div>
              <Link to={`/media/${media.type}/${activity.media.id}`} className="hover:underline">
                <h3 className="font-medium text-sm">{media.title}</h3>
              </Link>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {media.description?.slice(0, 80)}...
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
