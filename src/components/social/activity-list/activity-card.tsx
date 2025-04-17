
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Media, MediaType } from '@/types';

interface ActivityCardProps {
  activity: {
    id: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
    action: string;
    media: {
      id: string;
      title: string;
      type: MediaType;
    };
    timestamp: string;
  };
  mediaDetails: Media;
}

export const ActivityCard = ({ activity, mediaDetails }: ActivityCardProps) => {
  const { toast } = useToast();

  const handleLike = () => {
    toast({
      title: "Fonctionnalité en développement",
      description: "La fonctionnalité 'J'aime' sera disponible prochainement",
    });
  };

  const handleComment = () => {
    toast({
      title: "Fonctionnalité en développement",
      description: "La fonctionnalité 'Commenter' sera disponible prochainement",
    });
  };

  const handleShare = () => {
    toast({
      title: "Fonctionnalité en développement",
      description: "La fonctionnalité 'Partager' sera disponible prochainement",
    });
  };

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
        
        {mediaDetails && (
          <div className="mt-3 flex items-center gap-3">
            <Link to={`/media/${activity.media.type}/${activity.media.id}`}>
              <img
                src={mediaDetails.coverImage}
                alt={mediaDetails.title}
                className="w-16 h-24 rounded-md object-cover"
              />
            </Link>
            <div>
              <Link to={`/media/${activity.media.type}/${activity.media.id}`} className="hover:underline">
                <h3 className="font-medium text-sm">{mediaDetails.title}</h3>
              </Link>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {mediaDetails.description?.slice(0, 80)}...
              </p>
            </div>
          </div>
        )}
        
        <div className="flex justify-between mt-4">
          <button 
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            onClick={handleLike}
          >
            <Heart size={14} />
            <span>J'aime</span>
          </button>
          <button 
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            onClick={handleComment}
          >
            <MessageCircle size={14} />
            <span>Commenter</span>
          </button>
          <button 
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            onClick={handleShare}
          >
            <Share2 size={14} />
            <span>Partager</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
