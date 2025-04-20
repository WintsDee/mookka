
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
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="fixed inset-0 z-0">
          <img 
            src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
            alt="Mookka Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 w-full max-w-md px-4">
          <ProfileSetupSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full pb-8">
      <div className="fixed inset-0 z-0">
        <img 
          src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
          alt="Mookka Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative z-10 w-full h-full flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-md">
          <MookkaHeader />
          <ProfileSetupForm onSubmit={updateProfile} />
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
