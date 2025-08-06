import { Check, Users, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AllocationResult } from "./ReceiptScanner";

interface AllocationSummaryProps {
  allocation: AllocationResult;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AllocationSummary = ({ allocation, onConfirm, onCancel }: AllocationSummaryProps) => {
  const { totals } = allocation;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center">
            <Check className="mr-2 h-5 w-5" />
            Allocation Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Balance Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-primary-soft rounded-lg">
              <div className="inline-flex p-2 rounded-xl bg-primary mb-2">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Your Share</p>
              <p className="font-bold text-xl text-foreground">€{totals.myShare.toFixed(2)}</p>
            </div>
            
            <div className="text-center p-4 bg-accent-peach rounded-lg">
              <div className="inline-flex p-2 rounded-xl bg-accent-peach-foreground mb-2">
                <User className="h-5 w-5 text-accent-peach" />
              </div>
              <p className="text-sm text-muted-foreground">Roommate Share</p>
              <p className="font-bold text-xl text-foreground">€{totals.roommateShare.toFixed(2)}</p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
              <span className="text-foreground">Your items</span>
              <span className="font-semibold text-foreground">€{totals.me.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
              <span className="text-foreground">Roommate items</span>
              <span className="font-semibold text-foreground">€{totals.roommate.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
              <span className="text-foreground flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Shared items
              </span>
              <span className="font-semibold text-foreground">€{totals.shared.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-accent-sky rounded-lg">
              <span className="text-foreground">Your share of shared items</span>
              <span className="font-semibold text-foreground">€{(totals.shared / 2).toFixed(2)}</span>
            </div>
          </div>

          {/* Item Lists */}
          <div className="space-y-4">
            {allocation.me.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-2">Your Items ({allocation.me.length})</h4>
                <div className="space-y-1">
                  {allocation.me.map(item => (
                    <div key={item.id} className="flex justify-between text-sm p-2 bg-primary-soft rounded">
                      <span className="text-foreground">{item.description}</span>
                      <span className="text-foreground">€{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {allocation.shared.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-2">Shared Items ({allocation.shared.length})</h4>
                <div className="space-y-1">
                  {allocation.shared.map(item => (
                    <div key={item.id} className="flex justify-between text-sm p-2 bg-accent-sky rounded">
                      <span className="text-foreground">{item.description}</span>
                      <span className="text-foreground">€{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {allocation.roommate.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-2">Roommate Items ({allocation.roommate.length})</h4>
                <div className="space-y-1">
                  {allocation.roommate.map(item => (
                    <div key={item.id} className="flex justify-between text-sm p-2 bg-accent-peach rounded">
                      <span className="text-foreground">{item.description}</span>
                      <span className="text-foreground">€{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button 
          onClick={onConfirm}
          className="flex-1 bg-gradient-primary text-primary-foreground"
        >
          Add to Finances
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};