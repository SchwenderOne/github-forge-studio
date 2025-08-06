import { useState } from "react";
import { Plus, Check, User, Users, Trash2, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShoppingItem {
  id: string;
  name: string;
  assignedTo: 'both' | 'user1' | 'user2';
  completed: boolean;
  cost?: number;
}

const Shopping = () => {
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: '1', name: 'Milk', assignedTo: 'user1', completed: false, cost: 1.50 },
    { id: '2', name: 'Bread', assignedTo: 'both', completed: false, cost: 2.20 },
    { id: '3', name: 'Apples', assignedTo: 'user2', completed: true, cost: 3.00 },
  ]);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          name: newItem,
          assignedTo: 'both',
          completed: false,
        }
      ]);
      setNewItem('');
    }
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const getAssignmentIcon = (assignment: string) => {
    switch (assignment) {
      case 'both': return <Users className="h-4 w-4 text-primary" />;
      case 'user1': return <User className="h-4 w-4 text-accent-peach-foreground" />;
      case 'user2': return <User className="h-4 w-4 text-accent-sky-foreground" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const totalCost = items.reduce((sum, item) => sum + (item.cost || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-soft p-4 pb-24 space-y-6">
      {/* Header */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">Shopping 🛒</h1>
        <p className="text-muted-foreground">Shared shopping list</p>
      </div>

      {/* Add Item */}
      <Card className="max-w-md mx-auto bg-gradient-card shadow-card border-0">
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Add new item..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              className="bg-background/50"
            />
            <Button onClick={addItem} size="sm" className="bg-gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload PDF */}
      <Card className="max-w-md mx-auto bg-gradient-card shadow-card border-0">
        <CardContent className="p-4">
          <Button variant="secondary" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Upload PDF Shopping List
          </Button>
        </CardContent>
      </Card>

      {/* Shopping Items */}
      <Card className="max-w-md mx-auto bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center justify-between">
            Shopping List
            <span className="text-sm font-normal text-muted-foreground">
              Total: €{totalCost.toFixed(2)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item) => (
            <div 
              key={item.id} 
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                item.completed 
                  ? 'bg-muted/50 opacity-60' 
                  : 'bg-background/50 hover:bg-background/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => toggleItem(item.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    item.completed 
                      ? 'bg-primary border-primary' 
                      : 'border-muted-foreground hover:border-primary'
                  }`}
                >
                  {item.completed && <Check className="h-3 w-3 text-primary-foreground" />}
                </button>
                <div>
                  <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {item.name}
                  </span>
                  {item.cost && (
                    <p className="text-xs text-muted-foreground">€{item.cost.toFixed(2)}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getAssignmentIcon(item.assignedTo)}
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Long-term Purchases */}
      <Card className="max-w-md mx-auto bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Long-term Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-foreground">New Sofa</span>
                <span className="text-sm text-muted-foreground">Need by: March</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">€800 - Split 50/50</p>
              <div className="flex justify-between text-xs">
                <span>You: €400</span>
                <span>Roommate: €400</span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-3">
            <Plus className="mr-2 h-4 w-4" />
            Add Purchase
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Shopping;