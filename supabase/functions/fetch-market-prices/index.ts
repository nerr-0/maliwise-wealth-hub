import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { symbols } = await req.json();
    if (!Array.isArray(symbols) || symbols.length === 0 || symbols.length > 10) {
      return new Response(JSON.stringify({ error: "symbols must be an array of 1-10 items" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate each symbol is a string with reasonable length
    const validSymbols = symbols.every(
      (s: unknown) => typeof s === "string" && s.length > 0 && s.length <= 20 && /^[A-Za-z0-9.\-]+$/.test(s)
    );
    if (!validSymbols) {
      return new Response(JSON.stringify({ error: "Invalid symbol format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("ALPHA_VANTAGE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prices: Record<string, { price: number; changePercent: number }> = {};

    // Fetch prices sequentially to respect Alpha Vantage rate limits (5 calls/min on free tier)
    for (const symbol of symbols.slice(0, 5)) {
      try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();

        const quote = data["Global Quote"];
        if (quote && quote["05. price"]) {
          prices[symbol] = {
            price: parseFloat(quote["05. price"]),
            changePercent: parseFloat((quote["10. change percent"] || "0").replace("%", "")),
          };
        }
      } catch {
        // Skip failed symbols
      }
    }

    return new Response(JSON.stringify({ prices }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("fetch-market-prices error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch market prices" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
