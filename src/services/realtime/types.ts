
// Type definitions for the realtime sync service
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Types of tables to monitor
export type TableName = 'user_media' | 'collections' | 'profiles' | 'media_progressions';

// Database event types
export type DatabaseEvent = 'INSERT' | 'UPDATE' | 'DELETE';

// Type for the sync status
export type SyncStatus = 'synced' | 'local' | 'offline';

// Types for storing callbacks
export type EventCallbacks = {
  [key in `${TableName}:${DatabaseEvent}`]?: ((payload: RealtimePostgresChangesPayload<any>) => void)[];
};

// Export the RealtimeChannel type from Supabase for use in our services
export type { RealtimeChannel, RealtimePostgresChangesPayload };
