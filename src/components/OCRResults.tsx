import { useState } from "react";
import { Eye, Edit2, Check, X, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReceiptItem } from "./ReceiptScanner";

interface OCRResultsProps {
  items: ReceiptItem[];
  onComplete: (items: ReceiptItem[]) => void;
  onCancel: () => void;
}

export const OCRResults = ({ items, onComplete, onCancel }: OCRResultsProps) => {
  const [editableItems, setEditableItems] = useState<ReceiptItem[]>(items);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ description: '', price: '' });

  const startEdit = (item: ReceiptItem) => {
    setEditingId(item.id);
    setEditForm({
      description: item.description,
      price: item.price.toFixed(2)
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    
    const price = parseFloat(editForm.price);
    if (isNaN(price) || price <= 0) return;

    setEditableItems(prev => prev.map(item => 
      item.id === editingId 
        ? { ...item, description: editForm.description, price }
        : item
    ));
    
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const deleteItem = (id: string) => {
    setEditableItems(prev => prev.filter(item => item.id !== id));
  };

  const addNewItem = () => {
    const newItem: ReceiptItem = {
      id: `manual-${Date.now()}`,
      description: 'NEW ITEM',
      price: 0.00
    };
    setEditableItems(prev => [...prev, newItem]);
    startEdit(newItem);
  };

  const totalAmount = editableItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="text-lg text-foreground flex items-center">
          <Eye className="mr-2 h-5 w-5" />
          Review Scanned Items
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Check if all items were detected correctly. Edit or add items as needed.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-64 overflow-y-auto space-y-2">
          {editableItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              {editingId === item.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Item description"
                    className="flex-1"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">€</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={editForm.price}
                      onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                      className="w-20"
                    />
                  </div>
                  <Button size="sm" onClick={saveEdit} className="p-1 h-8 w-8">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit} className="p-1 h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">€{item.price.toFixed(2)}</span>
                    <Button size="sm" variant="outline" onClick={() => startEdit(item)} className="p-1 h-8 w-8">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteItem(item.id)} className="p-1 h-8 w-8 text-destructive">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <Button 
          variant="outline" 
          onClick={addNewItem}
          className="w-full border-dashed"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>

        <div className="flex items-center justify-between p-3 bg-primary-soft rounded-lg">
          <span className="font-semibold text-foreground">Total:</span>
          <span className="font-bold text-lg text-foreground">€{totalAmount.toFixed(2)}</span>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={() => onComplete(editableItems)}
            className="flex-1 bg-gradient-primary text-primary-foreground"
            disabled={editableItems.length === 0}
          >
            Continue to Allocation
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};