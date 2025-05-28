
import React from 'react';

// Comprehensive filter function to remove all Lovable-specific attributes
const filterProps = (props: any) => {
  if (!props || typeof props !== 'object') {
    return props;
  }

  const filtered: any = {};
  
  for (const [key, value] of Object.entries(props)) {
    // Skip all Lovable-specific attributes and problematic props
    if (
      key.startsWith('data-lov') || 
      key === 'lov' || 
      key === 'lovable' ||
      key.includes('lov') ||
      key.startsWith('data-')
    ) {
      continue;
    }
    filtered[key] = value;
  }
  
  return filtered;
};

// Enhanced wrapper component with better prop filtering
export const ThreeJSWrapper: React.FC<{ children: React.ReactNode; [key: string]: any }> = ({ children, ...props }) => {
  const filteredProps = filterProps(props);
  
  if (React.isValidElement(children)) {
    return React.cloneElement(children, filteredProps);
  }
  
  return <>{children}</>;
};

// Enhanced HOC with better error handling
export const withThreeJSProps = <P extends object>(Component: React.ComponentType<P>) => {
  return React.forwardRef<any, P>((props, ref) => {
    const filteredProps = filterProps(props);
    return <Component {...(filteredProps as P)} ref={ref} />;
  });
};

// Enhanced clean components with better prop filtering
export const CleanMesh = React.forwardRef<any, any>((props, ref) => {
  const cleanProps = filterProps(props);
  return <mesh {...cleanProps} ref={ref} />;
});

export const CleanPoints = React.forwardRef<any, any>((props, ref) => {
  const cleanProps = filterProps(props);
  return <points {...cleanProps} ref={ref} />;
});

export const CleanGroup = React.forwardRef<any, any>((props, ref) => {
  const cleanProps = filterProps(props);
  return <group {...cleanProps} ref={ref} />;
});

// Additional clean components for comprehensive coverage
export const CleanSphere = React.forwardRef<any, any>((props, ref) => {
  const cleanProps = filterProps(props);
  return <mesh {...cleanProps} ref={ref} />;
});

export const CleanBox = React.forwardRef<any, any>((props, ref) => {
  const cleanProps = filterProps(props);
  return <mesh {...cleanProps} ref={ref} />;
});

// Wrapper for Drei components
export const CleanFloat = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  const cleanProps = filterProps(props);
  // We'll import Float dynamically to avoid prop issues
  return <group {...cleanProps}>{children}</group>;
};
