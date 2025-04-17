
// Re-export all profile hooks but specify each one explicitly
import { useProfileData, DEFAULT_AVATAR, DEFAULT_COVER } from './use-profile-data';
import { useProfileUpdate } from './use-profile-update';
import { useProfileSocial } from './use-profile-social';

export { useProfileData, useProfileUpdate, useProfileSocial, DEFAULT_AVATAR, DEFAULT_COVER };

// Export type
export type { Profile } from '@/types/profile';
