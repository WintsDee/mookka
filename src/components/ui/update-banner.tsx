
import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServiceWorkerUpdate } from "@/hooks/use-sw-update";
import { motion, AnimatePresence } from "framer-motion";

export function UpdateBanner() {
  const { updateStatus, applyUpdate, reloadPage } = useServiceWorkerUpdate();
  
  // N'afficher le banner que si une mise à jour est disponible
  if (updateStatus !== 'available' && updateStatus !== 'updating') {
    return null;
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-primary text-white p-4 shadow-md"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className={updateStatus === 'updating' ? "animate-spin" : ""} size={20} />
            <span>
              {updateStatus === 'updating' 
                ? "Application en cours de mise à jour..." 
                : "Une nouvelle version est disponible."
              }
            </span>
          </div>
          
          {updateStatus === 'available' && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={applyUpdate}
              className="text-primary font-semibold"
            >
              Mettre à jour
            </Button>
          )}
          
          {updateStatus === 'updating' && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={reloadPage}
              className="text-primary font-semibold"
            >
              Recharger
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
