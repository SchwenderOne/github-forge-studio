import { useState } from "react";
import { Heart, X, Users, ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReceiptItem, AllocationResult } from "./ReceiptScanner";

interface ItemSwiperProps {
  items: ReceiptItem[];
  onComplete: (allocation: AllocationResult) => void;
  onCancel: () => void;
}

export const ItemSwiper = ({ items, onComplete, onCancel }: ItemSwiperProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allocatedItems, setAllocatedItems] = useState<ReceiptItem[]>([]);

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;

  const allocateItem = (category: 'me' | 'roommate' | 'shared') => {
    const allocatedItem = { ...currentItem, category };
    setAllocatedItems(prev => [...prev, allocatedItem]);

    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // All items allocated, calculate results
      const finalAllocated = [...allocatedItems, allocatedItem];
      const result = calculateAllocation(finalAllocated);
      onComplete(result);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setAllocatedItems(prev => prev.slice(0, -1));
    }
  };

  const calculateAllocation = (items: ReceiptItem[]): AllocationResult => {
    const me = items.filter(item => item.category === 'me');
    const roommate = items.filter(item => item.category === 'roommate');
    const shared = items.filter(item => item.category === 'shared');

    const meTotal = me.reduce((sum, item) => sum + item.price, 0);
    const roommateTotal = roommate.reduce((sum, item) => sum + item.price, 0);
    const sharedTotal = shared.reduce((sum, item) => sum + item.price, 0);

    return {
      me,
      roommate,
      shared,
      totals: {
        me: meTotal,
        roommate: roommateTotal,
        shared: sharedTotal,
        myShare: meTotal + (sharedTotal / 2),
        roommateShare: roommateTotal + (sharedTotal / 2)
      }
    };
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-background rounded-full h-2">
        <div 
          className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Current Item Card */}
      <Card className="bg-gradient-card shadow-card border-0 min-h-[300px] flex flex-col">
        <CardHeader className="text-center">
          <CardTitle className="text-lg text-foreground">
            Item {currentIndex + 1} of {items.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center items-center space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {currentItem.description}
            </h3>
            <p className="text-3xl font-bold text-primary">
              €{currentItem.price.toFixed(2)}
            </p>
          </div>

          <p className="text-muted-foreground text-center">
            Who should pay for this item?
          </p>
        </CardContent>
      </Card>

      {/* Swipe Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          onClick={() => allocateItem('roommate')}
          className="h-16 bg-accent-peach text-accent-peach-foreground flex flex-col gap-1"
        >
          <X className="h-6 w-6" />
          <span className="text-sm">Roommate</span>
        </Button>
        
        <Button
          onClick={() => allocateItem('shared')}
          className="h-16 bg-accent-sky text-accent-sky-foreground flex flex-col gap-1"
        >
          <Users className="h-6 w-6" />
          <span className="text-sm">Shared</span>
        </Button>
        
        <Button
          onClick={() => allocateItem('me')}
          className="h-16 bg-gradient-primary text-primary-foreground flex flex-col gap-1"
        >
          <Heart className="h-6 w-6" />
          <span className="text-sm">Me</span>
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={currentIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {/* Allocation Summary */}
      {allocatedItems.length > 0 && (
        <Card className="bg-background/50">
          <CardContent className="p-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Me: {allocatedItems.filter(i => i.category === 'me').length}</span>
              <span>Shared: {allocatedItems.filter(i => i.category === 'shared').length}</span>
              <span>Roommate: {allocatedItems.filter(i => i.category === 'roommate').length}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};