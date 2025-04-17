
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/auth-provider";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { PwaInstallPrompt } from "@/components/pwa/install-prompt";
import React from "react";  // Ensure React is imported
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
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";

// Create a new QueryClient instance within the component to ensure it's created after React initialization
const App = () => {
  // Initialize the QueryClient inside the component
  const queryClient = React.useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <PwaInstallPrompt />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/bibliotheque" element={
                <ProtectedRoute>
                  <Bibliotheque />
                </ProtectedRoute>
              } />
              <Route path="/recherche" element={<Recherche />} />
              <Route path="/social" element={
                <ProtectedRoute>
                  <Social />
                </ProtectedRoute>
              } />
              <Route path="/actualites" element={<Actualites />} />
              <Route path="/profil" element={
                <ProtectedRoute>
                  <Profil />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="/media/:type/:id" element={<MediaDetail />} />
              <Route path="/collections" element={
                <ProtectedRoute>
                  <Collections />
                </ProtectedRoute>
              } />
              <Route path="/collections/:id" element={<CollectionDetail />} />
              <Route path="/soutenir" element={<Soutenir />} />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
