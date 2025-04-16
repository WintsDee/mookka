
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SocialActivity, likeActivity, getActivityComments } from "@/services/media/social-service";
import { ActivityComments } from "./ActivityComments";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityCardProps {
  activity: SocialActivity;
  onUpdate: () => void;
}

export function ActivityCard({ activity, onUpdate }: ActivityCardProps) {
  const [isLiked, setIsLiked] = useState(activity.hasLiked);
  const [likesCount, setLikesCount] = useState(activity.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const { toast } = useToast();

  const mediaTypeMap: Record<string, string> = {
    film: "film",
    serie: "série",
    book: "livre",
    game: "jeu"
  };

  const handleLike = async () => {
    const result = await likeActivity(activity.id);
    if (result.success) {
      setIsLiked(result.liked || false);
      setLikesCount(prev => result.liked ? prev + 1 : prev - 1);
      onUpdate();
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'aimer cette activité",
        variant: "destructive"
      });
    }
  };

  const handleCommentsClick = async () => {
    if (!showComments) {
      setLoadingComments(true);
      const { data, error } = await getActivityComments(activity.id);
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les commentaires",
          variant: "destructive"
        });
      } else {
        setComments(data || []);
      }
      setLoadingComments(false);
    }
    setShowComments(!showComments);
  };

  const handleShare = () => {
    toast({
      title: "Partage",
      description: "Fonctionnalité de partage en développement"
    });
  };

  return (
    <Card className="bg-secondary/30 border-border/50 overflow-hidden">
      <CardContent className="p-4">
        {/* En-tête de l'activité */}
        <div className="flex items-center gap-3">
          <Link to={`/profil/${activity.user.id}`}>
            <img 
              src={activity.user.avatar} 
              alt={activity.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>
          <div>
            <p className="text-sm">
              <Link to={`/profil/${activity.user.id}`} className="font-medium hover:underline">
                {activity.user.name}
              </Link>{" "}
              {activity.action}{" "}
              <span className="font-medium">
                {activity.media.title}
              </span>
              <span className="text-muted-foreground">
                {" "}({mediaTypeMap[activity.media.type] || activity.media.type})
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(activity.timestamp), { 
                addSuffix: true,
                locale: fr
              })}
            </p>
          </div>
        </div>
        
        {/* Contenu du média */}
        <div className="mt-3 flex items-start gap-3">
          <Link to={`/media/${activity.media.type}/${activity.media.id}`} className="shrink-0">
            <div className="relative overflow-hidden rounded-md w-16 h-24 bg-muted">
              {activity.media.type === 'film' && (
                <div className="absolute top-0 right-0 bg-primary/80 text-xs text-white px-1 py-0.5 rounded-bl">
                  Film
                </div>
              )}
              {activity.media.type === 'serie' && (
                <div className="absolute top-0 right-0 bg-purple-600/80 text-xs text-white px-1 py-0.5 rounded-bl">
                  Série
                </div>
              )}
              {activity.media.type === 'book' && (
                <div className="absolute top-0 right-0 bg-amber-600/80 text-xs text-white px-1 py-0.5 rounded-bl">
                  Livre
                </div>
              )}
              {activity.media.type === 'game' && (
                <div className="absolute top-0 right-0 bg-green-600/80 text-xs text-white px-1 py-0.5 rounded-bl">
                  Jeu
                </div>
              )}
            </div>
          </Link>
          <div className="flex-1">
            <Link to={`/media/${activity.media.type}/${activity.media.id}`} className="hover:underline">
              <h3 className="font-medium text-sm">{activity.media.title}</h3>
            </Link>
            {/* Possibilité d'ajouter plus de détails sur le média ici */}
          </div>
        </div>
        
        {/* Actions sociales */}
        <div className="flex justify-between mt-4 border-t border-border/50 pt-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center gap-1 text-xs ${isLiked ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={handleLike}
          >
            <Heart size={16} className={isLiked ? 'fill-primary' : ''} />
            <span>{likesCount} J'aime{likesCount > 1 ? 's' : ''}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-xs text-muted-foreground"
            onClick={handleCommentsClick}
          >
            <MessageCircle size={16} />
            <span>{activity.comments} Commentaire{activity.comments > 1 ? 's' : ''}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-xs text-muted-foreground"
            onClick={handleShare}
          >
            <Share2 size={16} />
            <span>Partager</span>
          </Button>
        </div>
        
        {/* Section commentaires */}
        {showComments && (
          <div className="mt-3 pt-2 border-t border-border/50">
            <ScrollArea className="max-h-60">
              <ActivityComments 
                activityId={activity.id} 
                comments={comments} 
                loading={loadingComments} 
                onCommentAdded={() => {
                  onUpdate();
                  handleCommentsClick();
                }} 
              />
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
