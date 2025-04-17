import React, { useEffect, useState } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { MobileHeader } from "@/components/mobile-header";
import { Media, MediaType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Activity type representing a user's interaction with media
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
    type: MediaType;
  };
  timestamp: string;
}

// Basic profile interface to handle user data
interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

const Social = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [media, setMedia] = useState<Record<string, Media>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch recent user activity
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        // First get recently added user media
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

        // Get media details
        const mediaIds = userMedia.map(item => item.media_id);
        const { data: mediaData, error: mediaError } = await supabase
          .from('media')
          .select('*')
          .in('id', mediaIds);

        if (mediaError) throw mediaError;

        // Create a map of media by ID
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

        // Get user profiles
        const userIds = [...new Set(userMedia.map(item => item.user_id))];
        
        // Create default profiles as fallback
        const defaultProfiles: Record<string, UserProfile> = {};
        userIds.forEach(id => {
          defaultProfiles[id] = {
            id,
            full_name: 'Utilisateur',
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`
          };
        });
        
        // Create a map of profiles by ID using the default profiles
        const profilesMap: Record<string, any> = { ...defaultProfiles };
        
        // Create activities from the data
        const activitiesData = userMedia.map(item => {
          const mediaItem = mediaMap[item.media_id];
          const profileItem = profilesMap[item.user_id] || {
            id: item.user_id,
            name: 'Utilisateur',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user_id}`
          };

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
              name: profileItem.name || profileItem.full_name || 'Utilisateur',
              avatar: profileItem.avatar || profileItem.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileItem.id}`
            },
            action,
            media: {
              id: item.media_id,
              title: mediaItem?.title || 'Titre inconnu',
              type: mediaItem?.type as MediaType || 'film' as MediaType
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

  const renderActivities = () => {
    if (loading) {
      return (
        <div className="space-y-4 px-1">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-secondary/40 border-border/50">
              <CardContent className="p-4">
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
              </CardContent>
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
        {activities.map((activity) => {
          const mediaItem = media[activity.media.id];
          
          return (
            <Card key={activity.id} className="bg-secondary/40 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={activity.user.avatar} 
                    alt={activity.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.user.name}</span>{" "}
                      {activity.action}{" "}
                      <span className="font-medium">{activity.media.title}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { 
                        addSuffix: true,
                        locale: fr
                      })}
                    </p>
                  </div>
                </div>
                
                {mediaItem && (
                  <div className="mt-3 flex items-center gap-3">
                    <Link to={`/media/${mediaItem.type}/${activity.media.id}`}>
                      <img
                        src={mediaItem.coverImage}
                        alt={mediaItem.title}
                        className="w-16 h-24 rounded-md object-cover"
                      />
                    </Link>
                    <div>
                      <Link to={`/media/${mediaItem.type}/${activity.media.id}`} className="hover:underline">
                        <h3 className="font-medium text-sm">{mediaItem.title}</h3>
                      </Link>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {mediaItem.description?.slice(0, 80)}...
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between mt-4">
                  <button 
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                    onClick={() => handleLike(activity.id)}
                  >
                    <Heart size={14} />
                    <span>J'aime</span>
                  </button>
                  <button 
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                    onClick={() => handleComment(activity.id)}
                  >
                    <MessageCircle size={14} />
                    <span>Commenter</span>
                  </button>
                  <button 
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                    onClick={() => handleShare(activity.id)}
                  >
                    <Share2 size={14} />
                    <span>Partager</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <Background>
      <MobileHeader title="Social" />
      <div className="pb-24 pt-safe mt-16">
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
                  {renderActivities()}
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
