
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Configure pour les appels CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Traiter les requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Récupérer les variables d'environnement
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Variables d\'environnement manquantes')
    }

    // Créer un client Supabase avec les privilèges admin
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Activer Replica Identity pour les tables concernées
    const queries = [
      `ALTER TABLE public.user_media REPLICA IDENTITY FULL;`,
      `ALTER TABLE public.collections REPLICA IDENTITY FULL;`,
      `ALTER TABLE public.collection_items REPLICA IDENTITY FULL;`,
      `ALTER TABLE public.profiles REPLICA IDENTITY FULL;`,
      
      // Créer la publication pour Realtime s'il n'existe pas
      `CREATE PUBLICATION IF NOT EXISTS supabase_realtime FOR TABLE 
        public.user_media, 
        public.collections, 
        public.collection_items, 
        public.profiles;`
    ]

    // Exécuter les requêtes
    for (const query of queries) {
      const { error } = await supabase.rpc('exec_sql', { query })
      if (error) throw error
    }

    // Réponse de succès
    return new Response(
      JSON.stringify({ success: true, message: 'Realtime activé avec succès' }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        }
      },
    )
  } catch (error) {
    console.error('Erreur:', error)
    
    // Réponse d'erreur
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        }
      },
    )
  }
})
