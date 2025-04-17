
import React from "react";
import { Background } from "@/components/ui/background";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthCard } from "@/components/auth/auth-card";
import { useAuth } from "@/hooks/use-auth";

const Auth = () => {
  const { googleLoading, activeTab, handleGoogleSignIn } = useAuth();
  
  return (
    <Background>
      <div className="h-full flex flex-col justify-center items-center px-4 pt-safe">
        <div className="w-full max-w-md">
          <AuthHeader />
          <AuthCard 
            activeTab={activeTab} 
            onGoogleSignIn={handleGoogleSignIn}
            googleLoading={googleLoading}
          />
        </div>
      </div>
    </Background>
  );
};

export default Auth;
