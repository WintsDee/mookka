
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { localCache } from "@/services/cache/local-cache";
import { UpdateBanner } from "@/components/ui/update-banner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Bibliotheque from "./pages/Bibliotheque";
import Recherche from "./pages/Recherche";
import Social from "./pages/Social";
import Actualites from "./pages/Actualites";
import Profil from "./pages/Profil";
import Notifications from "./pages/Notifications";
import MediaDetail from "./pages/MediaDetail";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Soutenir from "./pages/Soutenir";

// Configuration du client React Query avec cache persistant
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Désactiver la récupération automatique pour contrôler nous-mêmes la logique
      retry: false,
      // Ralentir le polling en production
      refetchInterval: process.env.NODE_ENV === 'production' ? false : undefined,
      // Refetch on window focus pour avoir des données fraîches
      refetchOnWindowFocus: true,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Conserver les données dans le cache pendant 1 jour
      staleTime: 24 * 60 * 60 * 1000,
    },
  },
});

const App = () => {
  // Nettoyer périodiquement le cache expiré
  useEffect(() => {
    // Nettoyer les données expirées au démarrage
    localCache.clearExpired();
    
    // Nettoyer régulièrement les données expirées
    const interval = setInterval(() => {
      localCache.clearExpired();
    }, 60 * 60 * 1000); // Une fois par heure
    
    return () => clearInterval(interval);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Bannière de mise à jour de l'application */}
        <UpdateBanner />
        
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/bibliotheque" element={<Bibliotheque />} />
            <Route path="/recherche" element={<Recherche />} />
            <Route path="/social" element={<Social />} />
            <Route path="/actualites" element={<Actualites />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/media/:type/:id" element={<MediaDetail />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:id" element={<CollectionDetail />} />
            <Route path="/soutenir" element={<Soutenir />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
