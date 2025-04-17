
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Media } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const useSocialActivity = () => {
  const [activities, setActivities] = useState([]);
  const [media, setMedia] = useState<Record<string, Media>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const { data: userMedia, error: userMediaError } = await supabase
          .from('user_media')
          .select('id, user_id, media_id, status, added_at')
          .order('added_at', { ascending: false })
          .limit(10);

        if (userMediaError) throw userMediaError;

        if (!userMedia || userMedia.length === 0) {
          setActivities([]);
          setLoading(false);
          return;
        }

        const mediaIds = userMedia.map(item => item.media_id);
        const { data: mediaData, error: mediaError } = await supabase
          .from('media')
          .select('*')
          .in('id', mediaIds);

        if (mediaError) throw mediaError;

        const mediaMap: Record<string, Media> = {};
        mediaData?.forEach(item => {
          mediaMap[item.id] = {
            id: item.id,
            title: item.title,
            type: item.type as any,
            coverImage: item.cover_image,
            year: item.year,
            rating: item.rating,
            genres: item.genres,
            description: item.description
          };
        });
        setMedia(mediaMap);

        const userIds = [...new Set(userMedia.map(item => item.user_id))];
        const defaultProfiles: Record<string, any> = {};
        userIds.forEach(id => {
          defaultProfiles[id] = {
            id,
            full_name: 'Utilisateur',
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`
          };
        });
        
        const profilesMap: Record<string, any> = { ...defaultProfiles };
        
        const activitiesData = userMedia.map(item => ({
          id: item.id,
          user: {
            id: item.user_id,
            name: profilesMap[item.user_id]?.name || profilesMap[item.user_id]?.full_name || 'Utilisateur',
            avatar: profilesMap[item.user_id]?.avatar || profilesMap[item.user_id]?.avatar_url || 
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user_id}`
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

        setActivities(activitiesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des activités:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les activités sociales",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [toast]);

  return { activities, media, loading };
};
