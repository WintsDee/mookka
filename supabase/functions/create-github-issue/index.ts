
// Suivez ces instructions après le déploiement:
// 1. Ajoutez votre token GitHub comme secret Supabase avec la commande:
//    supabase secrets set GITHUB_TOKEN=ghp_votre_token_personnel

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GITHUB_API = "https://api.github.com";
const REPO_OWNER = "votre-nom-utilisateur"; // À remplacer par votre username GitHub
const REPO_NAME = "votre-repo"; // À remplacer par le nom de votre repo

serve(async (req) => {
  try {
    // Vérification de la méthode
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Récupération du token GitHub depuis les variables d'environnement
    const githubToken = Deno.env.get("GITHUB_TOKEN");
    if (!githubToken) {
      console.error("GitHub token not found in environment variables");
      return new Response(
        JSON.stringify({ error: "GitHub token not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Récupération des données de la requête
    const data = await req.json();
    const { title, body, labels } = data;
    
    if (!title || !body) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Création de l'issue sur GitHub
    const response = await fetch(
      `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      {
        method: "POST",
        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": `Bearer ${githubToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
          labels,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("GitHub API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to create GitHub issue", details: errorData }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const responseData = await response.json();
    return new Response(
      JSON.stringify({ success: true, issue_url: responseData.html_url }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
