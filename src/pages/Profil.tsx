
import React, { useEffect } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { UserStats } from "@/components/profile/user-stats";
import { useCollections } from "@/hooks/use-collections";
import { useProfile } from "@/hooks/use-profile";
import { ProfileSkeleton } from "@/components/profile/profile-skeleton";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { ProfileActions } from "@/components/profile/profile-actions";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MediaType } from "@/types";
import { useAppServices } from "@/contexts/app-services-context";

const Profil = () => {
  const { profile, loading, isAuthenticated, updateProfile } = useProfile();
  const navigate = useNavigate();
  const { myCollections, loadingMyCollections } = useCollections();
  const { cacheService } = useAppServices();
  
  // Fetch user library statistics from Supabase with intelligent caching
  const { data: stats = { films: 0, series: 0, books: 0, games: 0, total: 0 }, isLoading: loadingStats } = useQuery({
    queryKey: ['library-stats', profile?.id],
    queryFn: async () => {
      if (!profile?.id) {
        return { films: 0, series: 0, books: 0, games: 0, total: 0 };
      }
      
      // Use cache service if available
      if (cacheService) {
        return cacheService.get(
          `library-stats-${profile.id}`, 
          async () => {
            const { data: mediaData, error: mediaError } = await supabase
              .from('user_media')
              .select('media(type)')
              .eq('user_id', profile.id);
              
            if (mediaError) {
              console.error('Error fetching library stats:', mediaError);
              throw mediaError;
            }
            
            const films = mediaData.filter(item => item.media?.type === 'film').length;
            const series = mediaData.filter(item => item.media?.type === 'serie').length;
            const books = mediaData.filter(item => item.media?.type === 'book').length;
            const games = mediaData.filter(item => item.media?.type === 'game').length;
            const total = mediaData.length;
            
            return { films, series, books, games, total };
          },
          { maxAge: 5 * 60 * 1000 } // 5 minutes
        );
      }
      
      // Fallback to normal query if cache service is not available
      const { data: mediaData, error: mediaError } = await supabase
        .from('user_media')
        .select('media(type)')
        .eq('user_id', profile.id);
        
      if (mediaError) {
        console.error('Error fetching library stats:', mediaError);
        return { films: 0, series: 0, books: 0, games: 0, total: 0 };
      }
      
      const films = mediaData.filter(item => item.media?.type === 'film').length;
      const series = mediaData.filter(item => item.media?.type === 'serie').length;
      const books = mediaData.filter(item => item.media?.type === 'book').length;
      const games = mediaData.filter(item => item.media?.type === 'game').length;
      const total = mediaData.length;
      
      return { films, series, books, games, total };
    },
    enabled: !!profile?.id && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch user favorite media with intelligent caching
  const { data: favoriteMedia = [], isLoading: loadingFavorites } = useQuery({
    queryKey: ['favorite-media', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      // Use cache service if available
      if (cacheService) {
        return cacheService.get(
          `favorite-media-${profile.id}`,
          async () => {
            const { data, error } = await supabase
              .from('user_media')
              .select('*, media(*)')
              .eq('user_id', profile.id)
              .order('updated_at', { ascending: false })
              .limit(6);
              
            if (error) {
              console.error('Error fetching favorite media:', error);
              throw error;
            }
            
            return data.map(item => ({
              id: item.media?.id || item.media_id,
              externalId: item.media?.external_id,
              title: item.media?.title || 'Média inconnu',
              type: item.media?.type as MediaType,
              coverImage: item.media?.cover_image || '',
              year: item.media?.year,
              rating: item.media?.rating,
            })).filter(item => item.title && item.coverImage);
          },
          { maxAge: 5 * 60 * 1000 } // 5 minutes
        );
      }
      
      // Fallback to normal query if cache service is not available
      const { data, error } = await supabase
        .from('user_media')
        .select('*, media(*)')
        .eq('user_id', profile.id)
        .order('updated_at', { ascending: false })
        .limit(6);
        
      if (error) {
        console.error('Error fetching favorite media:', error);
        return [];
      }
      
      return data.map(item => ({
        id: item.media?.id || item.media_id,
        externalId: item.media?.external_id,
        title: item.media?.title || 'Média inconnu',
        type: item.media?.type as MediaType,
        coverImage: item.media?.cover_image || '',
        year: item.media?.year,
        rating: item.media?.rating,
      })).filter(item => item.title && item.coverImage);
    },
    enabled: !!profile?.id && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Logout with cache clear
  const handleLogout = async () => {
    if (cacheService) {
      cacheService.clear();
    }
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <Background>
      <MobileHeader title="Profil" />
      <div className="pt-safe pb-24 mt-16">
        {loading ? (
          <ProfileSkeleton />
        ) : (
          <>
            <ProfileHeader 
              profile={profile} 
              isAuthenticated={isAuthenticated} 
              onUpdateProfile={updateProfile} 
            />
            
            <div className="px-6">
              <UserStats stats={stats} />
              
              <div className="mt-6">
                <ProfileTabs 
                  collections={myCollections} 
                  loadingCollections={loadingMyCollections}
                  favoriteMedia={favoriteMedia}
                />
              </div>
              
              <ProfileActions 
                isAuthenticated={isAuthenticated} 
                onLogout={handleLogout} 
              />
            </div>
          </>
        )}
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Profil;
