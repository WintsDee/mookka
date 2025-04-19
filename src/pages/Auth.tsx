
import { Button } from "@/components/ui/button";
import { Background } from "@/components/ui/background";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthSocial } from "@/components/auth/auth-social";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const onAuthSuccess = () => {
    navigate("/bibliotheque");
    toast({
      title: "Connexion réussie",
      description: "Bienvenue sur Mookka !",
    });
  };

  return (
    <Background pattern={false} className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-6 shadow-lg">
        <AuthHeader />
        <AuthForm isLoading={isLoading} setIsLoading={setIsLoading} onSuccess={onAuthSuccess} />
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Ou continuer avec</span>
          </div>
        </div>
        <AuthSocial isLoading={isLoading} setIsLoading={setIsLoading} onSuccess={onAuthSuccess} />
      </div>
    </Background>
  );
};

export default Auth;
