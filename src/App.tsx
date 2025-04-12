
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/components/DataManager";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import HireMe from "./pages/HireMe";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { initializeStorage } from "@/utils/storage";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Create a single global query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    console.log("Initializing application...");
    
    const init = async () => {
      try {
        // Only initialize storage once at the app level
        const result = await initializeStorage();
        if (!result.success) {
          console.warn('Storage initialization warning:', result.message);
          toast.error('Storage initialization warning: ' + result.message);
          // Continue anyway, the app might still work since we've set up RLS policies
        } else {
          console.log('Storage initialized:', result.message);
        }
      } catch (error: any) {
        console.error('Error during initialization:', error);
        toast.error('Error during initialization: ' + error.message);
        // Continue anyway, the app might still work
      } finally {
        // Always complete initialization to allow rendering
        setInitializing(false);
      }
    };
    
    init();
  }, []);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-portfolio-purple mx-auto" />
          <p className="mt-4 text-portfolio-purple">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <DataProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route 
                  path="/admin" 
                  element={
                    <AuthGuard requireAdmin={true}>
                      <Admin />
                    </AuthGuard>
                  } 
                />
                <Route path="/hire-me" element={<HireMe />} />
                <Route path="/login" element={<Login />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DataProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
