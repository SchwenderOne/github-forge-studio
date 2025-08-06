import { useState } from "react";
import { TrendingUp, TrendingDown, History, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReceiptScanner, AllocationResult } from "@/components/ReceiptScanner";
import { AddExpenseDialog } from "@/components/AddExpenseDialog";
import { SettleDebtDialog } from "@/components/SettleDebtDialog";
import { useFinances } from "@/hooks/useFinances";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";

const Finances = () => {
  const [showReceiptScanner, setShowReceiptScanner] = useState(false);
  const { transactions, loading, addTransaction, calculateBalances } = useFinances();
  const { user } = useAuth();
  const { profile } = useProfile();

  const { yourBalance, roommateBalance } = calculateBalances();

  const handleReceiptComplete = async (allocation: AllocationResult) => {
    if (!user) return;

    let addedCount = 0;
    
    // Add shared expenses (split)
    if (allocation.shared.length > 0) {
      const result = await addTransaction({
        type: 'expense',
        amount: allocation.totals.shared,
        description: `Shared groceries (${allocation.shared.length} items)`,
        date: new Date().toISOString().split('T')[0],
        paid_by: user.id,
        split_with: 'both'
      });
      if (result?.success) addedCount++;
    }

    // Add user's personal expenses
    if (allocation.me.length > 0) {
      const result = await addTransaction({
        type: 'expense',
        amount: allocation.totals.me,
        description: `Personal groceries (${allocation.me.length} items)`,
        date: new Date().toISOString().split('T')[0],
        paid_by: user.id,
        split_with: user.id
      });
      if (result?.success) addedCount++;
    }

    // Add roommate's expenses (if any were allocated)
    if (allocation.roommate.length > 0) {
      const result = await addTransaction({
        type: 'expense',
        amount: allocation.totals.roommate,
        description: `Roommate groceries (${allocation.roommate.length} items)`,
        date: new Date().toISOString().split('T')[0],
        paid_by: user.id,
        split_with: 'roommate'
      });
      if (result?.success) addedCount++;
    }

    setShowReceiptScanner(false);
    
    toast({
      title: "Success",
      description: `Added ${addedCount} transaction(s) from receipt`
    });
  };

  if (showReceiptScanner) {
    return (
      <div className="min-h-screen bg-gradient-soft p-4 pb-24">
        <div className="max-w-md mx-auto">
          <ReceiptScanner 
            onComplete={handleReceiptComplete}
            onCancel={() => setShowReceiptScanner(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft p-4 pb-24 space-y-6">
      {/* Header */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">Finances 💰</h1>
        <p className="text-muted-foreground">Track expenses and settle debts</p>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4 text-center">
            <div className="inline-flex p-2 rounded-xl bg-primary-soft mb-2">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Your Balance</p>
            <p className={`font-bold text-lg ${yourBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {yourBalance >= 0 ? '+' : ''}€{yourBalance.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4 text-center">
            <div className="inline-flex p-2 rounded-xl bg-accent-peach mb-2">
              <TrendingDown className="h-5 w-5 text-accent-peach-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Roommate Balance</p>
            <p className={`font-bold text-lg ${roommateBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {roommateBalance >= 0 ? '+' : ''}€{roommateBalance.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="max-w-md mx-auto space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <AddExpenseDialog />
          <SettleDebtDialog />
        </div>
        <Button 
          onClick={() => setShowReceiptScanner(true)}
          variant="outline" 
          className="w-full shadow-soft border-2 border-dashed border-primary/30 hover:border-primary/50"
        >
          <Camera className="mr-2 h-4 w-4" />
          Scan Receipt
        </Button>
      </div>

      {/* Recent Transactions */}
      <Card className="max-w-md mx-auto bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center">
            <History className="mr-2 h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground">Add an expense to get started</p>
            </div>
          ) : (
            transactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{transaction.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Paid by {transaction.paid_by === user?.id ? 'You' : 'Roommate'}</span>
                    {transaction.split_with && (
                      <>
                        <span>•</span>
                        <span>Split {transaction.split_with === 'both' ? '50/50' : 'individually'}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-primary' : 
                    transaction.type === 'settlement' ? 'text-accent-sky-foreground' : 
                    'text-foreground'
                  }`}>
                    {transaction.type === 'income' ? '+' : transaction.type === 'settlement' ? '↔' : '-'}€{Number(transaction.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {transaction.type}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <Card className="max-w-md mx-auto bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                €{transactions
                  .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
                  .reduce((sum, t) => sum + Number(t.amount), 0)
                  .toFixed(2)
                }
              </p>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                €{transactions
                  .filter(t => t.type === 'expense' && t.paid_by === user?.id && new Date(t.date).getMonth() === new Date().getMonth())
                  .reduce((sum, t) => {
                    if (t.split_with === 'both') {
                      return sum + (Number(t.amount) / 2);
                    } else if (t.split_with === user?.id) {
                      return sum + Number(t.amount);
                    }
                    return sum;
                  }, 0)
                  .toFixed(2)
                }
              </p>
              <p className="text-sm text-muted-foreground">Your Share</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Finances;