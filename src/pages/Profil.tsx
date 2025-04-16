
import React, { useEffect } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeaderWithSync } from "@/components/mobile-header-with-sync";
import { UserStats } from "@/components/profile/user-stats";
import { useCollections } from "@/hooks/use-collections";
import { useProfile } from "@/hooks/use-profile";
import { ProfileSkeleton } from "@/components/profile/profile-skeleton";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { ProfileActions } from "@/components/profile/profile-actions";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useCachedQuery } from "@/hooks/use-cached-query";
import { MediaType } from "@/types";

const Profil = () => {
  const { profile, loading, isAuthenticated, updateProfile } = useProfile();
  const navigate = useNavigate();
  
  const { myCollections, loadingMyCollections } = useCollections();
  
  // Fetch user library statistics from Supabase with cache
  const { 
    data: stats = { films: 0, series: 0, books: 0, games: 0, total: 0 }, 
    isLoading: loadingStats,
    syncStatus
  } = useCachedQuery(
    ['library-stats', profile?.id],
    async () => {
      if (!profile?.id) {
        return { films: 0, series: 0, books: 0, games: 0, total: 0 };
      }
      
      // Get counts from user media
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
    {
      enabled: !!profile?.id && isAuthenticated,
      cacheKey: `library-stats-${profile?.id}`,
      cacheTtl: 30 * 60 * 1000, // 30 minutes
      watchTables: [
        { table: 'user_media', event: 'INSERT' },
        { table: 'user_media', event: 'DELETE' },
      ]
    }
  );

  // Fetch user favorite media with cache
  const { 
    data: favoriteMedia = [], 
    isLoading: loadingFavorites 
  } = useCachedQuery(
    ['favorite-media', profile?.id],
    async () => {
      if (!profile?.id) return [];
      
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
    {
      enabled: !!profile?.id && isAuthenticated,
      cacheKey: `favorite-media-${profile?.id}`,
      cacheTtl: 30 * 60 * 1000, // 30 minutes
      watchTables: [
        { table: 'user_media', event: 'INSERT' },
        { table: 'user_media', event: 'UPDATE' },
        { table: 'user_media', event: 'DELETE' },
      ]
    }
  );
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <Background>
      <MobileHeaderWithSync title="Profil" />
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
