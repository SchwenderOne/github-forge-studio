import { useState } from "react";
import { DollarSign, Plus, TrendingUp, TrendingDown, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  type: 'expense' | 'income' | 'settlement';
  amount: number;
  description: string;
  date: string;
  paidBy: 'user1' | 'user2';
  splitWith?: 'user1' | 'user2' | 'both';
}

const Finances = () => {
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'expense',
      amount: 45.50,
      description: 'Groceries',
      date: '2024-01-15',
      paidBy: 'user1',
      splitWith: 'both'
    },
    {
      id: '2',
      type: 'expense',
      amount: 800.00,
      description: 'Rent',
      date: '2024-01-01',
      paidBy: 'user2',
      splitWith: 'both'
    },
    {
      id: '3',
      type: 'settlement',
      amount: 22.75,
      description: 'Grocery settlement',
      date: '2024-01-16',
      paidBy: 'user2',
    }
  ]);

  const yourBalance = 42.50;
  const roommateBalance = -42.50;

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
          <Button className="bg-gradient-primary text-primary-foreground border-0 shadow-soft">
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
          <Button variant="secondary" className="shadow-soft">
            <DollarSign className="mr-2 h-4 w-4" />
            Settle Debt
          </Button>
        </div>
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
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{transaction.description}</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{new Date(transaction.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Paid by {transaction.paidBy === 'user1' ? 'You' : 'Roommate'}</span>
                  {transaction.splitWith && (
                    <>
                      <span>•</span>
                      <span>Split {transaction.splitWith === 'both' ? '50/50' : 'individually'}</span>
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
                  {transaction.type === 'income' ? '+' : transaction.type === 'settlement' ? '↔' : '-'}€{transaction.amount.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {transaction.type}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <Card className="max-w-md mx-auto bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">January Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">€868</p>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">€434</p>
              <p className="text-sm text-muted-foreground">Your Share</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Finances;