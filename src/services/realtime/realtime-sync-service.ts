
import { supabase } from '@/integrations/supabase/client';
import { RealtimeBroadcastPayload, RealtimePostgresChangesPayload, SynchronizationEvent } from '@/types/realtime';
import ConnectionManager from './connection-manager';
import { toast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { create } from 'zustand';

interface SyncStore {
  events: SynchronizationEvent[];
  addEvent: (event: SynchronizationEvent) => void;
  clearEvents: () => void;
}

export const useSyncStore = create<SyncStore>((set) => ({
  events: [],
  addEvent: (event) => set((state) => ({
    events: [...state.events, event]
  })),
  clearEvents: () => set({ events: [] }),
}));

export class RealtimeSyncService {
  private static instance: RealtimeSyncService;
  private connectionManager: ConnectionManager;
  private userId: string | null = null;
  private isInitialized = false;
  
  private constructor() {
    this.connectionManager = ConnectionManager.getInstance();
  }
  
  public static getInstance(): RealtimeSyncService {
    if (!RealtimeSyncService.instance) {
      RealtimeSyncService.instance = new RealtimeSyncService();
    }
    return RealtimeSyncService.instance;
  }
  
  public initialize(userId: string | null): void {
    if (this.isInitialized) return;
    
    this.userId = userId;
    this.connectionManager.initialize();
    
    if (userId) {
      this.setupRealtimeListeners();
    }
    
    this.isInitialized = true;
  }
  
  private setupRealtimeListeners(): void {
    const channel = this.connectionManager.getChannel();
    
    // Listen for postgres changes
    channel.on(
      'postgres_changes' as any,
      { event: '*', schema: 'public' },
      (payload: RealtimePostgresChangesPayload) => {
        this.handleDatabaseChange(payload);
      }
    );
    
    // Listen for broadcast messages
    channel.on(
      'broadcast',
      { event: 'sync' },
      (payload: RealtimeBroadcastPayload<SynchronizationEvent>) => {
        if (payload.payload.userId !== this.userId) {
          this.handleSyncEvent(payload.payload);
        }
      }
    );
    
    channel.subscribe();
  }
  
  private handleDatabaseChange(payload: RealtimePostgresChangesPayload): void {
    const { table, eventType, new: newData } = payload;
    
    let type: SynchronizationEvent['type'];
    let resourceId: string | undefined;
    
    switch (table) {
      case 'user_media':
        type = 'MEDIA_CHANGE';
        resourceId = newData?.media_id;
        break;
      case 'collections':
      case 'collection_items':
        type = 'COLLECTION_CHANGE';
        resourceId = newData?.collection_id || newData?.id;
        break;
      case 'profiles':
        type = 'PROFILE_CHANGE';
        resourceId = newData?.id;
        break;
      default:
        return; // Ignore other tables
    }
    
    const event: SynchronizationEvent = {
      type,
      resourceId,
      userId: newData?.user_id,
      timestamp: Date.now(),
      data: newData,
    };
    
    useSyncStore.getState().addEvent(event);
    this.notifyChange(event);
  }
  
  private handleSyncEvent(event: SynchronizationEvent): void {
    useSyncStore.getState().addEvent(event);
    this.notifyChange(event);
  }
  
  private notifyChange(event: SynchronizationEvent): void {
    // Only notify if it's not the current user's change
    if (event.userId && event.userId !== this.userId) {
      switch (event.type) {
        case 'MEDIA_CHANGE':
          toast({
            title: "Bibliothèque mise à jour",
            description: "Des changements ont été détectés dans votre bibliothèque.",
          });
          break;
        case 'COLLECTION_CHANGE':
          toast({
            title: "Collection mise à jour",
            description: "Des changements ont été détectés dans vos collections.",
          });
          break;
        case 'PROFILE_CHANGE':
          toast({
            title: "Profil mis à jour",
            description: "Votre profil a été mis à jour.",
          });
          break;
        case 'APP_VERSION':
          // Handled by the app version service
          break;
      }
    }
  }
  
  public broadcastChange(event: Omit<SynchronizationEvent, 'timestamp'>): void {
    if (!this.userId) return;
    
    const fullEvent: SynchronizationEvent = {
      ...event,
      userId: this.userId,
      timestamp: Date.now(),
    };
    
    // Use the channel to broadcast the event
    const channel = this.connectionManager.getChannel();
    channel.send({
      type: 'broadcast',
      event: 'sync',
      payload: fullEvent,
    });
    
    // Add to local store as well
    useSyncStore.getState().addEvent(fullEvent);
  }
  
  public cleanup(): void {
    this.connectionManager.cleanup();
    this.isInitialized = false;
  }
}

export default RealtimeSyncService;
