import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const SUPPORTED_BROKERS = ["Alpaca"];

interface ConnectBrokerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platformName: string;
  onConnected: () => void;
}

const ConnectBrokerDialog = ({
  open,
  onOpenChange,
  platformName,
  onConnected,
}: ConnectBrokerDialogProps) => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const isSupported = SUPPORTED_BROKERS.includes(platformName);

  const handleConnect = async () => {
    if (!user?.id || !apiKey.trim() || !apiSecret.trim()) return;
    setLoading(true);

    try {
      const { error } = await supabase.from("connected_platforms").upsert(
        {
          user_id: user.id,
          platform_name: platformName,
          platform_type: "International / Offshore Brokers",
          api_key: `${apiKey.trim()}:${apiSecret.trim()}`,
          connection_status: "connected",
        },
        { onConflict: "user_id,platform_name" as any }
      );

      if (error) throw error;
      toast.success(`${platformName} connected successfully`);
      onConnected();
      resetAndClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to connect broker");
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setApiKey("");
    setApiSecret("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect {platformName}</DialogTitle>
          <DialogDescription>
            {isSupported
              ? `Enter your ${platformName} API credentials to sync your holdings automatically.`
              : `${platformName} API integration is coming soon. Stay tuned!`}
          </DialogDescription>
        </DialogHeader>

        {isSupported ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                placeholder="Enter API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-secret">API Secret</Label>
              <Input
                id="api-secret"
                type="password"
                placeholder="Enter API secret"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Your credentials are stored securely and used only to fetch your portfolio data.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6">
            <Badge variant="secondary" className="text-sm">Coming Soon</Badge>
            <p className="text-sm text-muted-foreground text-center">
              We're working on integrating {platformName}. You can still add it as a platform and record transactions manually.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>
            Cancel
          </Button>
          {isSupported && (
            <Button
              onClick={handleConnect}
              disabled={loading || !apiKey.trim() || !apiSecret.trim()}
            >
              {loading ? "Connecting..." : "Connect"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectBrokerDialog;
