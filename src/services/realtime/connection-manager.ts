
import { supabase } from '@/integrations/supabase/client';
import { ConnectionState } from '@/types/realtime';
import { create } from 'zustand';

interface ConnectionStore {
  state: ConnectionState;
  lastConnected: number | null;
  reconnectAttempts: number;
  setState: (state: ConnectionState) => void;
  resetReconnectAttempts: () => void;
  incrementReconnectAttempts: () => void;
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
  state: ConnectionState.DISCONNECTED,
  lastConnected: null,
  reconnectAttempts: 0,
  setState: (state) => set({ 
    state,
    lastConnected: state === ConnectionState.CONNECTED ? Date.now() : null,
  }),
  resetReconnectAttempts: () => set({ reconnectAttempts: 0 }),
  incrementReconnectAttempts: () => set((state) => ({ 
    reconnectAttempts: state.reconnectAttempts + 1 
  })),
}));

class ConnectionManager {
  private static instance: ConnectionManager;
  private channel: any = null;
  
  private constructor() {}
  
  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }
  
  public initialize(): void {
    this.setupConnectionListeners();
  }
  
  public getChannel(): any {
    if (!this.channel) {
      this.channel = supabase.channel('sync-channel');
    }
    return this.channel;
  }
  
  private setupConnectionListeners(): void {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }
  
  private handleOnline = (): void => {
    useConnectionStore.getState().setState(ConnectionState.CONNECTING);
    this.tryReconnect();
  };
  
  private handleOffline = (): void => {
    useConnectionStore.getState().setState(ConnectionState.DISCONNECTED);
  };
  
  private handleVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') {
      const { state } = useConnectionStore.getState();
      if (state !== ConnectionState.CONNECTED) {
        useConnectionStore.getState().setState(ConnectionState.CONNECTING);
        this.tryReconnect();
      }
    }
  };
  
  private tryReconnect(): void {
    // Only try to reconnect if we have a channel
    if (this.channel) {
      this.channel.subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          useConnectionStore.getState().setState(ConnectionState.CONNECTED);
          useConnectionStore.getState().resetReconnectAttempts();
        } else {
          useConnectionStore.getState().incrementReconnectAttempts();
          useConnectionStore.getState().setState(ConnectionState.DISCONNECTED);
        }
      });
    }
  }
  
  public disconnect(): void {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    useConnectionStore.getState().setState(ConnectionState.DISCONNECTED);
  }
  
  public cleanup(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    this.disconnect();
  }
}

export default ConnectionManager;
