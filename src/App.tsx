
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { lazy, Suspense, useEffect, useState } from "react";
import { ensureStorageBucket } from "@/utils/storage";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOptimizedSiteSettings } from "@/hooks/modern/useOptimizedSiteSettings";
import { modernConnectionManager } from "@/utils/modern/connectionManager";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminEnhanced = lazy(() => import("./pages/AdminEnhanced"));
const HireMe = lazy(() => import("./pages/HireMe"));
const Login = lazy(() => import("./pages/Login"));

/**
 * Optimized Query Client Configuration
 * Reduced refetch frequency and improved caching for better performance
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false, // Disabled to prevent excessive API calls
      refetchOnMount: true,
      staleTime: 60000, // 1 minute stale time for better performance
      gcTime: 1000 * 60 * 15, // 15 minutes cache time
    },
  },
});

/**
 * App Content Component
 * Handles application initialization, settings loading, and routing
 * Features: Optimized loading states, error recovery, connection management
 */
function AppContent() {
  const [initializing, setInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const { settings, loading: settingsLoading, error: settingsError } = useOptimizedSiteSettings();

  /**
   * Dynamic favicon and title update effect
   * Updates browser tab favicon and title based on site settings
   */
  useEffect(() => {
    if (settingsLoading) return;
    
    // Update document title
    if (settings.site_name) {
      document.title = settings.site_name;
    }
    
    // Update favicon
    const faviconUrl = settings.site_favicon || settings.site_logo;
    if (faviconUrl) {
      try {
        // Remove existing favicon links
        document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove());
        
        // Create new favicon link
        const favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.type = "image/png";
        favicon.href = faviconUrl;
        favicon.onerror = () => {
          console.warn('Failed to load favicon:', faviconUrl);
        };
        document.head.appendChild(favicon);
        
        console.log('Site branding updated successfully');
      } catch (error) {
        console.warn('Failed to update site branding:', error);
      }
    }
    
    // Update meta description
    if (settings.site_description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', settings.site_description);
    }
  }, [settings, settingsLoading]);

  /**
   * Application initialization effect
   * Handles auth session, storage setup, and error handling
   */
  useEffect(() => {
    console.log("Initializing optimized application...");
    
    const init = async () => {
      try {
        setInitError(null);
        
        // Quick auth session check
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Auth session status:", session ? "Authenticated" : "Public access");
        
        // Set up auth state change listener
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          console.log(`Auth state changed: ${event}`);
          
          if (event === 'SIGNED_IN' && newSession) {
            try {
              console.log('User authenticated, initializing storage...');
              const result = await ensureStorageBucket();
              console.log('Storage initialization result:', result);
              
              if (!result.success) {
                console.warn('Storage warning:', result.message);
                toast.warning('Storage initialization: ' + result.message);
              } else {
                toast.success('Welcome! Storage ready for use.');
              }
            } catch (err: any) {
              console.error('Storage error after authentication:', err);
              toast.error('Storage setup error: ' + (err.message || 'Unknown error'));
            }
          }
        });
        
        // Initialize storage for public access (important for image display)
        try {
          console.log('Initializing storage for public access...');
          const result = await ensureStorageBucket();
          
          if (!result.success) {
            console.warn('Public storage initialization warning:', result.message);
            // Only show warnings to authenticated users
            if (session) {
              toast.warning('Storage warning: ' + result.message);
            }
          } else {
            console.log('Storage initialized successfully for public access');
          }
        } catch (error: any) {
          console.error('Storage initialization error:', error);
          setInitError(`Storage error: ${error.message}`);
          
          // Only show errors to authenticated users
          if (session) {
            toast.error('Storage error: ' + (error.message || 'Unknown error'));
          }
        }
        
      } catch (error: any) {
        console.error('Application initialization error:', error);
        setInitError(`Initialization error: ${error.message}`);
        toast.error('Initialization error: ' + (error.message || 'Unknown error'));
      } finally {
        // Minimum delay to prevent loading flash
        setTimeout(() => {
          setInitializing(false);
        }, 800);
      }
    };
    
    init();
    
    // Global error handler
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      if (event.error?.message?.includes('WebSocket')) {
        console.log('WebSocket error detected, cleaning up connections...');
        modernConnectionManager.cleanup();
      }
    };
    
    window.addEventListener('error', handleGlobalError);
    
    // Cleanup function with enhanced connection management
    return () => {
      console.log('App unmounting, performing comprehensive cleanup...');
      window.removeEventListener('error', handleGlobalError);
      modernConnectionManager.cleanup();
    };
  }, []);

  /**
   * Enhanced loading screen with better UX
   */
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        
        <div className="text-center space-y-8 relative z-10">
          {/* Enhanced loading animation */}
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-cyan-500/20 border-r-cyan-500 rounded-full animate-spin mx-auto" 
                 style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl text-purple-400 font-orbitron font-bold animate-pulse">
              Initializing Portfolio Matrix
            </h2>
            <p className="text-gray-400">
              {settingsLoading ? 'Loading configuration...' : 'Connecting neural networks...'}
            </p>
            
            {/* Progress indicators */}
            <div className="flex justify-center gap-1 mt-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
            
            {/* Error display */}
            {(initError || settingsError) && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">
                  {initError || settingsError}
                </p>
              </div>
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
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-foreground/70" /></div>}>
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
          </Suspense>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

/**
 * Main App Component
 * Provides query client and tooltip context
 */
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
