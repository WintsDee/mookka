
import React, { createContext, useContext, useEffect, useState } from 'react';
import RealtimeSyncService from '@/services/realtime/realtime-sync-service';
import AppVersionService from '@/services/app-version-service';
import CacheService from '@/services/cache-service';
import { useProfile } from '@/hooks/use-profile';

interface AppServicesContextType {
  syncService: RealtimeSyncService;
  versionService: AppVersionService;
  cacheService: CacheService;
  isInitialized: boolean;
}

const AppServicesContext = createContext<AppServicesContextType | null>(null);

export const AppServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, isAuthenticated } = useProfile();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const syncService = RealtimeSyncService.getInstance();
  const versionService = AppVersionService.getInstance();
  const cacheService = CacheService.getInstance();
  
  useEffect(() => {
    // Initialize services
    syncService.initialize(profile?.id || null);
    versionService.initialize();
    cacheService.initialize();
    
    // Add version meta tags if they don't exist
    if (!document.querySelector('meta[name="app-version"]')) {
      const versionMeta = document.createElement('meta');
      versionMeta.name = 'app-version';
      versionMeta.content = '1.0.0';
      document.head.appendChild(versionMeta);
    }
    
    if (!document.querySelector('meta[name="app-build-time"]')) {
      const buildTimeMeta = document.createElement('meta');
      buildTimeMeta.name = 'app-build-time';
      buildTimeMeta.content = new Date().toISOString();
      document.head.appendChild(buildTimeMeta);
    }
    
    setIsInitialized(true);
    
    // Cleanup on unmount
    return () => {
      syncService.cleanup();
      versionService.cleanup();
      cacheService.cleanup();
    };
  }, [profile?.id, isAuthenticated]);
  
  const value: AppServicesContextType = {
    syncService,
    versionService,
    cacheService,
    isInitialized,
  };
  
  return (
    <AppServicesContext.Provider value={value}>
      {children}
    </AppServicesContext.Provider>
  );
};

export const useAppServices = () => {
  const context = useContext(AppServicesContext);
  if (!context) {
    throw new Error('useAppServices must be used within an AppServicesProvider');
  }
  return context;
};
