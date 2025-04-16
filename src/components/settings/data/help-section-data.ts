
export interface HelpItem {
  question: string;
  answer: string;
}

export interface HelpSection {
  title: string;
  items: HelpItem[];
}

export const helpSections: HelpSection[] = [
  {
    title: "Utilisation de l'application",
    items: [
      { 
        question: "Comment ajouter un média ?", 
        answer: "Utilisez la recherche pour trouver un média, puis cliquez sur l'icône + pour l'ajouter à votre bibliothèque." 
      },
      { 
        question: "Comment suivre ma progression ?", 
        answer: "Dans la page de détail d'un média, allez dans l'onglet 'Progression' pour mettre à jour votre avancement." 
      },
      { 
        question: "Comment noter un média ?", 
        answer: "Dans la page de détail d'un média, allez dans l'onglet 'Critique' pour ajouter votre note et vos commentaires." 
      }
    ]
  },
  {
    title: "Collections",
    items: [
      { 
        question: "Comment créer une collection ?", 
        answer: "Allez dans l'onglet Collections et cliquez sur 'Nouvelle collection' pour créer une liste personnalisée." 
      },
      { 
        question: "Comment ajouter un média à une collection ?", 
        answer: "Sur la page d'un média, cliquez sur le bouton 'Ajouter à une collection' et sélectionnez la collection désirée." 
      },
      { 
        question: "Puis-je partager mes collections ?", 
        answer: "Oui, vous pouvez rendre vos collections publiques en modifiant leurs paramètres de visibilité." 
      }
    ]
  },
  {
    title: "Social",
    items: [
      { 
        question: "Comment suivre d'autres utilisateurs ?", 
        answer: "Recherchez des utilisateurs dans l'onglet Social et cliquez sur 'Suivre' pour voir leur activité." 
      },
      { 
        question: "Comment voir l'activité de mes amis ?", 
        answer: "L'activité de vos amis apparaît dans votre fil d'actualités sur la page principale." 
      }
    ]
  },
  {
    title: "Compte et sécurité",
    items: [
      { 
        question: "Comment modifier mon profil ?", 
        answer: "Sur votre page de profil, cliquez sur le bouton 'Modifier le profil' pour changer vos informations." 
      },
      { 
        question: "Comment changer mon mot de passe ?", 
        answer: "Dans les paramètres, allez dans la section 'Confidentialité' et cliquez sur 'Changer le mot de passe'." 
      }
    ]
  }
];
