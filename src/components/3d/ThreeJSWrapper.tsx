
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
  
  // If children is a single React element, clone it with filtered props
  if (React.isValidElement(children)) {
    return React.cloneElement(children, filteredProps);
  }
  
  // If children is multiple elements or fragments, wrap them
  return <>{children}</>;
};

// HOC to wrap Three.js components and filter their props
export const withThreeJSProps = <P extends object>(Component: React.ComponentType<P>) => {
  return React.forwardRef<any, P>((props, ref) => {
    const filteredProps = filterProps(props);
    return <Component {...(filteredProps as P)} ref={ref} />;
  });
};

// Clean wrapper for Three.js primitives
export const CleanMesh: React.FC<any> = (props) => {
  const cleanProps = filterProps(props);
  return <mesh {...cleanProps} />;
};

export const CleanPoints: React.FC<any> = (props) => {
  const cleanProps = filterProps(props);
  return <points {...cleanProps} />;
};

export const CleanGroup: React.FC<any> = (props) => {
  const cleanProps = filterProps(props);
  return <group {...cleanProps} />;
};
