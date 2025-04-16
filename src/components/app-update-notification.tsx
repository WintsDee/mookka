
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useVersionStore } from '@/services/app-version-service';
import { AlertCircle } from 'lucide-react';

export const AppUpdateNotification: React.FC = () => {
  const { needsUpdate, latestVersion } = useVersionStore();
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    if (needsUpdate) {
      setDismissed(false);
    }
  }, [needsUpdate]);
  
  if (!needsUpdate || dismissed) {
    return null;
  }
  
  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 mx-auto max-w-md bg-primary text-primary-foreground rounded-lg shadow-lg p-4 m-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <AlertCircle size={20} />
        <div className="font-medium">Mise à jour disponible</div>
      </div>
      <p className="text-sm">
        Une nouvelle version de l'application est disponible. 
        Version {latestVersion?.version}
      </p>
      <div className="flex justify-end gap-2 mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setDismissed(true)}
          className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
        >
          Plus tard
        </Button>
        <Button 
          size="sm" 
          onClick={() => window.location.reload()}
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
        >
          Mettre à jour
        </Button>
      </div>
    </div>
  );
};
