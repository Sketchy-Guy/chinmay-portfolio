
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ThreeJSErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log the error for debugging
    console.error('Three.js Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    
    // Check if it's the specific Lovable error we're trying to fix
    if (error.message.includes("Cannot read properties of undefined (reading 'lov')")) {
      console.error('Lovable attribute error detected in Three.js component');
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">3D Scene Error</h3>
            <p className="text-gray-600 text-sm">
              The 3D scene encountered an error. The page will continue to work normally.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ThreeJSErrorBoundary;
