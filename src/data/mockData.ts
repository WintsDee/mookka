
import { User } from '@/types';

// Mock des données utilisateur
export const currentUser: User = {
  id: '1',
  name: 'Thomas',
  avatar: '/placeholder.svg',
  bio: 'Passionné de cinéma et de jeux vidéo',
  following: 42,
  followers: 128
};

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
