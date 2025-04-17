
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UserMediaActivity {
  id: string;
  user_id: string;
  media_id: string;
  status: string;
  added_at: string;
}

export const useActivityFetch = () => {
  const [activities, setActivities] = useState<UserMediaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data: userMedia, error: userMediaError } = await supabase
          .from('user_media')
          .select('id, user_id, media_id, status, added_at')
          .order('added_at', { ascending: false })
          .limit(10);

        if (userMediaError) throw userMediaError;
        setActivities(userMedia || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des activités:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les activités sociales",
          variant: "destructive",
        });
      }
    };

    fetchActivities();
  }, [toast]);

  return { activities, loading, setLoading };
};
