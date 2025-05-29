
import { useState } from 'react';
import { Palette, Sparkles, X } from 'lucide-react';
import { useTheme } from '../effects/ThemeProvider';

const ThemeSwitcher = () => {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (newTheme: typeof theme) => {
    console.log('Changing theme to:', newTheme);
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 p-4 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/20 text-white hover:bg-black/50 transition-all duration-300 hover:scale-110 group shadow-2xl"
        aria-label="Toggle theme switcher"
      >
        <Palette className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
      </button>

      {/* Theme Switcher Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="fixed top-20 right-6 p-6 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl min-w-[320px] z-50 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-portfolio-purple" />
                Choose Theme
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors duration-200"
                aria-label="Close theme switcher"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            </div>
            
            {/* Theme Options */}
            <div className="space-y-3">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => handleThemeChange(themeOption.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 border group ${
                    theme === themeOption.id
                      ? 'bg-gradient-to-r from-portfolio-purple/20 to-portfolio-teal/20 border-portfolio-purple text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-lg">{themeOption.name}</div>
                      <div className="text-sm opacity-70 mt-1">{themeOption.description}</div>
                    </div>
                    {theme === themeOption.id && (
                      <div className="w-3 h-3 rounded-full bg-portfolio-purple animate-pulse"></div>
                    )}
                  </div>
                  
                  {/* Theme Preview Bar */}
                  <div className="mt-3 h-2 rounded-full bg-gradient-to-r from-portfolio-purple to-portfolio-teal opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                </button>
              ))}
            </div>
            
            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-400 text-center">
                Themes apply instantly and affect the entire portfolio
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;
