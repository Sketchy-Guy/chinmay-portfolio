
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'cyber' | 'neon' | 'holographic' | 'default';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { id: Theme; name: string; description: string; colors: { primary: string; secondary: string } }[];
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
    { 
      id: 'default' as Theme, 
      name: 'Cosmic', 
      description: 'Modern space-age design',
      colors: { primary: '#8b5cf6', secondary: '#06b6d4' }
    },
    { 
      id: 'cyber' as Theme, 
      name: 'Cyberpunk', 
      description: 'Neon-lit future city',
      colors: { primary: '#ff00ff', secondary: '#00ffff' }
    },
    { 
      id: 'neon' as Theme, 
      name: 'Neon Dreams', 
      description: 'Electric glow aesthetic',
      colors: { primary: '#ff0080', secondary: '#80ff00' }
    },
    { 
      id: 'holographic' as Theme, 
      name: 'Holographic', 
      description: 'Iridescent surfaces',
      colors: { primary: '#8b5cf6', secondary: '#06b6d4' }
    },
  ];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    
    const root = document.documentElement;
    
    switch (theme) {
      case 'cyber':
        root.style.setProperty('--portfolio-purple', '#ff00ff');
        root.style.setProperty('--portfolio-teal', '#00ffff');
        root.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 25%, #2e0a3e 50%, #3e0a4f 75%, #0a0a0f 100%)');
        root.style.setProperty('--text-glow', '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff');
        root.style.setProperty('--border-glow', '0 0 5px #00ffff, 0 0 10px #00ffff');
        break;
      case 'neon':
        root.style.setProperty('--portfolio-purple', '#ff0080');
        root.style.setProperty('--portfolio-teal', '#80ff00');
        root.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #000000 0%, #1a001a 25%, #001a1a 50%, #1a1a00 75%, #000000 100%)');
        root.style.setProperty('--text-glow', '0 0 10px #ff0080, 0 0 20px #ff0080, 0 0 30px #ff0080');
        root.style.setProperty('--border-glow', '0 0 5px #80ff00, 0 0 10px #80ff00');
        break;
      case 'holographic':
        root.style.setProperty('--portfolio-purple', '#8b5cf6');
        root.style.setProperty('--portfolio-teal', '#06b6d4');
        root.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #0a0a0f 0%, #2a1a3e 25%, #1a2a3e 50%, #3e2a1a 75%, #0a0a0f 100%)');
        root.style.setProperty('--text-glow', '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6');
        root.style.setProperty('--border-glow', '0 0 5px #06b6d4, 0 0 10px #06b6d4');
        break;
      default:
        root.style.setProperty('--portfolio-purple', '#8b5cf6');
        root.style.setProperty('--portfolio-teal', '#06b6d4');
        root.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 25%, #2e1a3e 50%, #3e2a1a 75%, #0a0a0f 100%)');
        root.style.setProperty('--text-glow', '0 0 10px #8b5cf6, 0 0 20px #8b5cf6');
        root.style.setProperty('--border-glow', '0 0 5px #06b6d4, 0 0 10px #06b6d4');
        break;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
