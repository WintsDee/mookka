
import { useAuthState } from "./auth/use-auth-state";
import { useAuthMethods } from "./auth/use-auth-methods";
import { useAuthTabs } from "./auth/use-auth-tabs";

export function useAuth() {
  const { isAuthenticated } = useAuthState();
  const { googleLoading, handleGoogleSignIn } = useAuthMethods();
  const { activeTab, setActiveTab } = useAuthTabs();
  
  return {
    googleLoading,
    activeTab,
    setActiveTab,
    handleGoogleSignIn,
    isAuthenticated
  };
}
