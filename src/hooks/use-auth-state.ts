
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export function useAuthState() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<{ user: User } | null>(null);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session?.user) {
          setLoading(false);
        }
      }
    );
    
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session?.user) {
        setLoading(false);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  return {
    session,
    isAuthenticated: !!session?.user,
    loading
  };
}
