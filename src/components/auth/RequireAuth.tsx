
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/use-auth-state";
import { useToast } from "@/components/ui/use-toast";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthState();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        toast({
          title: "Accès refusé",
          description: "Vous devez être connecté pour accéder à cette page.",
          variant: "destructive"
        });
        navigate("/auth", { replace: true });
      } else {
        setChecked(true);
      }
    }
  }, [isAuthenticated, loading, navigate, toast]);

  if (loading || !checked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return children;
}
