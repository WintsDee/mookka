
import { create } from 'zustand';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from '@/components/ui/use-toast';
import { RealtimeSyncService } from './realtime/realtime-sync-service';

interface AppVersion {
  version: string;
  buildTime: string;
}

interface VersionState {
  currentVersion: AppVersion | null;
  latestVersion: AppVersion | null;
  needsUpdate: boolean;
  checkingForUpdate: boolean;
  setCurrentVersion: (version: AppVersion) => void;
  setLatestVersion: (version: AppVersion) => void;
  setNeedsUpdate: (needsUpdate: boolean) => void;
  setCheckingForUpdate: (checking: boolean) => void;
}

export const useVersionStore = create<VersionState>((set) => ({
  currentVersion: null,
  latestVersion: null,
  needsUpdate: false,
  checkingForUpdate: false,
  setCurrentVersion: (version) => set({ currentVersion: version }),
  setLatestVersion: (version) => set((state) => {
    const needsUpdate = state.currentVersion && (
      state.currentVersion.version !== version.version ||
      state.currentVersion.buildTime !== version.buildTime
    );
    return { latestVersion: version, needsUpdate };
  }),
  setNeedsUpdate: (needsUpdate) => set({ needsUpdate }),
  setCheckingForUpdate: (checkingForUpdate) => set({ checkingForUpdate }),
}));

export class AppVersionService {
  private static instance: AppVersionService;
  private versionCheckInterval: number | null = null;
  private realtimeService: RealtimeSyncService;
  
  private constructor() {
    this.realtimeService = RealtimeSyncService.getInstance();
  }
  
  public static getInstance(): AppVersionService {
    if (!AppVersionService.instance) {
      AppVersionService.instance = new AppVersionService();
    }
    return AppVersionService.instance;
  }
  
  public initialize(): void {
    // Generate or load the current version
    this.setCurrentVersion();
    
    // Setup periodic checks for new versions
    this.setupVersionCheck();
  }
  
  private setCurrentVersion(): void {
    // Get version from meta tag or generate
    const versionMeta = document.querySelector('meta[name="app-version"]');
    const buildTimeMeta = document.querySelector('meta[name="app-build-time"]');
    
    const version = {
      version: versionMeta ? versionMeta.getAttribute('content') || '1.0.0' : '1.0.0',
      buildTime: buildTimeMeta ? buildTimeMeta.getAttribute('content') || new Date().toISOString() : new Date().toISOString()
    };
    
    useVersionStore.getState().setCurrentVersion(version);
    
    // Store in localStorage for comparing after reloads
    const [_, setStoredVersion] = useLocalStorage<AppVersion>('app-version', version);
    setStoredVersion(version);
  }
  
  private setupVersionCheck(): void {
    // Clear any existing interval
    if (this.versionCheckInterval) {
      window.clearInterval(this.versionCheckInterval);
    }
    
    // Check every 15 minutes
    this.versionCheckInterval = window.setInterval(() => {
      this.checkForUpdates();
    }, 15 * 60 * 1000);
    
    // Also check on initial load
    this.checkForUpdates();
  }
  
  public async checkForUpdates(): Promise<void> {
    const { setCheckingForUpdate } = useVersionStore.getState();
    setCheckingForUpdate(true);
    
    try {
      // Fetch the index.html file to check for meta tags
      const response = await fetch('/', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch app version');
      }
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const versionMeta = doc.querySelector('meta[name="app-version"]');
      const buildTimeMeta = doc.querySelector('meta[name="app-build-time"]');
      
      if (versionMeta || buildTimeMeta) {
        const latestVersion = {
          version: versionMeta ? versionMeta.getAttribute('content') || '1.0.0' : '1.0.0',
          buildTime: buildTimeMeta ? buildTimeMeta.getAttribute('content') || new Date().toISOString() : new Date().toISOString()
        };
        
        useVersionStore.getState().setLatestVersion(latestVersion);
        
        const { currentVersion, needsUpdate } = useVersionStore.getState();
        
        if (needsUpdate) {
          this.notifyUserOfUpdate();
          
          // Broadcast via realtime to other clients
          this.realtimeService.broadcastChange({
            type: 'APP_VERSION',
            data: latestVersion
          });
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    } finally {
      setCheckingForUpdate(false);
    }
  }
  
  private notifyUserOfUpdate(): void {
    toast({
      title: "Mise à jour disponible",
      description: "Une nouvelle version de l'application est disponible. Voulez-vous recharger maintenant?",
      action: (
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-primary-foreground px-3 py-1 rounded-md"
        >
          Recharger
        </button>
      ),
    });
  }
  
  public cleanup(): void {
    if (this.versionCheckInterval) {
      window.clearInterval(this.versionCheckInterval);
      this.versionCheckInterval = null;
    }
  }
}

export default AppVersionService;
