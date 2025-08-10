import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Plus } from 'lucide-react';
import { usePurchases } from '@/hooks/usePurchases';

export const AddPurchaseDialog = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [total, setTotal] = useState('');
  const [neededBy, setNeededBy] = useState('');

  const { addPurchase, isAddingPurchase } = usePurchases();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !total || Number(total) <= 0) return;

    addPurchase({
      name: name.trim(),
      total_cost: Number(total),
      needed_by: neededBy || undefined,
    });

    setName('');
    setTotal('');
    setNeededBy('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Purchase
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Long-term Purchase</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., New Sofa" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total">Total Cost (€)</Label>
            <Input id="total" type="number" step="0.01" min="0" value={total} onChange={(e) => setTotal(e.target.value)} placeholder="0.00" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="neededBy">Needed by (optional)</Label>
            <Input id="neededBy" type="date" value={neededBy} onChange={(e) => setNeededBy(e.target.value)} />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isAddingPurchase}>{isAddingPurchase ? 'Adding...' : 'Add'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
