
import React, { useEffect, useState } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Media, MediaType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MobileHeader } from "@/components/mobile-header";
import { Activity, UserProfile } from "@/components/social/types";
import { ActivityFeed } from "@/components/social/activity-feed";

const Social = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
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
            type: item.type as MediaType,
            coverImage: item.cover_image,
            year: item.year,
            rating: item.rating,
            genres: item.genres,
            description: item.description
          };
        });
        setMedia(mediaMap);

        const userIds = [...new Set(userMedia.map(item => item.user_id))];
        
        const defaultProfiles: Record<string, UserProfile> = {};
        userIds.forEach(id => {
          defaultProfiles[id] = {
            id,
            full_name: 'Utilisateur',
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`
          };
        });
        
        const profilesMap: Record<string, UserProfile> = { ...defaultProfiles };
        
        const activitiesData = userMedia.map(item => {
          const mediaItem = mediaMap[item.media_id];
          const profileItem = profilesMap[item.user_id];

          let action = 'a ajouté';
          switch (item.status) {
            case 'watching':
              action = 'a commencé';
              break;
            case 'completed':
              action = 'a terminé';
              break;
            default:
              action = 'a ajouté';
          }

          return {
            id: item.id,
            user: {
              id: profileItem.id,
              name: profileItem.full_name || 'Utilisateur',
              avatar: profileItem.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileItem.id}`
            },
            action,
            media: {
              id: item.media_id,
              title: mediaItem?.title || 'Titre inconnu',
              type: mediaItem?.type || 'film'
            },
            timestamp: item.added_at
          };
        });

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

  const handleLike = (activityId: string) => {
    toast({
      title: "Fonctionnalité en développement",
      description: "La fonctionnalité 'J'aime' sera disponible prochainement",
    });
  };

  const handleComment = (activityId: string) => {
    toast({
      title: "Fonctionnalité en développement",
      description: "La fonctionnalité 'Commenter' sera disponible prochainement",
    });
  };

  const handleShare = (activityId: string) => {
    toast({
      title: "Fonctionnalité en développement",
      description: "La fonctionnalité 'Partager' sera disponible prochainement",
    });
  };

  return (
    <Background>
      <MobileHeader title="Social" />
      <div className="pb-24 pt-safe mt-16 animate-fade-in">
        <header className="px-6 mb-6">
          <div className="mt-4">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="activity">Activité</TabsTrigger>
                <TabsTrigger value="friends">Amis</TabsTrigger>
                <TabsTrigger value="discover">Découvrir</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity" className="mt-4">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <ActivityFeed
                    activities={activities}
                    media={media}
                    loading={loading}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                  />
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="friends">
                <div className="flex flex-col items-center justify-center h-40 text-center px-6">
                  <p className="text-muted-foreground">
                    Fonctionnalité à venir dans la prochaine mise à jour
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="discover">
                <div className="flex flex-col items-center justify-center h-40 text-center px-6">
                  <p className="text-muted-foreground">
                    Fonctionnalité à venir dans la prochaine mise à jour
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </header>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Social;
