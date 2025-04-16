
export interface FaqItem {
  question: string;
  answer: string;
}

export const FEEDBACK_TYPES = [
  { value: "bug", label: "Signaler un bug" },
  { value: "idea", label: "Partager une idée" },
  { value: "suggestion", label: "Faire une suggestion" },
];

export const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    question: "Comment ajouter un média à ma bibliothèque ?",
    answer: "Pour ajouter un média à votre bibliothèque, recherchez-le via la barre de recherche, puis cliquez sur sa fiche et utilisez le bouton \"Ajouter à ma bibliothèque\". Vous pouvez également le faire directement depuis les résultats de recherche."
  },
  {
    question: "Comment créer une collection personnalisée ?",
    answer: "Rendez-vous dans la section Collections depuis le menu principal, puis utilisez le bouton \"Créer une collection\". Donnez un nom à votre collection, choisissez sa visibilité et ajoutez-y des médias depuis votre bibliothèque."
  },
  {
    question: "Comment suivre ma progression sur un média ?",
    answer: "Depuis la fiche d'un média dans votre bibliothèque, accédez à l'onglet \"Progression\" pour mettre à jour votre avancement. Chaque type de média dispose d'options spécifiques (pages lues, épisodes visionnés, heures de jeu, etc.)."
  },
  {
    question: "Comment partager mon activité avec mes amis ?",
    answer: "Dans votre profil, accédez aux paramètres de partage social pour choisir quelles informations vous souhaitez partager (notations, critiques, collections, etc.). Vous pouvez ensuite suivre vos amis depuis l'onglet Social pour voir leur activité."
  }
];
