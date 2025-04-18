import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Recherche from "./pages/Recherche";
import Bibliotheque from "./pages/Bibliotheque";
import Actualites from "./pages/Actualites";
import Notifications from "./pages/Notifications";
import Social from "./pages/Social";
import Profil from "./pages/Profil";
import MediaDetail from "./pages/MediaDetail";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Settings from "./pages/Settings";
import Soutenir from "./pages/Soutenir";
import { PWAInstallPrompt } from "./components/pwa/install-prompt";

// Create a client
const queryClient = new QueryClient();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loading screen for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <ThemeProvider defaultTheme="dark" storageKey="mookka-theme">
            {isLoading ? (
              <LoadingScreen />
            ) : (
              <>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/recherche" element={<Recherche />} />
                  <Route path="/bibliotheque" element={<Bibliotheque />} />
                  <Route path="/actualites" element={<Actualites />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/social" element={<Social />} />
                  <Route path="/profil" element={<Profil />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/collection/:id" element={<CollectionDetail />} />
                  <Route path="/media/:type/:id" element={<MediaDetail />} />
                  <Route path="/parametres" element={<Settings />} />
                  <Route path="/soutenir" element={<Soutenir />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster position="bottom-center" closeButton />
                <PWAInstallPrompt />
              </>
            )}
          </ThemeProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
