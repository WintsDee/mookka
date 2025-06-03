
import React, { memo, useMemo } from "react";
import { Activity } from "@/components/social/types";
import { ActivityItem } from "@/components/social/activity-item";
import { Media } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
  // Mémoïser le skeleton de chargement
  const loadingSkeleton = useMemo(() => (
    <div className="space-y-4 px-1">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="bg-secondary/40 border-border/50">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-muted animate-pulse rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="w-16 h-24 bg-muted animate-pulse rounded-md" />
              <div className="flex-1">
                <div className="h-4 bg-muted animate-pulse rounded w-2/3 mb-2" />
                <div className="h-3 bg-muted animate-pulse rounded w-full mb-1" />
                <div className="h-3 bg-muted animate-pulse rounded w-4/5" />
              </div>
            </div>
          </div>
        </Card>
      ))}
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
