
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { useAuth } from "./hooks/use-auth";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

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
            <Route path="/auth" element={<Auth />} />
            <Route path="/connexion" element={<Navigate to="/auth" replace />} />
            <Route path="/bibliotheque" element={<ProtectedRoute><Bibliotheque /></ProtectedRoute>} />
            <Route path="/recherche" element={<ProtectedRoute><Recherche /></ProtectedRoute>} />
            <Route path="/social" element={<ProtectedRoute><Social /></ProtectedRoute>} />
            <Route path="/decouvrir" element={<ProtectedRoute><Decouvrir /></ProtectedRoute>} />
            <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/media/:type/:id" element={<ProtectedRoute><MediaDetail /></ProtectedRoute>} />
            <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
            <Route path="/collections/:id" element={<ProtectedRoute><CollectionDetail /></ProtectedRoute>} />
            <Route path="/soutenir" element={<Soutenir />} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
