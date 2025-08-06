import { useState } from "react";
import { DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinances } from "@/hooks/useFinances";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export const SettleDebtDialog = () => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { addTransaction, calculateBalances } = useFinances();
  const { user } = useAuth();

  const { yourBalance } = calculateBalances();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount) return;

    const settleAmount = parseFloat(amount);
    if (settleAmount <= 0) return;

    setLoading(true);
    
    const result = await addTransaction({
      type: 'settlement',
      description: `Debt settlement - €${settleAmount}`,
      amount: settleAmount,
      date: new Date().toISOString().split('T')[0],
      paid_by: yourBalance < 0 ? user.id : "roommate", // Person who owes money pays
    });

    if (result?.success) {
      toast({
        title: "Success",
        description: "Debt settled successfully"
      });
      setOpen(false);
      setAmount("");
    } else {
      toast({
        title: "Error",
        description: "Failed to settle debt",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  const maxAmount = Math.abs(yourBalance);
  const canSettle = maxAmount > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="shadow-soft" disabled={!canSettle}>
          <DollarSign className="mr-2 h-4 w-4" />
          Settle Debt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settle Debt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center p-4 bg-background/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Current balance</p>
            <p className={`text-xl font-bold ${yourBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {yourBalance >= 0 ? '+' : ''}€{yourBalance.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {yourBalance > 0 ? "Roommate owes you" : yourBalance < 0 ? "You owe roommate" : "No debt to settle"}
            </p>
          </div>

          {canSettle && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="settle-amount">Settlement Amount (€)</Label>
                <Input
                  id="settle-amount"
                  type="number"
                  step="0.01"
                  max={maxAmount}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Max: ${maxAmount.toFixed(2)}`}
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Settling..." : "Settle Debt"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};