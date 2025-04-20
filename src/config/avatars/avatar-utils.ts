
import { filmAvatars, gamingAvatars, bookAvatars, tvSeriesAvatars } from './media-themed-avatars';
import { artCultureAvatars, animationAvatars } from './culture-avatars';
import { natureAvatars } from './nature-avatars';
import { animalAvatars } from './animal-avatars';
import { techAvatars } from './tech-avatars';
import { abstractAvatars } from './abstract-avatars';

// Combine all avatar collections
export const DEFAULT_AVATARS = [
  ...filmAvatars,
  ...gamingAvatars,
  ...bookAvatars,
  ...tvSeriesAvatars,
  ...artCultureAvatars,
  ...animationAvatars,
  ...natureAvatars,
  ...animalAvatars,
  ...techAvatars,
  ...abstractAvatars,
];

// Helper function to get a random avatar
export const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * DEFAULT_AVATARS.length);
  return DEFAULT_AVATARS[randomIndex];
};

// Default avatar and cover image
export const DEFAULT_AVATAR = DEFAULT_AVATARS[0];
export const DEFAULT_COVER = "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1200&auto=format&fit=crop";
