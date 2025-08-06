import { ShoppingCart, DollarSign, Sparkles, Sprout, Home, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ShoppingCart, label: "Shop", path: "/shopping" },
    { icon: DollarSign, label: "Money", path: "/finances" },
    { icon: Sparkles, label: "Clean", path: "/cleaning" },
    { icon: Sprout, label: "Plants", path: "/plants" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 z-50">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((nav) => (
          <button 
            key={nav.path}
            onClick={() => navigate(nav.path)}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              location.pathname === nav.path 
                ? 'text-primary bg-primary-soft' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <nav.icon className="h-5 w-5" />
            <span className="text-xs">{nav.label}</span>
          </button>
        ))}
        <button 
          onClick={signOut}
          className="flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-xs">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;