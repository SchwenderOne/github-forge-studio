import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinances } from "@/hooks/useFinances";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export const AddExpenseDialog = () => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [splitWith, setSplitWith] = useState("both");
  const [loading, setLoading] = useState(false);
  const { addTransaction } = useFinances();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !description || !amount) return;

    setLoading(true);
    
    const result = await addTransaction({
      type: 'expense',
      description,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      paid_by: user.id,
      split_with: splitWith
    });

    if (result?.success) {
      toast({
        title: "Success",
        description: "Expense added successfully"
      });
      setOpen(false);
      setDescription("");
      setAmount("");
      setSplitWith("both");
    } else {
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary text-primary-foreground border-0 shadow-soft">
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you buy?"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="amount">Amount (€)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="split">Split with</Label>
            <Select value={splitWith} onValueChange={setSplitWith}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Split 50/50</SelectItem>
                <SelectItem value={user?.id || ""}>Just me</SelectItem>
                <SelectItem value="roommate">Roommate only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add Expense"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};