
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../cors.ts";

interface RequestBody {
  url: string;
}

const maxCharacters = 1000; // Maximum de caractères pour le texte extrait

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
        "User-Agent": "Mozilla/5.0 (compatible; MookkaBot/1.0; +https://mookka.app)"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status}`);
    }

    const htmlContent = await response.text();
    
    // Extraction basique du contenu textuel
    // Nous allons simplifier et extraire uniquement le texte des balises p
    const paragraphs = extractParagraphs(htmlContent);
    
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

// Fonction pour extraire les paragraphes de contenu
function extractParagraphs(html: string): string[] {
  // Extraction simple des balises <p>
  const paragraphRegex = /<p[^>]*>(.*?)<\/p>/gs;
  const matches = [...html.matchAll(paragraphRegex)]
    .map(match => {
      // Supprimer les balises HTML internes
      const text = match[1].replace(/<[^>]*>/g, '');
      // Décoder les entités HTML
      return decodeHTMLEntities(text);
    })
    .filter(text => {
      // Filtrer les paragraphes vides ou trop courts
      return text.trim().length > 20;
    })
    .slice(0, 15); // Limiter à 15 paragraphes pour éviter les contenus trop longs
  
  if (matches.length === 0) {
    // Si on ne trouve pas de paragraphes, on essaie avec les divs
    const divRegex = /<div[^>]*>(.*?)<\/div>/gs;
    return [...html.matchAll(divRegex)]
      .map(match => decodeHTMLEntities(match[1].replace(/<[^>]*>/g, '')))
      .filter(text => text.trim().length > 20)
      .slice(0, 15);
  }
  
  return matches;
}

// Décodage des entités HTML
function decodeHTMLEntities(text: string): string {
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
    ['&hellip;', "..."]
  ];
  
  let result = text;
  entities.forEach(([entity, char]) => {
    result = result.replace(new RegExp(entity, 'g'), char);
  });
  
  return result;
}
