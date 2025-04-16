
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { ActivityComment, addComment } from "@/services/media/social-service";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityCommentsProps {
  activityId: string;
  comments: ActivityComment[];
  loading: boolean;
  onCommentAdded: () => void;
}

export function ActivityComments({ activityId, comments, loading, onCommentAdded }: ActivityCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    const result = await addComment(activityId, newComment);
    
    if (result.success) {
      setNewComment("");
      onCommentAdded();
      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été ajouté avec succès"
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter votre commentaire",
        variant: "destructive"
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      {/* Zone de commentaire */}
      <div className="flex items-end gap-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ajouter un commentaire..."
          className="min-h-[60px] text-sm resize-none"
          disabled={submitting}
        />
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={handleCommentSubmit}
          disabled={!newComment.trim() || submitting}
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Liste des commentaires */}
      <div className="space-y-3">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            Aucun commentaire pour le moment. Soyez le premier à commenter !
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-2 animate-in fade-in">
              <Link to={`/profil/${comment.user.id}`} className="shrink-0">
                <img 
                  src={comment.user.avatar} 
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </Link>
              <div>
                <div className="flex items-baseline gap-2">
                  <Link to={`/profil/${comment.user.id}`} className="text-sm font-medium hover:underline">
                    {comment.user.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.timestamp), { 
                      addSuffix: true,
                      locale: fr
                    })}
                  </span>
                </div>
                <p className="text-sm break-words">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
