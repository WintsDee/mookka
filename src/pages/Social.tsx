import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Media, MediaType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MobileHeader } from "@/components/mobile-header";
import { Activity, UserProfile } from "@/components/social/types";
import { ActivityFeed } from "@/components/social/activity-feed";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DEFAULT_AVATAR } from "@/config/avatars/avatar-utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Wifi, WifiOff, Loader2 } from "lucide-react";

const Social = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [media, setMedia] = useState<Record<string, Media>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useProfile();
  const navigate = useNavigate();

  // Handlers optimisés avec useCallback
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
    if (!isAuthenticated) {
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    try {
      console.log("Début du chargement des activités sociales");
      
      const { data: userMedia, error: userMediaError } = await supabase
        .from('user_media')
        .select('id, user_id, media_id, status, added_at, user_rating')
        .order('added_at', { ascending: false })
        .limit(20);

      if (userMediaError) {
        console.error("Erreur user_media:", userMediaError);
        throw new Error(`Erreur de récupération des données: ${userMediaError.message}`);
      }

      if (!userMedia || userMedia.length === 0) {
        console.log("Aucune activité trouvée");
        setActivities([]);
        setMedia({});
        return;
      }

      console.log(`${userMedia.length} activités trouvées`);

      const mediaIds = userMedia.map(item => item.media_id);
      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .select('*')
        .in('id', mediaIds);

      if (mediaError) {
        console.error("Erreur media:", mediaError);
        throw new Error(`Erreur de récupération des médias: ${mediaError.message}`);
      }

      const mediaMap: Record<string, Media> = {};
      mediaData?.forEach(item => {
        if (item && item.id) {
          mediaMap[item.id] = {
            id: item.id,
            title: item.title || 'Titre inconnu',
            type: item.type as MediaType,
            coverImage: item.cover_image || '/placeholder.svg',
            year: item.year,
            rating: item.rating,
            genres: item.genres,
            description: item.description
          };
        }
      });
      setMedia(mediaMap);

      const userIds = [...new Set(userMedia.map(item => item.user_id))].filter(Boolean);
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds);
        
      if (profilesError) {
        console.error("Erreur profiles:", profilesError);
      }
        
      const profilesMap: Record<string, UserProfile> = {};
      profiles?.forEach(profile => {
        if (profile && profile.id) {
          profilesMap[profile.id] = {
            id: profile.id,
            full_name: profile.full_name || profile.username || 'Utilisateur',
            avatar_url: profile.avatar_url || DEFAULT_AVATAR
          };
        }
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
      
      const activitiesData = userMedia
        .filter(item => item && item.media_id && mediaMap[item.media_id])
        .map(item => {
          const mediaItem = mediaMap[item.media_id];
          const profileItem = profilesMap[item.user_id];

          let action = 'a ajouté';
          switch (item.status) {
            case 'watching':
              action = 'regarde';
              break;
            case 'completed':
              action = 'a terminé';
              break;
            case 'to-watch':
              action = 'veut voir';
              break;
            default:
              action = 'a ajouté';
          }
          
          if (item.user_rating && item.user_rating > 0) {
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

      console.log(`${activitiesData.length} activités formatées`);
      setActivities(activitiesData);
      setError(null);
      
    } catch (error: any) {
      console.error("Erreur lors de la récupération des activités:", error);
      const errorMessage = error.message || "Impossible de charger les activités sociales";
      setError(errorMessage);
      
      toast({
        title: "Erreur de chargement",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsRetrying(false);
      setIsInitialized(true);
    }
  }, [toast, isAuthenticated]);

  const handleRetry = useCallback(() => {
    setIsRetrying(true);
    setError(null);
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    // Délai pour éviter le clignotement
    const initTimer = setTimeout(() => {
      fetchActivities();
    }, 100);
    
    return () => clearTimeout(initTimer);
  }, [fetchActivities]);

  useEffect(() => {
    if (!isAuthenticated || !isInitialized) return;
    
    const channel = supabase
      .channel('public:user_media')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_media'
      }, (payload) => {
        console.log('Changement détecté:', payload);
        fetchActivities();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchActivities, isAuthenticated, isInitialized]);

  // Contenu social optimisé pour éviter le clignotement
  const socialContent = useMemo(() => {
    if (!isInitialized) {
      return (
        <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Wifi className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Rejoignez la communauté Mookka</h2>
            <p className="text-muted-foreground max-w-md">
              Connectez-vous pour suivre vos amis, partager vos avis et découvrir de nouveaux médias recommandés par la communauté.
            </p>
          </div>
          <Button onClick={() => navigate('/auth')} size="lg">
            Se connecter
          </Button>
        </div>
      );
    }

    if (error) {
      return (
        <div className="space-y-4 p-6">
          <Alert variant="destructive">
            <WifiOff className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                disabled={isRetrying}
                className="ml-2"
              >
                {isRetrying ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {isRetrying ? "Chargement..." : "Réessayer"}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-4 sticky top-0 z-10">
          <TabsTrigger value="activity">Activité</TabsTrigger>
          <TabsTrigger value="friends">Amis</TabsTrigger>
          <TabsTrigger value="discover">Découvrir</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="mt-0">
          <ScrollArea className={`${isMobile ? 'h-[calc(100vh-220px)]' : 'h-[calc(100vh-260px)]'}`}>
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
        
        <TabsContent value="friends" className="mt-0">
          <div className="flex flex-col items-center justify-center h-60 text-center px-6 space-y-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Amis</h3>
              <p className="text-sm text-muted-foreground">
                Connectez-vous avec vos amis et suivez leurs activités
              </p>
              <p className="text-xs text-muted-foreground">
                Fonctionnalité disponible prochainement
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="discover" className="mt-0">
          <div className="flex flex-col items-center justify-center h-60 text-center px-6 space-y-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Découvrir</h3>
              <p className="text-sm text-muted-foreground">
                Explorez les tendances et découvrez de nouveaux contenus
              </p>
              <p className="text-xs text-muted-foreground">
                Fonctionnalité disponible prochainement
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    );
  }, [isInitialized, isAuthenticated, navigate, error, handleRetry, isRetrying, isMobile, activities, media, loading, handleLike, handleComment, handleShare]);

  return (
    <Background>
      <MobileHeader title="Social" />
      <div className="pb-24 pt-safe mt-16 transition-opacity duration-300 ease-in-out">
        <div className="px-6">
          {socialContent}
        </div>
      </div>
      <MobileNav />
    </Background>
  );
};

export default Social;
