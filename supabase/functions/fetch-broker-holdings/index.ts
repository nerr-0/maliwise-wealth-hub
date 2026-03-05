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

    const userId = claimsData.claims.sub as string;
    const { platform_id, platform_name } = await req.json();

    if (!platform_id || !platform_name) {
      return new Response(
        JSON.stringify({ error: "platform_id and platform_name are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if broker is supported for live sync
    const supportedBrokers = ["Alpaca"];
    if (!supportedBrokers.includes(platform_name)) {
      return new Response(
        JSON.stringify({ status: "coming_soon", message: `${platform_name} integration is coming soon` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get platform credentials
    const { data: platform, error: platformError } = await supabase
      .from("connected_platforms")
      .select("api_key")
      .eq("id", platform_id)
      .eq("user_id", userId)
      .single();

    if (platformError || !platform?.api_key) {
      return new Response(
        JSON.stringify({ error: "Platform not found or no API key configured" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const [apiKey, apiSecret] = platform.api_key.split(":");

    // Fetch positions from Alpaca
    const alpacaRes = await fetch("https://paper-api.alpaca.markets/v2/positions", {
      headers: {
        "APCA-API-KEY-ID": apiKey,
        "APCA-API-SECRET-KEY": apiSecret,
      },
    });

    if (!alpacaRes.ok) {
      const errText = await alpacaRes.text();
      console.error("Alpaca API error:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to fetch positions from Alpaca" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const positions = await alpacaRes.json();
    const holdings: any[] = [];

    // Use service role client for upserting holdings
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    for (const pos of positions) {
      const holdingData = {
        user_id: userId,
        asset_name: pos.symbol,
        asset_type: "International Equities",
        quantity: parseFloat(pos.qty),
        average_cost: parseFloat(pos.avg_entry_price),
        current_value: parseFloat(pos.market_value),
        platform_id,
        currency: "USD",
        source: "alpaca",
        last_updated: new Date().toISOString(),
      };

      // Upsert by user + asset_name + asset_type
      const { error: upsertError } = await serviceClient
        .from("portfolio_holdings")
        .upsert(holdingData, {
          onConflict: "user_id,asset_name,asset_type" as any,
        });

      if (upsertError) {
        console.error("Upsert error for", pos.symbol, upsertError);
      } else {
        holdings.push(holdingData);
      }
    }

    // Update last_sync on the platform
    await serviceClient
      .from("connected_platforms")
      .update({ last_sync: new Date().toISOString(), connection_status: "connected" })
      .eq("id", platform_id);

    return new Response(
      JSON.stringify({ holdings, count: holdings.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
