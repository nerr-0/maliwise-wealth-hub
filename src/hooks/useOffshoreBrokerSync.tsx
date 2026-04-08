import { useState } from "react";
import { supabase } from "@/integrations/supabase/client2";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const useOffshoreBrokerSync = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);

  const syncBroker = async (platformId: string, platformName: string) => {
    if (!user?.id) return;
    setSyncing(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("fetch-broker-holdings", {
        body: { platform_id: platformId, platform_name: platformName },
      });

      if (error) throw error;

      if (data?.status === "coming_soon") {
        toast.info(`${platformName} sync is coming soon`);
        return;
      }

      toast.success(`Synced ${data?.holdings?.length || 0} holdings from ${platformName}`);
      queryClient.invalidateQueries({ queryKey: ["portfolio-holdings"] });
    } catch (err: any) {
      toast.error(err.message || `Failed to sync ${platformName}`);
    } finally {
      setSyncing(false);
    }
  };

  return { syncBroker, syncing };
};
