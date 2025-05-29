
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'cyber' | 'neon' | 'matrix' | 'holographic' | 'default';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { id: Theme; name: string; description: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>('default');

  const themes = [
    { id: 'default' as Theme, name: 'Cosmic', description: 'Modern space-age design' },
    { id: 'cyber' as Theme, name: 'Cyberpunk', description: 'Neon-lit future city' },
    { id: 'neon' as Theme, name: 'Neon Dreams', description: 'Electric glow aesthetic' },
    { id: 'matrix' as Theme, name: 'Matrix', description: 'Digital rain effect' },
    { id: 'holographic' as Theme, name: 'Holographic', description: 'Iridescent surfaces' },
  ];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
