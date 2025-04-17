
import { Media, User } from '@/types';

// Mock des données utilisateur
export const currentUser: User = {
  id: '1',
  name: 'Thomas',
  avatar: '/placeholder.svg',
  bio: 'Passionné de cinéma et de jeux vidéo',
  following: 42,
  followers: 128
};

// Mock des données médias
export const mockMedia: Media[] = [
  {
    id: '1',
    title: 'Inception',
    type: 'film',
    coverImage: 'https://source.unsplash.com/random/300x450?movie',
    year: 2010,
    rating: 4.8,
    status: 'completed',
    genres: ['Science-Fiction', 'Action', 'Thriller'],
    description: 'Un voleur qui s\'infiltre dans les rêves des autres pour y voler leurs secrets les plus profonds.',
    duration: '2h28',
    director: 'Christopher Nolan'
  },
  {
    id: '2',
    title: 'The Witcher',
    type: 'serie',
    coverImage: 'https://source.unsplash.com/random/300x450?fantasy',
    year: 2019,
    rating: 4.5,
    status: 'watching',
    genres: ['Fantastique', 'Action', 'Drame'],
    description: 'Un chasseur de monstres solitaire lutte pour trouver sa place dans un monde où les humains se révèlent souvent plus vicieux que les bêtes.',
    duration: '3 saisons'
  },
  {
    id: '3',
    title: 'Dune',
    type: 'book',
    coverImage: 'https://source.unsplash.com/random/300x450?book',
    year: 1965,
    rating: 4.9,
    status: 'completed',
    genres: ['Science-Fiction', 'Fantasy'],
    description: 'L\'histoire de la lutte entre deux familles nobles pour le contrôle d\'Arrakis, la seule planète où l\'on trouve l\'épice, substance qui prolonge la vie humaine.',
    author: 'Frank Herbert'
  },
  {
    id: '4',
    title: 'The Legend of Zelda: Breath of the Wild',
    type: 'game',
    coverImage: 'https://source.unsplash.com/random/300x450?game',
    year: 2017,
    rating: 4.9,
    status: 'completed',
    genres: ['Action', 'Aventure', 'RPG'],
    description: 'Un jeu d\'aventure en monde ouvert où vous incarnez Link qui se réveille d\'un sommeil de 100 ans pour découvrir un royaume d\'Hyrule dévasté.',
    platform: 'Nintendo Switch',
    publisher: 'Nintendo'
  },
  {
    id: '5',
    title: 'Parasite',
    type: 'film',
    coverImage: 'https://source.unsplash.com/random/300x450?parasite',
    year: 2019,
    rating: 4.6,
    status: 'to-watch',
    genres: ['Drame', 'Thriller', 'Comédie noire'],
    description: 'Toute la famille de Ki-taek est au chômage, et s\'intéresse fortement au train de vie de la richissime famille Park.',
    duration: '2h12',
    director: 'Bong Joon-ho'
  },
  {
    id: '6',
    title: 'Breaking Bad',
    type: 'serie',
    coverImage: 'https://source.unsplash.com/random/300x450?desert',
    year: 2008,
    rating: 4.9,
    status: 'completed',
    genres: ['Drame', 'Crime', 'Thriller'],
    description: 'Un professeur de chimie atteint d\'un cancer du poumon inopérable se tourne vers la fabrication et la vente de méthamphétamine.',
    duration: '5 saisons'
  }
];

// Mock des actualités
export const mockNews = [
  {
    id: '1',
    title: 'The Batman 2: ce que l\'on sait sur la suite avec Robert Pattinson',
    source: 'CinéSéries',
    date: '2023-04-15',
    image: 'https://source.unsplash.com/random/600x300?batman'
  },
  {
    id: '2',
    title: 'Starfield: un nouveau DLC annoncé pour cet été',
    source: 'JeuxActu',
    date: '2023-04-12',
    image: 'https://source.unsplash.com/random/600x300?space'
  },
  {
    id: '3',
    title: 'Le nouveau roman de Stephen King sortira en septembre',
    source: 'Livres Hebdo',
    date: '2023-04-10',
    image: 'https://source.unsplash.com/random/600x300?book'
  }
];

// Mock des activités sociales
export const mockSocial = [
  {
    id: '1',
    user: {
      id: '2',
      name: 'Marie',
      avatar: 'https://source.unsplash.com/random/100x100?portrait'
    },
    action: 'a noté 5/5',
    media: {
      id: '1',
      title: 'Inception',
      type: 'film'
    },
    timestamp: '2023-04-15T14:35:00Z'
  },
  {
    id: '2',
    user: {
      id: '3',
      name: 'Lucas',
      avatar: 'https://source.unsplash.com/random/100x100?man'
    },
    action: 'a commencé',
    media: {
      id: '6',
      title: 'Breaking Bad',
      type: 'serie'
    },
    timestamp: '2023-04-14T18:22:00Z'
  },
  {
    id: '3',
    user: {
      id: '4',
      name: 'Sophie',
      avatar: 'https://source.unsplash.com/random/100x100?woman'
    },
    action: 'a ajouté à sa liste',
    media: {
      id: '3',
      title: 'Dune',
      type: 'book'
    },
    timestamp: '2023-04-13T09:15:00Z'
  }
];
