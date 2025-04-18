
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { PageTransition } from "./components/page-transition";

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
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Reduce unnecessary refetches
      staleTime: 60000, // 1 minute
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <ThemeProvider defaultTheme="dark" storageKey="mookka-theme">
            <Routes>
              {[
                { path: "/", element: <Index /> },
                { path: "/recherche", element: <Recherche /> },
                { path: "/bibliotheque", element: <Bibliotheque /> },
                { path: "/actualites", element: <Actualites /> },
                { path: "/notifications", element: <Notifications /> },
                { path: "/social", element: <Social /> },
                { path: "/profil", element: <Profil /> },
                { path: "/collections", element: <Collections /> },
                { path: "/collection/:id", element: <CollectionDetail /> },
                { path: "/media/:type/:id", element: <MediaDetail /> },
                { path: "/parametres", element: <Settings /> },
                { path: "/soutenir", element: <Soutenir /> },
                { path: "*", element: <NotFound /> }
              ].map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <PageTransition>
                      {route.element}
                    </PageTransition>
                  }
                />
              ))}
            </Routes>
            <Toaster position="bottom-center" closeButton />
            <PWAInstallPrompt />
          </ThemeProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
