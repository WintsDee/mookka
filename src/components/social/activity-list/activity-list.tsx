
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActivityCard } from './activity-card';
import { ActivitySkeleton } from './activity-skeleton';
import { ActivityEmpty } from './activity-empty';
import { Media } from '@/types';

interface Activity {
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
    type: string;
  };
  timestamp: string;
}

interface ActivityListProps {
  activities: Activity[];
  media: Record<string, Media>;
  loading: boolean;
}

export const ActivityList = ({ activities, media, loading }: ActivityListProps) => {
  if (loading) {
    return (
      <div className="space-y-4 px-1">
        {[1, 2, 3].map((i) => (
          <ActivitySkeleton key={i} />
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return <ActivityEmpty />;
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-4 px-1">
        {activities.map((activity) => (
          <ActivityCard 
            key={activity.id} 
            activity={activity}
            mediaDetails={media[activity.media.id]}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
