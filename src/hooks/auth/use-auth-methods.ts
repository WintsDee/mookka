
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAuthMethods() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Erreur de connexion Google:", error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion Google",
        description: error.message || "Une erreur est survenue lors de la connexion avec Google"
      });
      setGoogleLoading(false);
    }
  };

  return {
    googleLoading,
    handleGoogleSignIn
  };
}
