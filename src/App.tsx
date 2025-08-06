import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Shopping from "./pages/Shopping";
import Finances from "./pages/Finances";
import Cleaning from "./pages/Cleaning";
import Plants from "./pages/Plants";
import Navigation from "./components/Navigation";
import NotFound from "./pages/NotFound";
import { AuthGuard } from "./components/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthGuard>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/shopping" element={<Shopping />} />
              <Route path="/finances" element={<Finances />} />
              <Route path="/cleaning" element={<Cleaning />} />
              <Route path="/plants" element={<Plants />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Navigation />
          </div>
        </AuthGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
