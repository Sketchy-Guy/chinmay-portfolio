
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

// Create a query client instance with aggressive refetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      staleTime: 5000, // Reduced stale time for more frequent refreshes
      gcTime: 1000 * 60 * 10, // 10 minutes cache time
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
        // Check authentication status
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Auth session check:", session ? "User is authenticated" : "No authenticated user");
        
        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          console.log(`Auth state changed: ${event}`, newSession?.user?.email);
          
          // When user logs in, set up storage
          if (event === 'SIGNED_IN' && newSession) {
            try {
              console.log('User signed in, initializing storage...');
              const result = await ensureStorageBucket();
              console.log('Storage initialization after login:', result);
              
              if (!result.success) {
                toast.warning('Storage initialization: ' + result.message);
              } else {
                toast.success('Storage ready for use');
              }
            } catch (err: any) {
              console.error('Error initializing storage after login:', err);
              toast.error('Storage error: ' + (err.message || "Unknown error"));
            }
          }
        });
        
        // Try to initialize storage anyway, even without authentication
        // This is important for public access to images
        try {
          console.log('Initializing storage...');
          const result = await ensureStorageBucket();
          
          if (!result.success) {
            console.warn('Storage initialization warning:', result.message);
            // Only show warning to authenticated users
            if (session) {
              toast.warning('Storage initialization: ' + result.message);
            }
          } else {
            console.log('Storage initialized successfully');
          }
        } catch (error: any) {
          console.error('Error during storage initialization:', error);
          // Only show error to authenticated users
          if (session) {
            toast.error('Storage initialization error: ' + (error.message || "Unknown error"));
          }
        }
      } catch (error: any) {
        console.error('Error during application initialization:', error);
        toast.error('Error during initialization: ' + (error.message || "Unknown error"));
      } finally {
        setInitializing(false);
      }
    };
    
    init();
    
    // Return cleanup function
    return () => {
      console.log('App unmounting, cleaning up...');
    };
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
