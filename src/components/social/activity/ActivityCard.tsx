
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Heart, MessageCircle, Share2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SocialActivity, likeActivity, getActivityComments } from "@/services/media/social-service";
import { ActivityComments } from "./ActivityComments";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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

  const mediaTypeClasses: Record<string, string> = {
    film: "bg-primary/80",
    serie: "bg-purple-600/80", 
    book: "bg-amber-600/80",
    game: "bg-green-600/80"
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
    const url = `${window.location.origin}/media/${activity.media.type}/${activity.media.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${activity.media.title} - Mookka`,
        text: `Découvrez ${activity.media.title} sur Mookka !`,
        url
      }).catch(err => {
        console.error("Erreur lors du partage:", err);
        copyToClipboard(url);
      });
    } else {
      copyToClipboard(url);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans le presse-papier"
      });
    }).catch(err => {
      console.error("Erreur lors de la copie:", err);
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    });
  };

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border/50 bg-gradient-to-b from-secondary/20 to-background/60">
      <CardContent className="p-4">
        {/* En-tête de l'activité */}
        <div className="flex items-center gap-3">
          <Link to={`/profil/${activity.user.id}`} className="shrink-0">
            <img 
              src={activity.user.avatar} 
              alt={activity.user.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-background shadow-sm"
            />
          </Link>
          <div>
            <p className="text-sm">
              <Link to={`/profil/${activity.user.id}`} className="font-medium hover:underline">
                {activity.user.name}
              </Link>{" "}
              <span className="text-muted-foreground">{activity.action}</span>{" "}
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
            <div className="relative overflow-hidden rounded-md w-16 h-24 bg-muted shadow-sm">
              <img
                src={activity.media.coverImage || "/placeholder.svg"}
                alt={activity.media.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <div className={cn("absolute top-0 right-0 text-xs text-white px-1 py-0.5 rounded-bl", mediaTypeClasses[activity.media.type])}>
                {mediaTypeMap[activity.media.type]}
              </div>
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <Link to={`/media/${activity.media.type}/${activity.media.id}`} className="hover:underline">
              <h3 className="font-medium text-sm line-clamp-1">{activity.media.title}</h3>
            </Link>
            
            {activity.note && (
              <div className="mt-1 text-xs line-clamp-2 italic text-muted-foreground bg-secondary/20 p-2 rounded-sm">
                "{activity.note}"
              </div>
            )}
            
            {activity.rating && (
              <div className="mt-1 flex items-center">
                <div className={cn("text-xs font-medium px-1.5 py-0.5 rounded", 
                  activity.rating >= 7 ? "bg-green-500/20 text-green-500" : 
                  activity.rating >= 5 ? "bg-amber-500/20 text-amber-500" : 
                  "bg-red-500/20 text-red-500"
                )}>
                  {activity.rating}/10
                </div>
              </div>
            )}
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
            className={`flex items-center gap-1 text-xs ${showComments ? 'text-primary' : 'text-muted-foreground'}`}
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
