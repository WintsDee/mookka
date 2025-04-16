
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface FeedbackData {
  type: "bug" | "idea" | "suggestion";
  message: string;
  contact?: string;
}

// Labels à associer selon le type de feedback
const feedbackLabels: Record<string, string[]> = {
  bug: ["bug", "feedback"],
  idea: ["enhancement", "idea", "feedback"],
  suggestion: ["suggestion", "feedback"],
};

// Correspond au titre qui sera affiché sur GitHub
const feedbackTitles: Record<string, string> = {
  bug: "Bug signalé",
  idea: "Nouvelle idée",
  suggestion: "Suggestion d'amélioration",
};

/**
 * Soumet un feedback qui sera transformé en issue GitHub
 */
export async function submitFeedback(data: FeedbackData): Promise<void> {
  try {
    // Récupération des informations utilisateur si disponibles
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id || "Anonymous";
    
    // Construction du contenu de l'issue
    const issueContent = {
      title: `[Feedback] ${feedbackTitles[data.type]} par un utilisateur`,
      body: `
## Message
${data.message}

## Informations
- **Type**: ${data.type}
- **Contact**: ${data.contact || "Non fourni"}
- **User ID**: ${userId}
- **Date**: ${new Date().toISOString()}
      `,
      labels: feedbackLabels[data.type]
    };
    
    // Envoi à une fonction Supabase Edge qui interagira avec l'API GitHub
    // Cette fonction devra être créée côté Supabase
    const { error } = await supabase.functions.invoke("create-github-issue", {
      body: issueContent
    });
    
    if (error) throw error;
    
    return;
  } catch (error) {
    console.error("Erreur lors de la création de l'issue GitHub:", error);
    throw new Error("Impossible de soumettre le feedback");
  }
}
