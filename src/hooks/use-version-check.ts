
import { useEffect, useState } from 'react';
import { APP_INFO } from '@/config/app-info';
import { toast } from '@/components/ui/sonner';

const CURRENT_VERSION_KEY = 'app_current_version';

export function useVersionCheck() {
  const [needsRefresh, setNeedsRefresh] = useState(false);

  useEffect(() => {
    const checkVersion = () => {
      const currentVersion = localStorage.getItem(CURRENT_VERSION_KEY);
      
      if (!currentVersion) {
        localStorage.setItem(CURRENT_VERSION_KEY, APP_INFO.version);
        return;
      }

      if (currentVersion !== APP_INFO.version) {
        setNeedsRefresh(true);
        toast("Nouvelle version disponible", {
          description: "Une nouvelle version de l'application est disponible. Cliquez ici pour mettre à jour.",
          action: {
            label: "Mettre à jour",
            onClick: () => window.location.reload(),
          },
          duration: Infinity,
        });
      }
    };

    checkVersion();
  }, []);

  return { needsRefresh };
}
