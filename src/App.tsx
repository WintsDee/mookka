import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { AppServicesProvider } from "./contexts/app-services-context";
import { AppUpdateNotification } from "./components/app-update-notification";
import { create } from 'zustand';
import { useEffect } from "react";

// Create a new QueryClient with better caching settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
});

// Set cache headers for app
if (typeof window !== 'undefined') {
  // Disable browser caching for the app's HTML
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Cache-Control';
  meta.content = 'no-cache, no-store, must-revalidate';
  document.head.appendChild(meta);
  
  // Add pragma directive
  const pragma = document.createElement('meta');
  pragma.httpEquiv = 'Pragma';
  pragma.content = 'no-cache';
  document.head.appendChild(pragma);
  
  // Add expires directive
  const expires = document.createElement('meta');
  expires.httpEquiv = 'Expires';
  expires.content = '0';
  document.head.appendChild(expires);
}

// Create service worker listener
interface ServiceWorkerState {
  registration: ServiceWorkerRegistration | null;
  setRegistration: (reg: ServiceWorkerRegistration | null) => void;
}

const useServiceWorker = create<ServiceWorkerState>((set) => ({
  registration: null,
  setRegistration: (registration) => set({ registration }),
}));

// Service Worker Registration
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Unregister old service workers first to force update
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
      }

      // Register the new service worker
      const swUrl = `/service-worker.js?v=${Date.now()}`;
      const registration = await navigator.serviceWorker.register(swUrl, { scope: '/' });
      useServiceWorker.getState().setRegistration(registration);
      
      console.log('ServiceWorker registration successful');
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  }
};

const App = () => {
  useEffect(() => {
    // Register service worker on mount
    registerServiceWorker();
    
    return () => {
      // Cleanup
      const { registration } = useServiceWorker.getState();
      if (registration) {
        registration.unregister();
      }
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppServicesProvider>
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
            <AppUpdateNotification />
          </BrowserRouter>
        </AppServicesProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
