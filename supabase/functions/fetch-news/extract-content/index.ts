
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
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

    // Extraction du contenu de l'article via Fetch API
    console.log(`Extracting content from: ${url}`);
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status}`);
    }

    const htmlContent = await response.text();
    
    // Utiliser Cheerio pour extraire plus efficacement le contenu
    const $ = load(htmlContent);
    
    // Recherche des conteneurs d'articles les plus courants
    const articleSelectors = [
      'article', '.article', '.post', '.content', '.entry-content', 
      '.post-content', '.article-content', '.main-content', 
      '#article-body', '.article__body', '.story-body', '.news-content'
    ];
    
    let paragraphs: string[] = [];
    
    // Chercher les paragraphes dans les conteneurs d'articles principaux d'abord
    for (const selector of articleSelectors) {
      if (paragraphs.length === 0) {
        const articleElement = $(selector).first();
        if (articleElement.length > 0) {
          paragraphs = extractParagraphsFromElement($, articleElement);
        }
      }
    }
    
    // Si aucun contenu n'a été trouvé, essayer de trouver tous les paragraphes de la page
    if (paragraphs.length === 0) {
      paragraphs = extractParagraphsFromElement($, $('body'));
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
                              'rejoignez', 'privacy', 'confidentialité', 'publicité', 'copyright'];
        return !unwantedTerms.some(term => lowerText.includes(term));
      })
      .slice(0, 30); // Limiter à 30 paragraphes pour les contenus très longs
    
    if (paragraphs.length === 0) {
      console.log("No suitable paragraphs found");
      // Essayer avec une approche plus simple
      paragraphs = extractBasicParagraphs(htmlContent);
    }
    
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
      if (text.length < 40) return false;
      
      const lowerText = text.toLowerCase();
      return !['accepter', 'cookies', 'newsletter', 'cliquez'].some(term => lowerText.includes(term));
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
