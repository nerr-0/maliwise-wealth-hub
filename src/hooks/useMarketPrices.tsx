import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PortfolioHolding } from "./usePortfolio";

export interface MarketPrices {
  [symbol: string]: {
    price: number;
    changePercent: number;
  };
}

export const useMarketPrices = (holdings: PortfolioHolding[]) => {
  const symbols = holdings
    .filter((h) => h.asset_type === "Stock" || h.asset_type === "ETF")
    .map((h) => h.asset_name);

  const query = useQuery({
    queryKey: ["market-prices", symbols.join(",")],
    queryFn: async (): Promise<MarketPrices> => {
      if (symbols.length === 0) return {};

      const { data, error } = await supabase.functions.invoke("fetch-market-prices", {
        body: { symbols },
      });

      if (error) throw error;
      return (data?.prices as MarketPrices) ?? {};
    },
    enabled: symbols.length > 0,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 4 * 60 * 1000,
  });

  const lastUpdated = query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null;

  return { prices: query.data ?? {}, isLoading: query.isLoading, lastUpdated };
};
