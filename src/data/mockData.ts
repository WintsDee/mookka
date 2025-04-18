
import { Media, User } from '@/types';

// Mock media data for the library page
export const mockMedia: Media[] = [
  {
    id: '1',
    title: 'Stranger Things',
    type: 'serie',
    status: 'watching',
    poster: 'https://via.placeholder.com/300x450?text=Stranger+Things',
    backdrop: 'https://via.placeholder.com/1280x720?text=Stranger+Things',
    overview: 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.',
    genres: ['Science Fiction', 'Drama', 'Mystery'],
    releaseDate: '2016-07-15',
    platforms: ['Netflix'],
    rating: 4.5
  },
  {
    id: '2',
    title: 'Inception',
    type: 'film',
    status: 'completed',
    poster: 'https://via.placeholder.com/300x450?text=Inception',
    backdrop: 'https://via.placeholder.com/1280x720?text=Inception',
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    genres: ['Science Fiction', 'Action', 'Thriller'],
    releaseDate: '2010-07-16',
    platforms: ['Netflix', 'Amazon Prime'],
    rating: 4.8
  },
  {
    id: '3',
    title: 'The Last of Us',
    type: 'game',
    status: 'to-watch',
    poster: 'https://via.placeholder.com/300x450?text=The+Last+of+Us',
    backdrop: 'https://via.placeholder.com/1280x720?text=The+Last+of+Us',
    overview: 'In a hostile, post-pandemic world, Joel and Ellie, brought together by desperate circumstances, must rely on each other to survive a brutal journey across what remains of the United States.',
    genres: ['Action', 'Adventure', 'Horror'],
    releaseDate: '2013-06-14',
    platforms: ['PlayStation'],
    rating: 4.9
  },
  {
    id: '4',
    title: 'Harry Potter and the Philosopher\'s Stone',
    type: 'book',
    status: 'completed',
    poster: 'https://via.placeholder.com/300x450?text=Harry+Potter',
    backdrop: 'https://via.placeholder.com/1280x720?text=Harry+Potter',
    overview: 'Harry Potter has no idea how famous he is. That\'s because he\'s being raised by his miserable aunt and uncle who are terrified Harry will learn that he\'s really a wizard.',
    genres: ['Fantasy', 'Young Adult'],
    releaseDate: '1997-06-26',
    platforms: ['Kindle', 'Physical'],
    rating: 4.7
  },
  {
    id: '5',
    title: 'Breaking Bad',
    type: 'serie',
    status: 'to-watch',
    poster: 'https://via.placeholder.com/300x450?text=Breaking+Bad',
    backdrop: 'https://via.placeholder.com/1280x720?text=Breaking+Bad',
    overview: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
    genres: ['Drama', 'Crime', 'Thriller'],
    releaseDate: '2008-01-20',
    platforms: ['Netflix', 'AMC'],
    rating: 4.9
  },
  {
    id: '6',
    title: 'The Witcher 3: Wild Hunt',
    type: 'game',
    status: 'watching',
    poster: 'https://via.placeholder.com/300x450?text=Witcher+3',
    backdrop: 'https://via.placeholder.com/1280x720?text=Witcher+3',
    overview: 'The Witcher 3: Wild Hunt is a 2015 action role-playing game developed and published by Polish developer CD Projekt Red.',
    genres: ['RPG', 'Fantasy', 'Action'],
    releaseDate: '2015-05-19',
    platforms: ['PC', 'PlayStation', 'Xbox'],
    rating: 4.8
  }
];

// Types are kept for reference but mock data is removed
export type { Media, User };
