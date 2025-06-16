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
import AdminEnhanced from "./pages/AdminEnhanced";
import HireMe from "./pages/HireMe";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { ensureStorageBucket } from "@/utils/storage";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";

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

// Create a function component to properly wrap the TooltipProvider
function AppContent() {
  const [initializing, setInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const { settings, loading: settingsLoading } = useSiteSettings();

  // Dynamic favicon update effect with better error handling
  useEffect(() => {
    if (settingsLoading || (!settings.site_favicon && !settings.site_logo)) return;
    
    const faviconUrl = settings.site_favicon || settings.site_logo;
    if (!faviconUrl) return;

    try {
      // Remove existing favicon links
      document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove());
      
      // Create new favicon link
      const favicon = document.createElement("link");
      favicon.rel = "icon";
      favicon.type = "image/png";
      favicon.href = faviconUrl;
      document.head.appendChild(favicon);
      
      console.log('Favicon updated successfully:', faviconUrl);
    } catch (error) {
      console.warn('Failed to update favicon:', error);
    }
  }, [settings.site_favicon, settings.site_logo, settingsLoading]);

  // Optimized initialization
  useEffect(() => {
    console.log("Initializing application...");
    
    const init = async () => {
      try {
        // Quick auth check
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Auth session check:", session ? "User authenticated" : "No authenticated user");
        
        // Set up auth listener for future changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          console.log(`Auth state changed: ${event}`);
          
          if (event === 'SIGNED_IN' && newSession) {
            try {
              console.log('User signed in, initializing storage...');
              const result = await ensureStorageBucket();
              console.log('Storage initialization result:', result);
              
              if (!result.success) {
                console.warn('Storage warning:', result.message);
              }
            } catch (err: any) {
              console.error('Storage error after login:', err);
            }
          }
        });
        
        // Initialize storage without blocking the UI
        try {
          console.log('Initializing storage...');
          const result = await ensureStorageBucket();
          
          if (!result.success) {
            console.warn('Storage initialization warning:', result.message);
            if (session) {
              // Only show warnings to authenticated users
              console.warn('Storage warning for authenticated user:', result.message);
            }
          } else {
            console.log('Storage initialized successfully');
          }
        } catch (error: any) {
          console.error('Storage initialization error:', error);
          setInitError(`Storage error: ${error.message}`);
        }
        
      } catch (error: any) {
        console.error('Application initialization error:', error);
        setInitError(`Initialization error: ${error.message}`);
      } finally {
        // Add minimum delay to prevent flash
        setTimeout(() => setInitializing(false), 500);
      }
    };
    
    init();
    
    return () => {
      console.log('App unmounting, cleaning up...');
    };
  }, []);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-500/20 border-r-cyan-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="space-y-2">
            <p className="text-xl text-purple-400 font-medium animate-pulse">Initializing Portfolio</p>
            <p className="text-sm text-gray-400">Setting up your experience...</p>
            {initError && (
              <p className="text-sm text-red-400 mt-2">{initError}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
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
                  <AdminEnhanced />
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
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
