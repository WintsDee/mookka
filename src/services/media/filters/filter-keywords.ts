
/**
 * Centralized collection of content filter keywords for different categories
 */
export const contentKeywords = {
  // Adult content keywords
  adult: [
    'xxx', 'porn', 'porno', 'pornographique', 'bdsm', 'kamasutra', 'explicit',
    'sexe', 'érotique', 'adult', 'adulte', 'nympho', 'nymphomane', 'nude', 'nu',
    'sensual', 'sensuel', 'mature', 'x-rated', 'classé x', 'uncensored', 'non censuré',
    'journal d\'une nymphomane', 'journal d une nymphomane', 'journal nymphomane',
    'emmanuelle', 'playboy', 'sexy', 'sex', 'érotisme', 'erotisme', 'lingerie'
  ],
  
  // Violence keywords
  violence: [
    'gore', 'extremely violent', 'ultra-violence', 'ultra violence', 'torture',
    'extrêmement violent', 'sanglant', 'graphique', 'massacre', 'ultraviolent',
    'sadistic', 'sadique', 'mutilation', 'carnage'
  ],
  
  // Horror keywords
  horror: [
    'extreme horror', 'horreur extrême', 'terrifying', 'horrific', 'horrifiant',
    'terreur extrême', 'épouvante', 'traumatising', 'traumatisant'
  ],
  
  // Drug use keywords
  drugs: [
    'drug abuse', 'abus de drogues', 'heroin', 'héroïne', 'crystal meth', 'méthamphétamine',
    'cocaine', 'cocaïne', 'substance abuse', 'toxicomanie'
  ],
  
  // Profanity keywords
  profanity: [
    'extreme language', 'langage extrême', 'vulgar', 'vulgaire', 'profane', 'profanity'
  ],
  
  // Disturbing content keywords
  disturbing: [
    'extremely disturbing', 'extrêmement dérangeant', 'psychological horror',
    'horreur psychologique', 'traumatic', 'traumatisant', 'deeply unsettling',
    'profondément troublant'
  ],
  
  // Self-harm keywords
  selfHarm: [
    'suicide', 'self-harm', 'automutilation', 'self harm', 'suicidal'
  ]
};

/**
 * Function to extract text from a variety of media object formats
 */
export function extractTextContent(media: any): string {
  const textFields = [
    media.title || '',
    media.description || '',
    media.overview || '',
    media.summary || '',
    Array.isArray(media.genres) ? media.genres.join(' ') : (media.genres || ''),
    media.author || '',
    media.director || '',
    media.creator || ''
  ];
  
  return textFields.join(' ').toLowerCase();
}
