
import { useState, useEffect } from 'react';
import { useActivityFetch } from './use-activity-fetch';
import { useMediaDetails } from './use-media-details';
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
    type: Media['type'];
  };
  timestamp: string;
}

export const useSocialActivity = () => {
  const [formattedActivities, setFormattedActivities] = useState<Activity[]>([]);
  const { activities, loading, setLoading } = useActivityFetch();
  const mediaIds = activities.map(item => item.media_id);
  const mediaMap = useMediaDetails(mediaIds);

  useEffect(() => {
    const formatActivities = () => {
      const formatted = activities.map(item => ({
        id: item.id,
        user: {
          id: item.user_id,
          name: 'Utilisateur',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user_id}`
        },
        action: item.status === 'watching' ? 'a commencé' :
                item.status === 'completed' ? 'a terminé' : 'a ajouté',
        media: {
          id: item.media_id,
          title: mediaMap[item.media_id]?.title || 'Titre inconnu',
          type: mediaMap[item.media_id]?.type || 'film'
        },
        timestamp: item.added_at
      }));

      setFormattedActivities(formatted);
      setLoading(false);
    };

    if (Object.keys(mediaMap).length > 0) {
      formatActivities();
    }
  }, [activities, mediaMap, setLoading]);

  return { activities: formattedActivities, media: mediaMap, loading };
};
