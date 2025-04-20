
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
import MookkaHeader from "@/components/home/MookkaHeader";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useProfile();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile-setup');
    }
  }, [isAuthenticated, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        toast({
          title: "Confirmation d'email requise",
          description: "Veuillez vérifier votre boîte de réception (et vos spams) pour confirmer votre adresse email.",
          duration: 7000, // 7 seconds
          variant: "default"
        });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/bibliotheque");
      }
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
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
          alt="Mookka Background" 
          className="w-full h-full object-cover fixed"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="w-full max-w-md flex flex-col items-center rounded-xl p-6 animate-fade-in">
        <MookkaHeader />
        
        <Card className="w-full mt-6 bg-black/20 backdrop-blur-sm border-white/20">
          <form onSubmit={handleAuth}>
            <CardHeader>
              <CardTitle className="text-white">
                {isSignUp ? "Créer un compte" : "Se connecter"}
              </CardTitle>
              <CardDescription className="text-white/70">
                {isSignUp
                  ? "Créez votre compte pour commencer à utiliser l'application"
                  : "Connectez-vous pour accéder à votre bibliothèque"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white">
                  Mot de passe
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full font-medium shadow-md hover:shadow-lg transition-all"
                disabled={loading}
              >
                {loading ? "Chargement..." : isSignUp ? "S'inscrire" : "Se connecter"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 hover:border-white/30 shadow-md hover:shadow-lg transition-all"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? "Déjà un compte ? Se connecter"
                  : "Pas de compte ? S'inscrire"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
