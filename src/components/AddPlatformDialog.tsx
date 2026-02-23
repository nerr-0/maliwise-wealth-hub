import { useState, useMemo } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

const PLATFORM_OPTIONS: Record<string, string[]> = {
  "Financial Services": [
    "M-Pesa",
    "Britam",
    "Old Mutual",
    "Jubilee Insurance",
    "ICEA Lion",
    "Stanbic",
  ],
  Banking: [
    "Co-operative Bank",
    "NCBA Bank",
    "Absa Bank Kenya",
    "DTB Bank",
    "Standard Chartered",
    "I&M Bank",
    "Family Bank",
  ],
  "Money Market Funds": [
    "Sanlam MMF",
    "Britam MMF",
    "Old Mutual MMF",
    "GenAfrica MMF",
    "Nabo Capital MMF",
    "Zimele MMF",
    "ICEA Lion MMF",
    "Madison MMF",
    "Dry Associates MMF",
    "Apollo MMF",
    "AA Kenya MMF",
  ],
  REITs: ["Acorn I-REIT", "Vaal REIT"],
  "Fixed Income": [
    "Infrastructure Bonds",
    "M-Akiba",
    "Corporate Bonds",
    "Savings Bonds",
    "Green Bonds",
  ],
};

interface AddPlatformDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string;
  onAdd: (platform: { name: string; type: string }) => void;
  existingNames: string[];
}

const AddPlatformDialog = ({
  open,
  onOpenChange,
  category,
  onAdd,
  existingNames,
}: AddPlatformDialogProps) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [customName, setCustomName] = useState("");

  const options = useMemo(() => {
    const all = PLATFORM_OPTIONS[category] ?? [];
    const available = all.filter((p) => !existingNames.includes(p));
    if (!search) return available;
    return available.filter((p) =>
      p.toLowerCase().includes(search.toLowerCase())
    );
  }, [category, search, existingNames]);

  const handleAdd = () => {
    const name = selected === "__custom" ? customName.trim() : selected;
    if (!name) return;
    onAdd({ name, type: category });
    resetAndClose();
  };

  const resetAndClose = () => {
    setSearch("");
    setSelected("");
    setCustomName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add {category} Platform</DialogTitle>
          <DialogDescription>
            Select a platform or enter a custom name.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search platforms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="max-h-[240px] pr-3">
          <RadioGroup value={selected} onValueChange={setSelected} className="gap-2">
            {options.map((name) => (
              <Label
                key={name}
                htmlFor={name}
                className="flex items-center gap-3 rounded-md border border-border p-3 cursor-pointer hover:bg-accent/50 transition-colors [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem value={name} id={name} />
                <span className="text-sm font-medium">{name}</span>
              </Label>
            ))}

            {/* Custom option */}
            <Label
              htmlFor="__custom"
              className="flex items-center gap-3 rounded-md border border-border p-3 cursor-pointer hover:bg-accent/50 transition-colors [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="__custom" id="__custom" />
              <span className="text-sm font-medium">Custom</span>
            </Label>
          </RadioGroup>
        </ScrollArea>

        {selected === "__custom" && (
          <Input
            placeholder="Enter platform name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
        )}

        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={
              !selected || (selected === "__custom" && !customName.trim())
            }
          >
            Add Platform
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlatformDialog;
