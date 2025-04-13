
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
