
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
import { ensureStorageBucket } from "@/utils/storage";
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
        
        // Set up real-time subscription to auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
          console.log(`Auth state changed: ${event}`, newSession?.user?.email);
          
          // If a user logs in, we should initialize storage
          if (event === 'SIGNED_IN' && newSession) {
            // Do this in a non-blocking way
            setTimeout(async () => {
              try {
                const result = await ensureStorageBucket();
                if (!result.success) {
                  console.warn('Storage initialization after login:', result.message);
                  toast.warning('Storage initialization: ' + result.message);
                } else {
                  console.log('Storage initialized after login:', result.message);
                }
              } catch (err) {
                console.error('Error initializing storage after login:', err);
              }
            }, 1000);
          }
        });
        
        // Only try to initialize storage if the user is authenticated
        if (session) {
          // Initialize storage with multiple retries for transient issues
          let retries = 0;
          const maxRetries = 3;
          let storageInitialized = false;
          
          while (retries < maxRetries && !storageInitialized) {
            try {
              // Wait 2 seconds before retrying to allow auth to fully initialize
              if (retries > 0) {
                console.log(`Retry ${retries}/${maxRetries} for storage initialization...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
              }
              
              const result = await ensureStorageBucket();
              if (result.success) {
                console.log('Storage initialized successfully:', result.message);
                storageInitialized = true;
              } else {
                console.warn('Storage initialization warning:', result.message);
                toast.warning('Storage initialization: ' + result.message);
                retries++;
              }
            } catch (error: any) {
              console.error('Error during storage initialization:', error);
              retries++;
            }
          }
          
          if (!storageInitialized) {
            toast.error('Failed to initialize storage after multiple attempts. Some features may not work correctly.');
          }
        }
      } catch (error: any) {
        console.error('Error during application initialization:', error);
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
