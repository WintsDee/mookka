
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/use-profile";
import { RegistrationForm } from "@/components/auth/registration-form";
import { useIsMobile } from "@/hooks/use-mobile";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useProfile();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/bibliotheque");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate("/bibliotheque");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto">
      <div className="fixed inset-0 -z-10">
        <img 
          src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
          alt="Mookka Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="min-h-screen w-full py-8 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md flex flex-col items-center">
          <img 
            src="/lovable-uploads/59160824-2c34-4d40-82c6-d9f9f5b4d1f3.png" 
            alt="Mookka Logo" 
            className={`${isMobile ? 'w-24 h-24' : 'w-32 h-32 sm:w-40 sm:h-40'} mb-4 animate-scale-in drop-shadow-lg`}
          />
          
          <Card className="w-full bg-background/80 backdrop-blur-md border-border/20 my-4">
            <CardHeader className={`${isMobile ? 'px-4 py-3' : ''}`}>
              <CardTitle className={`${isMobile ? 'text-xl' : ''}`}>
                {isSignUp ? "Créer un compte" : "Se connecter"}
              </CardTitle>
              <CardDescription>
                {isSignUp
                  ? "Créez votre compte pour commencer à utiliser l'application"
                  : "Connectez-vous pour accéder à votre bibliothèque"}
              </CardDescription>
            </CardHeader>

            {isSignUp ? (
              <CardContent className={`${isMobile ? 'px-4 pt-0' : ''}`}>
                <RegistrationForm
                  onSuccess={() => setIsSignUp(false)}
                />
              </CardContent>
            ) : (
              <form onSubmit={handleLogin}>
                <CardContent className={`space-y-4 ${isMobile ? 'px-4 pt-0' : ''}`}>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="votre@email.com"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Mot de passe
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="text-sm"
                    />
                  </div>
                </CardContent>
                <CardFooter className={`flex flex-col space-y-4 ${isMobile ? 'px-4 pb-4' : ''}`}>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Connexion..." : "Se connecter"}
                  </Button>
                </CardFooter>
              </form>
            )}

            <CardFooter className={`flex-col space-y-4 ${isMobile ? 'px-4 pb-4 pt-0' : ''}`}>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-sm"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? "Déjà un compte ? Se connecter"
                  : "Pas de compte ? S'inscrire"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
