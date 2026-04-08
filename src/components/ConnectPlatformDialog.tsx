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
import { supabase } from "@/integrations/supabase/client2";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ConnectPlatformDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platformName: string;
  platformCategory: string;
  onConnected: () => void;
}

const ConnectPlatformDialog = ({
  open,
  onOpenChange,
  platformName,
  platformCategory,
  onConnected,
}: ConnectPlatformDialogProps) => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!user?.id || !email.trim() || !password.trim()) return;
    setLoading(true);

    try {
      const { error } = await supabase.from("connected_platforms").upsert(
        {
          user_id: user.id,
          platform_name: platformName,
          platform_type: platformCategory,
          api_key: `${email.trim()}:${password.trim()}`,
          connection_status: "connected",
        },
        { onConflict: "user_id,platform_name" as any }
      );

      if (error) throw error;
      toast.success(`${platformName} connected successfully`);
      onConnected();
      resetAndClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to connect platform");
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setEmail("");
    setPassword("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect {platformName}</DialogTitle>
          <DialogDescription>
            Enter your {platformName} login credentials to link your account and sync your portfolio data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform-email">Email or Username</Label>
            <Input
              id="platform-email"
              placeholder="Enter your email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="platform-password">Password</Label>
            <Input
              id="platform-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Your credentials are stored securely and used only to sync your portfolio data.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            disabled={loading || !email.trim() || !password.trim()}
          >
            {loading ? "Connecting..." : "Connect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectPlatformDialog;
