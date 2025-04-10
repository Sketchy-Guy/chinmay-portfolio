
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      // If user is not logged in, redirect to login
      if (!user) {
        navigate('/login');
      } 
      // If admin is required but user is not admin, show access denied
      else if (requireAdmin && !isAdmin) {
        // We'll let the component handle this case
      }
    }
  }, [user, isAdmin, isLoading, navigate, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-portfolio-purple" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // If auth check is complete and user is authenticated (and admin if required)
  if (!isLoading && user && (!requireAdmin || (requireAdmin && isAdmin))) {
    return <>{children}</>;
  }

  // For other cases, render nothing (redirection will happen in useEffect)
  return null;
};
