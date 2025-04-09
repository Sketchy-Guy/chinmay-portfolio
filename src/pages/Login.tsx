
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, ArrowRight, User, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Trigger animation
      setIsAnimating(true);
      
      if (isLogin) {
        // Login flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        // Show success animation
        setSuccess(true);
        
        setTimeout(() => {
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
          
          navigate('/admin');
        }, 1000);
      } else {
        // Signup flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user?.identities?.length === 0) {
          throw new Error("Email already registered. Please login instead.");
        }
        
        // Show success animation
        setSuccess(true);
        
        setTimeout(() => {
          toast({
            title: "Registration successful",
            description: "Please check your email for verification link.",
          });
          
          setIsLogin(true); // Switch back to login form
          setSuccess(false);
        }, 1500);
      }
    } catch (error: any) {
      toast({
        title: isLogin ? "Login failed" : "Registration failed",
        description: error.message || `An error occurred during ${isLogin ? 'login' : 'registration'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setIsAnimating(false);
    }
  };

  const toggleForm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-portfolio-soft-teal to-white p-4 overflow-hidden">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isLogin ? "Login Successful!" : "Registration Complete!"}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? "Redirecting you to admin panel..." : "Please check your email for verification."}
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="form"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`glass-card p-8 w-full max-w-md transition-all duration-500 ${isAnimating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}
          >
            <div className="text-center mb-8">
              <motion.div 
                className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <User className="h-10 w-10 text-portfolio-purple" />
              </motion.div>
              <motion.h1 
                className="text-3xl font-bold text-portfolio-purple mb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Portfolio Admin
              </motion.h1>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {isLogin ? "Sign in to manage your portfolio" : "Create a new account"}
              </motion.p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-portfolio-purple"
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-portfolio-purple"
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  type="submit" 
                  className="w-full bg-portfolio-purple hover:bg-portfolio-purple/90 transition-all duration-300 transform hover:scale-105"
                  disabled={loading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isLogin ? "Signing in..." : "Signing up..."}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      {isLogin ? "Sign in" : "Sign up"} <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </motion.div>
              
              <motion.div 
                className="text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <button 
                  type="button"
                  onClick={toggleForm}
                  className="text-portfolio-purple hover:text-portfolio-purple/80 text-sm transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </motion.div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
