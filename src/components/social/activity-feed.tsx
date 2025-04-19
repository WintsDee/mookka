
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
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

export const ActivityFeed = ({
  activities,
  media,
  loading,
  onLike,
  onComment,
  onShare,
}: ActivityFeedProps) => {
  if (loading) {
    return (
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
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center px-6">
        <p className="text-muted-foreground mb-4">
          Aucune activité pour le moment. Ajoutez des médias à votre bibliothèque pour les voir apparaître ici.
        </p>
        <Button asChild>
          <Link to="/recherche">Découvrir des médias</Link>
        </Button>
      </div>
    );
  }

  return (
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
  );
};
