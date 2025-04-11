
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
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { initializeStorage } from "@/utils/storage";

const queryClient = new QueryClient();

// Function to initialize the database schema if needed
const initializeDatabase = async () => {
  try {
    console.log("Checking database schema...");
    
    // Check if profile_image column exists in user_profile table
    const { error } = await supabase
      .from('user_profile')
      .select('profile_image')
      .limit(1);
    
    if (error && error.code === '42703') {
      console.log('profile_image column does not exist, adding it...');
      
      // If error code 42703 (undefined_column), add the column
      // Use rpc instead of direct query as it's supported in the Supabase client
      const { error: alterError } = await supabase.rpc('add_profile_image_column');
      
      if (alterError) {
        console.error('Error adding profile_image column:', alterError);
      } else {
        console.log('profile_image column added to user_profile table');
      }
    }
    
    // Initialize the storage bucket
    await initializeStorage();
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

const App = () => {
  useEffect(() => {
    console.log("Initializing application...");
    initializeDatabase();
  }, []);

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
