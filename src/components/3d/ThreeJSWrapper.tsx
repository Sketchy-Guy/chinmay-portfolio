
import React from 'react';

// Helper function to filter out data-lov-* attributes and other problematic props
const filterProps = (props: any) => {
  const filtered: any = {};
  
  for (const [key, value] of Object.entries(props)) {
    // Skip data-lov-* attributes and other Lovable-specific props
    if (key.startsWith('data-lov') || key === 'lov' || key === 'lovable') {
      continue;
    }
    filtered[key] = value;
  }
  
  return filtered;
};

// Wrapper component that filters props before passing to children
export const ThreeJSWrapper: React.FC<{ children: React.ReactNode; [key: string]: any }> = ({ children, ...props }) => {
  const filteredProps = filterProps(props);
  
  return React.cloneElement(
    React.Children.only(children) as React.ReactElement,
    filteredProps
  );
};

// HOC to wrap Three.js components
export const withThreeJSProps = <P extends object>(Component: React.ComponentType<P>) => {
  return React.forwardRef<any, P>((props, ref) => {
    const filteredProps = filterProps(props);
    return <Component {...(filteredProps as P)} ref={ref} />;
  });
};
