
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { RealtimeChannel, SyncStatus } from "./types";

export class ConnectionManager {
  private channels: Record<string, RealtimeChannel> = {};
  private subscribed = false;
  private _syncStatus: SyncStatus = 'synced';
  
  constructor() {
    this.setupConnectionListeners();
  }
  
  private setupConnectionListeners(): void {
    // Set up online/offline listeners
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // Set initial status based on browser's connection state
    this._syncStatus = navigator.onLine ? 'synced' : 'offline';
  }
  
  public createChannel(channelName: string): RealtimeChannel {
    if (this.channels[channelName]) {
      return this.channels[channelName];
    }
    
    const channel = supabase.channel(channelName);
    this.channels[channelName] = channel;
    return channel;
  }
  
  public removeChannel(channelName: string): void {
    if (this.channels[channelName]) {
      supabase.removeChannel(this.channels[channelName]);
      delete this.channels[channelName];
    }
  }
  
  public removeAllChannels(): void {
    Object.keys(this.channels).forEach(channelName => {
      this.removeChannel(channelName);
    });
    
    this.subscribed = false;
  }
  
  // Handle online event
  private handleOnline(): void {
    this._syncStatus = 'synced';
    
    // Notify user
    toast({
      title: "Connexion rétablie",
      description: "Synchronisation des données en cours...",
    });
  }
  
  // Handle offline event
  private handleOffline(): void {
    this._syncStatus = 'offline';
    
    // Notify user
    toast({
      title: "Mode hors ligne",
      description: "Certaines fonctionnalités peuvent être limitées",
      variant: "destructive",
    });
    
    // Remove all channels when offline
    this.removeAllChannels();
  }
  
  // Get current sync status
  get syncStatus(): SyncStatus {
    return this._syncStatus;
  }
  
  // Set sync status (useful for testing or manual control)
  set syncStatus(status: SyncStatus) {
    this._syncStatus = status;
  }
  
  // Check if we're subscribed to any channels
  get isSubscribed(): boolean {
    return this.subscribed;
  }
  
  // Set subscription status
  set isSubscribed(status: boolean) {
    this.subscribed = status;
  }
}
