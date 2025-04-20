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
import Auth from "./pages/Auth";
import ProfileSetup from "./pages/ProfileSetup";

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
            <Route path="/bibliotheque" element={<RequireAuth><Bibliotheque /></RequireAuth>} />
            <Route path="/recherche" element={<RequireAuth><Recherche /></RequireAuth>} />
            <Route path="/social" element={<RequireAuth><Social /></RequireAuth>} />
            <Route path="/decouvrir" element={<RequireAuth><Decouvrir /></RequireAuth>} />
            <Route path="/profil" element={<RequireAuth><Profil /></RequireAuth>} />
            <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
            <Route path="/media/:type/:id" element={<RequireAuth><MediaDetail /></RequireAuth>} />
            <Route path="/collections" element={<RequireAuth><Collections /></RequireAuth>} />
            <Route path="/collections/:id" element={<RequireAuth><CollectionDetail /></RequireAuth>} />
            <Route path="/soutenir" element={<Soutenir />} />
            <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile-setup" element={<RequireAuth><ProfileSetup /></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
