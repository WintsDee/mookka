
import React, { memo, useMemo } from "react";
import { Activity } from "@/components/social/types";
import { ActivityItem } from "@/components/social/activity-item";
import { Media } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface ActivityFeedProps {
  activities: Activity[];
  media: Record<string, Media>;
  loading: boolean;
  onLike: (activityId: string) => void;
  onComment: (activityId: string) => void;
  onShare: (activityId: string) => void;
}

const ActivityFeedComponent = ({
  activities,
  media,
  loading,
  onLike,
  onComment,
  onShare,
}: ActivityFeedProps) => {
  // Mémoïser le skeleton de chargement avec la même icône que l'app
  const loadingSkeleton = useMemo(() => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
      <p className="text-sm text-muted-foreground">Chargement des activités...</p>
    </div>
  ), []);

  // Mémoïser l'état vide
  const emptyState = useMemo(() => (
    <div className="flex flex-col items-center justify-center h-40 text-center px-6">
      <p className="text-muted-foreground mb-4">
        Aucune activité pour le moment. Ajoutez des médias à votre bibliothèque pour les voir apparaître ici.
      </p>
      <Button asChild>
        <Link to="/recherche">Découvrir des médias</Link>
      </Button>
    </div>
  ), []);

  // Mémoïser la liste des activités
  const activitiesList = useMemo(() => (
    <div className="space-y-4 px-1">
      {activities.map((activity) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          media={media[activity.media.id]}
          onLike={() => onLike(activity.id)}
          onComment={() => onComment(activity.id)}
          onShare={() => onShare(activity.id)}
        />
      ))}
    </div>
  ), [activities, media, onLike, onComment, onShare]);

  if (loading) {
    return loadingSkeleton;
  }

  if (activities.length === 0) {
    return emptyState;
  }

  return activitiesList;
};

// Mémoïsation avec comparaison personnalisée pour éviter les re-rendus inutiles
export const ActivityFeed = memo(ActivityFeedComponent, (prevProps, nextProps) => {
  return (
    prevProps.loading === nextProps.loading &&
    prevProps.activities.length === nextProps.activities.length &&
    JSON.stringify(prevProps.activities) === JSON.stringify(nextProps.activities) &&
    JSON.stringify(prevProps.media) === JSON.stringify(nextProps.media) &&
    prevProps.onLike === nextProps.onLike &&
    prevProps.onComment === nextProps.onComment &&
    prevProps.onShare === nextProps.onShare
  );
});

ActivityFeed.displayName = 'ActivityFeed';
