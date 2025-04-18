
export interface HelpItem {
  title: string;
  content: string;
  category: 'usage' | 'collections' | 'social' | 'account';
  icon?: string;
}

export const helpItems: HelpItem[] = [
  {
    category: 'usage',
    title: "Comment ajouter un média ?",
    content: "Utilisez la recherche pour trouver un média, puis cliquez sur l'icône + pour l'ajouter à votre bibliothèque."
  },
  {
    category: 'collections',
    title: "Créer une collection",
    content: "Allez dans l'onglet Collections et cliquez sur 'Nouvelle collection' pour créer une liste personnalisée."
  },
  {
    category: 'social',
    title: "Suivre des amis",
    content: "Recherchez des utilisateurs dans l'onglet Social et cliquez sur 'Suivre' pour voir leur activité."
  },
  {
    category: 'usage',
    title: "Comment noter un média ?",
    content: "Dans la page de détail d'un média, allez dans l'onglet 'Critique' pour ajouter votre note et vos commentaires."
  },
  {
    category: 'collections',
    title: "Partager une collection",
    content: "Dans les paramètres de votre collection, vous pouvez la rendre publique pour la partager avec d'autres utilisateurs."
  },
  {
    category: 'account',
    title: "Problème technique ?",
    content: "Utilisez le formulaire de feedback pour nous signaler tout problème rencontré."
  }
];

export const getHelpItemsByCategory = (category?: string) => {
  if (!category) return helpItems;
  return helpItems.filter(item => item.category === category);
};

export const getMostPopularHelpItems = (limit: number = 4) => {
  return helpItems.slice(0, limit);
};
