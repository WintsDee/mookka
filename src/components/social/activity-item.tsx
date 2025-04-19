
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "@/components/social/types";
import { Media } from "@/types";

interface ActivityItemProps {
  activity: Activity;
  media: Media;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

export const ActivityItem = ({
  activity,
  media,
  onLike,
  onComment,
  onShare,
}: ActivityItemProps) => {
  return (
    <Card className="bg-secondary/40 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <img 
            src={activity.user.avatar} 
            alt={activity.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span>{" "}
              {activity.action}{" "}
              <span className="font-medium">{activity.media.title}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(activity.timestamp), { 
                addSuffix: true,
                locale: fr
              })}
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
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            onClick={onLike}
          >
            <Heart size={14} />
            <span>J'aime</span>
          </button>
          <button 
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            onClick={onComment}
          >
            <MessageCircle size={14} />
            <span>Commenter</span>
          </button>
          <button 
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
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
