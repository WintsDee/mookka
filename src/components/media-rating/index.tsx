
import React, { useState, useEffect } from "react";
import { EnhancedRatingSlider } from "./enhanced-rating-slider";
import { ReviewTextarea } from "./review-textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Star, Edit, Trash2 } from "lucide-react";
import { MediaType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { NotLoggedInCard } from "./not-logged-in-card";
import { useAuthState } from "@/hooks/use-auth-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaRating } from "@/hooks/use-media-rating";
import { Badge } from "@/components/ui/badge";

export interface MediaRatingProps {
  mediaId: string;
  mediaType: MediaType;
  initialNotes?: string;
  onRatingComplete?: (rating?: number) => void;
}

export function MediaRating({ 
  mediaId, 
  mediaType, 
  initialNotes = "", 
  onRatingComplete 
}: MediaRatingProps) {
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState(initialNotes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { isAuthenticated, session } = useAuthState();
  const { submitRating, userRating, userReview, userMediaStatus } = useMediaRating(mediaId, mediaType);
  
  // Initialize with existing user rating
  useEffect(() => {
    if (userRating) {
      setRating(userRating);
      setIsEditing(false);
    } else {
      setRating(0);
    }
    if (userReview) {
      setNotes(userReview);
    } else {
      setNotes("");
    }
  }, [userRating, userReview]);

  const handleRatingChange = (value: number) => {
    setRating(value);
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
  
  const handleSubmit = async () => {
    if (notes.length > 0 && notes.length < 10) {
      return; // Validation error handled in UI
    }

    setIsSubmitting(true);
    
    try {
      const success = await submitRating({
        rating,
        notes,
        status: userMediaStatus || 'completed'
      });

      if (success && onRatingComplete) {
        await onRatingComplete(rating);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error during rating submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await submitRating({
        rating: 0,
        notes: "",
        status: userMediaStatus || 'completed'
      });
      setRating(0);
      setNotes("");
      setIsEditing(false);
    } catch (error) {
      console.error("Error deleting rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isAuthenticated) {
    return <NotLoggedInCard />;
  }
  
  const userAvatarUrl = session?.user?.user_metadata?.avatar_url || null;
  const userName = session?.user?.user_metadata?.full_name || session?.user?.email || "Utilisateur";
  
  const hasExistingRating = userRating && userRating > 0;
  const showForm = !hasExistingRating || isEditing;

  return (
    <div className="space-y-6">
      {/* User's rating/review */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3 border border-border/50">
                <AvatarImage 
                  src={userAvatarUrl || undefined}
                  alt={userName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{userName}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Votre critique</span>
                  {hasExistingRating && !isEditing && (
                    <Badge variant="secondary" className="text-xs">
                      {userRating}/10
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {hasExistingRating && !isEditing && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="gap-2 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            )}
          </div>
          
          {showForm ? (
            <div className="space-y-6">
              <EnhancedRatingSlider value={rating} onChange={handleRatingChange} />
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Critique (optionnel)</p>
                <ReviewTextarea 
                  value={notes} 
                  onChange={handleNotesChange}
                  placeholder="Partagez votre avis sur ce média... (minimum 10 caractères si vous souhaitez ajouter une critique)"
                />
                {notes.length > 0 && notes.length < 10 && (
                  <p className="text-xs text-destructive">
                    Minimum 10 caractères requis ({notes.length}/10)
                  </p>
                )}
              </div>
              
              <div className="flex justify-end gap-2">
                {isEditing && (
                  <Button 
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    Annuler
                  </Button>
                )}
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || (notes.length > 0 && notes.length < 10)}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4" />
                      {hasExistingRating ? 'Mettre à jour' : 'Publier ma critique'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {userReview && (
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground whitespace-pre-wrap">{userReview}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
