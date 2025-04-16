
import { supabase } from "@/integrations/supabase/client";
import { ConnectionManager } from "./connection-manager";
import { TableName, DatabaseEvent, EventCallbacks, RealtimePostgresChangesPayload } from "./types";

export class RealtimeSyncService {
  private connectionManager: ConnectionManager;
  private callbacks: EventCallbacks = {};
  private userLoggedIn = false;
  
  constructor() {
    this.connectionManager = new ConnectionManager();
    this.setupAuthListener();
  }
  
  // Set up auth state listener
  private setupAuthListener(): void {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        this.userLoggedIn = true;
        this.setupRealtimeChannels();
      } else if (event === 'SIGNED_OUT') {
        this.userLoggedIn = false;
        this.unsubscribeAll();
      }
    });
    
    // Check current auth state
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        this.userLoggedIn = true;
        this.setupRealtimeChannels();
      }
    });
  }
  
  // Set up realtime channels to listen for database changes
  private setupRealtimeChannels(): void {
    if (!this.userLoggedIn || 
        this.connectionManager.isSubscribed || 
        this.connectionManager.syncStatus === 'offline') {
      return;
    }
    
    const mainChannel = this.connectionManager.createChannel('db-changes');
    
    // Set up listeners for all watched tables and events
    ['user_media', 'collections', 'profiles', 'media_progressions'].forEach((table: TableName) => {
      ['INSERT', 'UPDATE', 'DELETE'].forEach((event: DatabaseEvent) => {
        // Use the channel.on method with the system event type
        mainChannel.on(
          'postgres_changes' as any, // Cast to any to work around type issue
          {
            event: event,
            schema: 'public',
            table: table
          },
          (payload) => this.handleDatabaseChange(table, event as DatabaseEvent, payload)
        );
      });
    });
    
    // Subscribe to the channel
    mainChannel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        this.connectionManager.isSubscribed = true;
        this.connectionManager.syncStatus = 'synced';
        console.log('Subscribed to realtime changes');
      }
    });
  }
  
  // Handle database change events
  private handleDatabaseChange(
    table: TableName, 
    event: DatabaseEvent, 
    payload: RealtimePostgresChangesPayload<any>
  ): void {
    console.log(`Change detected in ${table}:`, event, payload);
    
    // Call registered callbacks
    const key = `${table}:${event}` as const;
    const handlers = this.callbacks[key] || [];
    
    handlers.forEach(callback => callback(payload));
  }
  
  // Subscribe to database events
  public subscribe(
    table: TableName, 
    event: DatabaseEvent, 
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ): () => void {
    const key = `${table}:${event}` as const;
    
    if (!this.callbacks[key]) {
      this.callbacks[key] = [];
    }
    
    this.callbacks[key]!.push(callback);
    
    // Set up channels if user is logged in but not subscribed yet
    if (this.userLoggedIn && 
        !this.connectionManager.isSubscribed && 
        this.connectionManager.syncStatus !== 'offline') {
      this.setupRealtimeChannels();
    }
    
    // Return unsubscribe function
    return () => {
      if (this.callbacks[key]) {
        this.callbacks[key] = this.callbacks[key]!.filter(cb => cb !== callback);
      }
    };
  }
  
  // Unsubscribe from all channels
  public unsubscribeAll(): void {
    this.connectionManager.removeAllChannels();
    this.callbacks = {};
  }
  
  // Get current sync status
  get syncStatus(): 'synced' | 'local' | 'offline' {
    return this.connectionManager.syncStatus;
  }
  
  // Set sync status (useful for testing)
  set syncStatus(status: 'synced' | 'local' | 'offline') {
    this.connectionManager.syncStatus = status;
  }
}

// Export a singleton instance
export const realtimeSync = new RealtimeSyncService();
