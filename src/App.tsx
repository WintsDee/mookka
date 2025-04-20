import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useVersionCheck } from "@/hooks/use-version-check";
import { useOffline } from "@/hooks/use-offline";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Bibliotheque from "./pages/Bibliotheque";
import Recherche from "./pages/Recherche";
import Social from "./pages/Social";
import Decouvrir from "./pages/Decouvrir";
import Profil from "./pages/Profil";
import Notifications from "./pages/Notifications";
import MediaDetail from "./pages/MediaDetail";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Soutenir from "./pages/Soutenir";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => {
  useVersionCheck();
  const isOffline = useOffline();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {isOffline && (
            <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-black py-2 px-4 text-center z-50">
              Mode hors ligne - Certaines fonctionnalités ne sont pas disponibles
            </div>
          )}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/bibliotheque" element={<Bibliotheque />} />
            <Route path="/recherche" element={<Recherche />} />
            <Route path="/social" element={<Social />} />
            <Route path="/decouvrir" element={<Decouvrir />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/media/:type/:id" element={<MediaDetail />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:id" element={<CollectionDetail />} />
            <Route path="/soutenir" element={<Soutenir />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
