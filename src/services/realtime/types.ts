
// Type definitions for the realtime sync service

// Types of tables to monitor
export type TableName = 'user_media' | 'collections' | 'profiles' | 'media_progressions';

// Database event types
export type DatabaseEvent = 'INSERT' | 'UPDATE' | 'DELETE';

// Type for the sync status
export type SyncStatus = 'synced' | 'local' | 'offline';

// Types for storing callbacks
export type EventCallbacks = {
  [key in `${TableName}:${DatabaseEvent}`]?: ((payload: any) => void)[];
};

// Realtime channel interface
export interface RealtimeChannel {
  subscribe: (callback?: (status: string) => void) => RealtimeChannel;
  on: (
    eventType: string,
    eventFilter: any,
    callback: (payload: any) => void
  ) => RealtimeChannel;
}
