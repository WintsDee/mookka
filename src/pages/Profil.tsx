
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { mockMedia } from "@/data/mockData";
import { UserStats } from "@/components/profile/user-stats";
import { useCollections } from "@/hooks/use-collections";
import { useProfile } from "@/hooks/use-profile";
import { ProfileSkeleton } from "@/components/profile/profile-skeleton";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { ProfileActions } from "@/components/profile/profile-actions";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Profil = () => {
  const { profile, loading, isAuthenticated, updateProfile } = useProfile();
  const navigate = useNavigate();
  
  const { myCollections, loadingMyCollections } = useCollections();

  const stats = {
    films: mockMedia.filter(m => m.type === "film").length,
    series: mockMedia.filter(m => m.type === "serie").length,
    books: mockMedia.filter(m => m.type === "book").length,
    games: mockMedia.filter(m => m.type === "game").length,
    total: mockMedia.length
  };
  
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
                  favoriteMedia={mockMedia.slice(0, 6)}
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
