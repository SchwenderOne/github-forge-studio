import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign } from 'lucide-react';
import { useFinances } from '@/hooks/useFinances';

export const SettleDebtDialog = () => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  
  const { addTransaction, isAddingTransaction, userBalance } = useFinances();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || Number(amount) <= 0) {
      return;
    }

    const settlementAmount = Number(amount);
    const description = userBalance > 0 
      ? `Settlement received from roommate` 
      : `Settlement paid to roommate`;

    addTransaction({
      type: 'settlement',
      description,
      amount: settlementAmount,
    });

    // Reset form
    setAmount('');
    setOpen(false);
  };

  const suggestedAmount = Math.abs(userBalance).toFixed(2);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="shadow-soft">
          <DollarSign className="mr-2 h-4 w-4" />
          Settle Debt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settle Debt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Current balance:</p>
            <p className={`text-lg font-semibold ${userBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {userBalance >= 0 ? 'You are owed' : 'You owe'} €{Math.abs(userBalance).toFixed(2)}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Settlement Amount (€)</Label>
              <div className="flex space-x-2">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
                {userBalance !== 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(suggestedAmount)}
                  >
                    Full Amount
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isAddingTransaction}>
                {isAddingTransaction ? 'Processing...' : 'Settle'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};