
import { Media, User, MediaStatus, MediaType } from '@/types';

// Mock media data for the library page
export const mockMedia: Media[] = [
  {
    id: '1',
    title: 'Stranger Things',
    type: 'serie' as MediaType,
    status: 'watching' as MediaStatus,
    coverImage: 'https://via.placeholder.com/300x450?text=Stranger+Things',
    description: 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.',
    genres: ['Science Fiction', 'Drama', 'Mystery'],
    year: 2016,
    rating: 4.5
  },
  {
    id: '2',
    title: 'Inception',
    type: 'film' as MediaType,
    status: 'completed' as MediaStatus,
    coverImage: 'https://via.placeholder.com/300x450?text=Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    genres: ['Science Fiction', 'Action', 'Thriller'],
    year: 2010,
    director: 'Christopher Nolan',
    duration: '148 min',
    rating: 4.8
  },
  {
    id: '3',
    title: 'The Last of Us',
    type: 'game' as MediaType,
    status: 'to-play' as MediaStatus,
    coverImage: 'https://via.placeholder.com/300x450?text=The+Last+of+Us',
    description: 'In a hostile, post-pandemic world, Joel and Ellie, brought together by desperate circumstances, must rely on each other to survive a brutal journey across what remains of the United States.',
    genres: ['Action', 'Adventure', 'Horror'],
    year: 2013,
    publisher: 'Naughty Dog',
    platform: 'PlayStation',
    rating: 4.9
  },
  {
    id: '4',
    title: 'Harry Potter and the Philosopher\'s Stone',
    type: 'book' as MediaType,
    status: 'completed' as MediaStatus,
    coverImage: 'https://via.placeholder.com/300x450?text=Harry+Potter',
    description: 'Harry Potter has no idea how famous he is. That\'s because he\'s being raised by his miserable aunt and uncle who are terrified Harry will learn that he\'s really a wizard.',
    genres: ['Fantasy', 'Young Adult'],
    year: 1997,
    author: 'J.K. Rowling',
    rating: 4.7
  },
  {
    id: '5',
    title: 'Breaking Bad',
    type: 'serie' as MediaType,
    status: 'to-watch' as MediaStatus,
    coverImage: 'https://via.placeholder.com/300x450?text=Breaking+Bad',
    description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
    genres: ['Drama', 'Crime', 'Thriller'],
    year: 2008,
    duration: '45-50 min per episode',
    rating: 4.9
  },
  {
    id: '6',
    title: 'The Witcher 3: Wild Hunt',
    type: 'game' as MediaType,
    status: 'playing' as MediaStatus,
    coverImage: 'https://via.placeholder.com/300x450?text=Witcher+3',
    description: 'The Witcher 3: Wild Hunt is a 2015 action role-playing game developed and published by Polish developer CD Projekt Red.',
    genres: ['RPG', 'Fantasy', 'Action'],
    year: 2015,
    publisher: 'CD Projekt Red',
    platform: 'PC, PlayStation, Xbox',
    rating: 4.8
  }
];

// Types are kept for reference but mock data is removed
export type { Media, User };
