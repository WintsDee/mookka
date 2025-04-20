
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/use-profile";
import { ProfileSetupForm } from "@/components/profile/profile-setup-form";
import { ProfileSetupSkeleton } from "@/components/profile/profile-setup-skeleton";
import MookkaHeader from "@/components/home/MookkaHeader";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { profile, isAuthenticated, loading: profileLoading, updateProfile } = useProfile();

  useEffect(() => {
    if (profileLoading) return;
    
    if (!isAuthenticated) {
      navigate('/auth');
    } else if (profile?.username) {
      navigate('/bibliotheque');
    }
  }, [isAuthenticated, profile, navigate, profileLoading]);

  if (profileLoading) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 z-0">
          <img 
            src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
            alt="Mookka Background" 
            className="w-full h-full object-cover fixed"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <ProfileSetupSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0">
        <img 
          src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
          alt="Mookka Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center py-8 px-4 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <MookkaHeader />
          <ProfileSetupForm onSubmit={updateProfile} />
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
