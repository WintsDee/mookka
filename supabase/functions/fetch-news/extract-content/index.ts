
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../cors.ts";
import { load } from "https://esm.sh/cheerio@1.0.0-rc.12";

interface RequestBody {
  url: string;
}

serve(async (req) => {
  // Gestion du CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json() as RequestBody;

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Extracting content from: ${url}`);
    
    // Extraction du contenu de l'article via Fetch API
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MookkaBot/1.0; +https://mookka.app)",
        "Accept": "text/html,application/xhtml+xml,application/xml",
        "Accept-Language": "fr,fr-FR;q=0.9,en-US;q=0.8,en;q=0.7"
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch article (${response.status}): ${url}`);
      throw new Error(`Failed to fetch article: ${response.status}`);
    }

    const htmlContent = await response.text();
    
    // Utiliser Cheerio pour extraire plus efficacement le contenu
    const $ = load(htmlContent);
    
    // Recherche des conteneurs d'articles les plus courants
    const articleSelectors = [
      'article', '.article', '.article-content', '.post', '.post-content', '.post-body',
      '.content', '.entry-content', '.main-content', '.story', '.story-body',
      '#article-body', '.article__body', '.news-content', '.article__text',
      '[itemprop="articleBody"]', '[property="content:encoded"]'
    ];
    
    let paragraphs: string[] = [];
    
    // Chercher les paragraphes dans les conteneurs d'articles principaux d'abord
    for (const selector of articleSelectors) {
      if (paragraphs.length === 0) {
        const articleElement = $(selector).first();
        if (articleElement.length > 0) {
          paragraphs = extractParagraphsFromElement($, articleElement);
          console.log(`Found content using selector "${selector}": ${paragraphs.length} paragraphs`);
        }
      }
    }
    
    // Si aucun contenu n'a été trouvé avec les sélecteurs spécifiques, essayer une approche plus générique
    if (paragraphs.length === 0) {
      // Essayer de trouver des sections qui contiennent plusieurs paragraphes
      $('div, section').each((i, element) => {
        if (paragraphs.length === 0) {
          const $element = $(element);
          const paragraphElements = $element.find('p');
          
          if (paragraphElements.length >= 3) {
            // Si une section contient au moins 3 paragraphes, c'est probablement le contenu principal
            paragraphs = extractParagraphsFromElement($, $element);
            console.log(`Found content using generic section search: ${paragraphs.length} paragraphs`);
          }
        }
      });
    }
    
    // Si toujours rien, essayer de chercher tous les paragraphes de la page
    if (paragraphs.length === 0) {
      $('p').each((i, el) => {
        const text = $(el).text().trim();
        // Prendre uniquement les paragraphes qui ont une longueur significative
        if (text.length > 60) {
          paragraphs.push(decodeHTMLEntities(text));
        }
      });
      console.log(`Found content using all paragraphs: ${paragraphs.length} paragraphs`);
    }
    
    // Filtrer le contenu non pertinent
    paragraphs = paragraphs
      .filter(text => {
        // Éliminer les paragraphes trop courts ou qui sont probablement des boutons/menus
        const cleanText = text.trim();
        if (cleanText.length < 40) return false;
        
        // Éliminer les paragraphes qui contiennent des mots-clés de navigation ou de publicité
        const lowerText = cleanText.toLowerCase();
        const unwantedTerms = ['accepter', 'cookies', 'newsletter', 'inscription', 'cliquez', 
                             'rejoignez', 'privacy', 'confidentialité', 'publicité', 'copyright',
                             'fermer', 'close', 'acceptez', 'partager sur'];
        return !unwantedTerms.some(term => lowerText.includes(term));
      })
      .slice(0, 30); // Limiter à 30 paragraphes pour les contenus très longs
    
    // Si on ne trouve toujours rien, essayer une approche plus primitive avec regex
    if (paragraphs.length === 0) {
      console.log("No suitable paragraphs found with DOM parsing, trying regex approach");
      paragraphs = extractBasicParagraphs(htmlContent);
    }
    
    console.log(`Final extracted paragraphs: ${paragraphs.length}`);
    
    return new Response(
      JSON.stringify({ 
        content: paragraphs,
        url: url 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error extracting article content:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Fonction pour extraire les paragraphes d'un élément spécifique
function extractParagraphsFromElement($: any, element: any): string[] {
  const paragraphs: string[] = [];
  
  // Chercher tous les paragraphes à l'intérieur de l'élément
  element.find('p, h1, h2, h3, h4, h5, h6, li').each((i: number, el: any) => {
    const text = $(el).text().trim();
    
    // Détecter si ce n'est pas un élément de navigation ou une publicité
    const isMenuElement = $(el).parents('nav, header, footer, aside, .menu, .navigation, .sidebar').length > 0;
    
    if (text && text.length > 20 && !isMenuElement) {
      paragraphs.push(decodeHTMLEntities(text));
    }
  });
  
  return paragraphs;
}

// Extraction basique des paragraphes via regex (méthode de secours)
function extractBasicParagraphs(html: string): string[] {
  // Recherche des balises p contenant du texte substantiel
  const paragraphRegex = /<p[^>]*>(.*?)<\/p>/gs;
  const matches = [...html.matchAll(paragraphRegex)]
    .map(match => {
      // Supprimer les balises HTML internes
      const text = match[1].replace(/<[^>]*>/g, '');
      // Décoder les entités HTML
      return decodeHTMLEntities(text);
    })
    .filter(text => {
      // Filtrer les paragraphes vides, trop courts ou qui sont probablement de la navigation
      text = text.trim();
      if (text.length < 60) return false;
      
      const lowerText = text.toLowerCase();
      const unwantedTerms = ['accepter', 'cookies', 'newsletter', 'cliquez', 'rejoignez', 
                           'privacy', 'confidentialité', 'publicité', 'copyright', 'fermer'];
      return !unwantedTerms.some(term => lowerText.includes(term));
    })
    .slice(0, 20); // Limiter à 20 paragraphes
  
  return matches;
}

// Décodage des entités HTML
function decodeHTMLEntities(text: string): string {
  if (!text) return '';
  
  const entities = [
    ['&amp;', '&'],
    ['&lt;', '<'],
    ['&gt;', '>'],
    ['&quot;', '"'],
    ['&apos;', "'"],
    ['&#039;', "'"],
    ['&#8217;', "'"],
    ['&#8216;', "'"],
    ['&#8211;', "–"],
    ['&#8212;', "—"],
    ['&hellip;', "..."],
    ['&nbsp;', " "],
    ['&copy;', "©"],
    ['&reg;', "®"],
    ['&trade;', "™"]
  ];
  
  let result = text;
  entities.forEach(([entity, char]) => {
    result = result.replace(new RegExp(entity, 'g'), char);
  });
  
  // Également remplacer les entités numériques
  result = result.replace(/&#(\d+);/g, (match, dec) => {
    try {
      return String.fromCharCode(parseInt(dec, 10));
    } catch (e) {
      return match;
    }
  });
  
  return result;
}
