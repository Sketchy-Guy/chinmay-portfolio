
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import HireMe from "./pages/HireMe";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { initializeStorage, createStorageBucket } from "@/utils/storage";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Create a single global query client instance with more aggressive refetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      staleTime: 5000, // Reduced stale time for more frequent refreshes
      gcTime: 1000 * 60 * 10, // 10 minutes cache time (previously called cacheTime)
    },
  },
});

const App = () => {
  const [initializing, setInitializing] = useState(true);

  // Run initialization once at the app level
  useEffect(() => {
    console.log("Initializing application...");
    
    const init = async () => {
      try {
        // First, check authentication status
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Auth session check:", session ? "User is authenticated" : "No authenticated user");
        
        // For non-authenticated users, we'll skip the bucket creation 
        // which requires authentication due to RLS policies
        if (!session) {
          console.log("Skipping storage initialization for non-authenticated user");
          setInitializing(false);
          return;
        }
        
        // Set up real-time subscription to auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
          console.log(`Auth state changed: ${event}`, newSession);
          
          // If a user logs in, we should initialize storage
          if (event === 'SIGNED_IN' && newSession) {
            initializeStorage().catch(err => {
              console.error('Error initializing storage after login:', err);
            });
          }
        });
        
        // Try to create the bucket first
        const bucketResult = await createStorageBucket();
        if (!bucketResult.success && !bucketResult.message.includes('already exists')) {
          console.warn('Storage bucket creation warning:', bucketResult.message);
          toast.warning('Storage initialization: ' + bucketResult.message);
        } else {
          console.log('Storage bucket setup:', bucketResult.message);
        }
        
        // Then initialize storage
        const result = await initializeStorage();
        if (!result.success) {
          console.warn('Storage initialization warning:', result.message);
          toast.warning('Storage initialization: ' + result.message);
        } else {
          console.log('Storage initialized successfully:', result.message);
        }
      } catch (error: any) {
        console.error('Error during initialization:', error);
        toast.error('Error during initialization: ' + error.message);
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
              <Sonner position="bottom-right" closeButton richColors />
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
