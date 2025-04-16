
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

const Profil = () => {
  const { profile, loading, isAuthenticated, updateProfile } = useProfile();
  const navigate = useNavigate();
  
  const { myCollections, loadingMyCollections } = useCollections();
  
  // Fetch user library statistics from Supabase
  const { data: stats = { films: 0, series: 0, books: 0, games: 0, total: 0 }, isLoading: loadingStats } = useQuery({
    queryKey: ['library-stats', profile?.id],
    queryFn: async () => {
      if (!profile?.id) {
        return { films: 0, series: 0, books: 0, games: 0, total: 0 };
      }
      
      // Get counts from user library
      const { data: libraryData, error: libraryError } = await supabase
        .from('user_library')
        .select('type')
        .eq('user_id', profile.id);
        
      if (libraryError) {
        console.error('Error fetching library stats:', libraryError);
        return { films: 0, series: 0, books: 0, games: 0, total: 0 };
      }
      
      const films = libraryData.filter(item => item.type === 'film').length;
      const series = libraryData.filter(item => item.type === 'serie').length;
      const books = libraryData.filter(item => item.type === 'book').length;
      const games = libraryData.filter(item => item.type === 'game').length;
      const total = libraryData.length;
      
      return { films, series, books, games, total };
    },
    enabled: !!profile?.id && isAuthenticated
  });

  // Fetch user favorite media
  const { data: favoriteMedia = [], isLoading: loadingFavorites } = useQuery({
    queryKey: ['favorite-media', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('user_library')
        .select('*, media(*)')
        .eq('user_id', profile.id)
        .eq('is_favorite', true)
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
        type: item.media?.type || item.type,
        coverImage: item.media?.cover_image || '',
        year: item.media?.year,
        rating: item.media?.rating,
        // Add additional fields as needed
      }));
    },
    enabled: !!profile?.id && isAuthenticated
  });
  
  const handleLogout = async () => {
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
