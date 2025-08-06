import { ShoppingCart, DollarSign, Sparkles, Sprout, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const todayTasks = [
    { type: "plant", text: "Water the monstera", urgent: true },
    { type: "clean", text: "Clean bathroom", urgent: false },
    { type: "shop", text: "Buy groceries", urgent: true },
  ];

  const quickStats = [
    { 
      title: "Shopping List", 
      value: "8 items", 
      icon: ShoppingCart, 
      color: "bg-accent-peach",
      textColor: "text-accent-peach-foreground"
    },
    { 
      title: "Balance", 
      value: "+€42.50", 
      icon: DollarSign, 
      color: "bg-primary-soft",
      textColor: "text-primary-foreground"
    },
    { 
      title: "Next Clean", 
      value: "Kitchen", 
      icon: Sparkles, 
      color: "bg-accent-sky",
      textColor: "text-accent-sky-foreground"
    },
    { 
      title: "Plants Due", 
      value: "2 today", 
      icon: Sprout, 
      color: "bg-accent-rose",
      textColor: "text-accent-rose-foreground"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft p-4 space-y-6">
      {/* Header */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">Good morning! ☀️</h1>
        <p className="text-muted-foreground">Here's what's happening today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {quickStats.map((stat) => (
          <Card key={stat.title} className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-4 text-center">
              <div className={`inline-flex p-2 rounded-xl ${stat.color} mb-2`}>
                <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
              </div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="font-semibold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Tasks */}
      <Card className="max-w-md mx-auto bg-gradient-card shadow-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground">Today's Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayTasks.map((task, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <span className={`text-sm ${task.urgent ? 'text-destructive font-medium' : 'text-foreground'}`}>
                {task.text}
              </span>
              <div className={`w-2 h-2 rounded-full ${task.urgent ? 'bg-destructive' : 'bg-muted'}`} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="max-w-md mx-auto space-y-3">
        <h3 className="text-lg font-semibold text-foreground text-center">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-gradient-primary text-primary-foreground border-0 shadow-soft">
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
          <Button variant="secondary" className="shadow-soft">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Shop Now
          </Button>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
        <div className="flex justify-around max-w-md mx-auto">
          {[
            { icon: ShoppingCart, label: "Shop", active: false },
            { icon: DollarSign, label: "Money", active: false },
            { icon: Sparkles, label: "Clean", active: false },
            { icon: Sprout, label: "Plants", active: false },
          ].map((nav) => (
            <button 
              key={nav.label}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                nav.active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <nav.icon className="h-5 w-5" />
              <span className="text-xs">{nav.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;