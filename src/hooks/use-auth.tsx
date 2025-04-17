
import { useAuthState } from "./auth/use-auth-state";
import { useAuthMethods } from "./auth/use-auth-methods";
import { useAuthTabs } from "./auth/use-auth-tabs";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export function useAuth() {
  const { isAuthenticated } = useAuthState();
  const { googleLoading, handleGoogleSignIn } = useAuthMethods();
  const { activeTab, setActiveTab } = useAuthTabs();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  return {
    user,
    googleLoading,
    activeTab,
    setActiveTab,
    handleGoogleSignIn,
    isAuthenticated
  };
}
