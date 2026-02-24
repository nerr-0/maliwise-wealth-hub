import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { portfolioData, transactions } = await req.json();

    if (!portfolioData || !Array.isArray(portfolioData) || portfolioData.length === 0) {
      throw new Error('Valid portfolio data array is required');
    }
    if (!transactions || !Array.isArray(transactions)) {
      throw new Error('Valid transactions array is required');
    }
    if (portfolioData.length > 100 || transactions.length > 100) {
      throw new Error('Too many items. Maximum 100 holdings and 100 transactions.');
    }

    // Prepare AI prompt with portfolio data
    const prompt = `
      As a Kenyan financial advisor, analyze this investment portfolio and provide insights:
      
      Portfolio Holdings:
      ${JSON.stringify(portfolioData, null, 2)}
      
      Recent Transactions:
      ${JSON.stringify(transactions.slice(0, 10), null, 2)}
      
      Please provide:
      1. Portfolio performance summary
      2. Asset allocation recommendations for Kenyan market
      3. Risk assessment
      4. Specific recommendations for NSE stocks, REITs, Treasury Bills, MMFs
      5. Chama and SACCO investment suggestions
      
      Keep it concise, practical, and relevant to Kenyan investors.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a knowledgeable Kenyan financial advisor specializing in local investment opportunities including NSE stocks, REITs, Treasury Bills, MMFs, Chamas, and SACCOs.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const insights = data.choices[0].message.content;

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-investment-insights function:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate insights' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
