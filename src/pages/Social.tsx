
import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DEFAULT_AVATAR } from "@/config/avatars/avatar-utils";

const Social = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [media, setMedia] = useState<Record<string, Media>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useProfile();
  const navigate = useNavigate();

  // Mémoïser les handlers pour éviter les re-rendus inutiles
  const handleLike = useCallback((activityId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour aimer une activité",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Fonctionnalité en développement",
      description: "La fonctionnalité 'J'aime' sera disponible prochainement",
    });
  }, [isAuthenticated, toast]);

  const handleComment = useCallback((activityId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour commenter une activité",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Fonctionnalité en développement",
      description: "La fonctionnalité 'Commenter' sera disponible prochainement",
    });
  }, [isAuthenticated, toast]);

  const handleShare = useCallback((activityId: string) => {
    toast({
      title: "Fonctionnalité en développement",
      description: "La fonctionnalité 'Partager' sera disponible prochainement",
    });
  }, [toast]);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: userMedia, error: userMediaError } = await supabase
        .from('user_media')
        .select('id, user_id, media_id, status, added_at, user_rating')
        .order('added_at', { ascending: false })
        .limit(20);

      if (userMediaError) throw userMediaError;

      if (!userMedia || userMedia.length === 0) {
        setActivities([]);
        setMedia({});
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
          coverImage: item.cover_image || '/placeholder.svg',
          year: item.year,
          rating: item.rating,
          genres: item.genres,
          description: item.description
        };
      });
      setMedia(mediaMap);

      const userIds = [...new Set(userMedia.map(item => item.user_id))];
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds);
        
      if (profilesError) throw profilesError;
        
      const profilesMap: Record<string, UserProfile> = {};
      profiles?.forEach(profile => {
        profilesMap[profile.id] = {
          id: profile.id,
          full_name: profile.full_name || profile.username || 'Utilisateur',
          avatar_url: profile.avatar_url || DEFAULT_AVATAR
        };
      });
      
      userIds.forEach(id => {
        if (!profilesMap[id]) {
          profilesMap[id] = {
            id,
            full_name: 'Utilisateur',
            avatar_url: DEFAULT_AVATAR
          };
        }
      });
      
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
        
        if (item.user_rating) {
          action = `a noté ${item.user_rating}/10`;
        }

        return {
          id: item.id,
          user: {
            id: profileItem.id,
            name: profileItem.full_name || 'Utilisateur',
            avatar: profileItem.avatar_url || DEFAULT_AVATAR
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
      setError("Impossible de charger les activités sociales");
      toast({
        title: "Erreur",
        description: "Impossible de charger les activités sociales",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchActivities();
    
    const channel = supabase
      .channel('public:user_media')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_media'
      }, () => {
        fetchActivities();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchActivities]);

  // Mémoïser le contenu pour éviter les re-rendus
  const socialContent = useMemo(() => {
    if (!isAuthenticated) {
      return (
        <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Connectez-vous pour accéder aux fonctionnalités sociales</h2>
          <p className="text-muted-foreground mb-6">
            Suivez vos amis, partagez vos avis et découvrez de nouveaux médias.
          </p>
          <Button onClick={() => navigate('/auth')}>
            Se connecter
          </Button>
        </div>
      );
    }

    return (
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-2">
          <TabsTrigger value="activity">Activité</TabsTrigger>
          <TabsTrigger value="friends">Amis</TabsTrigger>
          <TabsTrigger value="discover">Découvrir</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="mt-4 animate-fade-in">
          <ScrollArea className={`${isMobile ? 'h-[calc(100vh-200px)]' : 'h-[calc(100vh-240px)]'}`}>
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
        
        <TabsContent value="friends" className="animate-fade-in">
          <div className="flex flex-col items-center justify-center h-40 text-center px-6">
            <p className="text-muted-foreground">
              Fonctionnalité à venir dans la prochaine mise à jour
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="discover" className="animate-fade-in">
          <div className="flex flex-col items-center justify-center h-40 text-center px-6">
            <p className="text-muted-foreground">
              Fonctionnalité à venir dans la prochaine mise à jour
            </p>
          </div>
        </TabsContent>
      </Tabs>
    );
  }, [isAuthenticated, navigate, isMobile, activities, media, loading, handleLike, handleComment, handleShare]);

  return (
    <Background>
      <MobileHeader title="Social" />
      <div className="pb-24 pt-safe mt-16 animate-fade-in transition-opacity duration-300 ease-in-out">
        <header className="px-6 mb-6">
          <div className="mt-4">
            {error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : (
              socialContent
            )}
          </div>
        </header>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Social;
