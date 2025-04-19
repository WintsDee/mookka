
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN');
    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN is not set');
    }

    // Parse the request body
    const { type, message, contact, title } = await req.json();
    
    // Basic validation
    if (!type || !message) {
      return new Response(
        JSON.stringify({ error: 'Type and message are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Map feedback type to GitHub label
    const labels = [type];
    let issueTitle = title || `[${type.toUpperCase()}] User feedback`;
    
    // Create GitHub issue content
    const body = `
## Feedback
${message}

${contact ? `## Contact Information\n${contact}` : ''}

*This issue was automatically generated from user feedback in Mookka.*
    `;

    console.log(`Creating GitHub issue with title: ${issueTitle}`);

    // Using a public repo as a temporary solution
    // You should replace this with your actual repository when you have proper access
    const owner = "github-feedback-demo"; // Replace with your GitHub username
    const repo = "feedback"; // Replace with your repository name
    
    // For testing purposes, we'll log what we're trying to do
    console.log(`Attempting to create issue in ${owner}/${repo}`);

    // Send request to GitHub API
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mookka-App'
      },
      body: JSON.stringify({
        title: issueTitle,
        body: body,
        labels: labels
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API error:', errorText);
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`Successfully created GitHub issue: ${data.html_url}`);
    
    return new Response(
      JSON.stringify({ success: true, issue_url: data.html_url }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error creating GitHub issue:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
