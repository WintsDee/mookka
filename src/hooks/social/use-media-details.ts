
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Media } from '@/types';

export const useMediaDetails = (mediaIds: string[]) => {
  const [mediaMap, setMediaMap] = useState<Record<string, Media>>({});

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (mediaIds.length === 0) return;

      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .select('*')
        .in('id', mediaIds);

      if (mediaError) {
        console.error("Error fetching media details:", mediaError);
        return;
      }

      const newMediaMap: Record<string, Media> = {};
      mediaData?.forEach(item => {
        newMediaMap[item.id] = {
          id: item.id,
          title: item.title,
          type: item.type as Media['type'],
          coverImage: item.cover_image,
          year: item.year,
          rating: item.rating,
          genres: item.genres,
          description: item.description
        };
      });
      setMediaMap(newMediaMap);
    };

    fetchMediaDetails();
  }, [mediaIds]);

  return mediaMap;
};
