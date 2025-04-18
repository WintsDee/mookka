
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Background } from "@/components/ui/background";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Redirection automatique si le chemin contient des segments supplémentaires
    const pathSegments = location.pathname.split('/');
    if (pathSegments.length > 4 && pathSegments[1] === 'media') {
      const [_, mediaSegment, typeSegment, idSegment] = pathSegments;
      // Rediriger vers la bonne URL de détail du média
      navigate(`/${mediaSegment}/${typeSegment}/${idSegment.split('/')[0]}`, { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleReturnHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <Background>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertTriangle className="h-16 w-16 text-amber-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6 text-center">
          Oops! La page que vous recherchez n'existe pas
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button onClick={handleReturnHome} size="lg">
            Retour à l'accueil
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)} size="lg">
            Retour à la page précédente
          </Button>
        </div>
      </div>
    </Background>
  );
};

export default NotFound;
