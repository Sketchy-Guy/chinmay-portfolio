
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
      {/* Theme Toggle Button - Positioned to avoid header collision */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 right-6 p-3 rounded-xl bg-black/40 backdrop-blur-xl border border-white/30 text-white hover:bg-black/60 transition-all duration-300 hover:scale-110 group shadow-xl hover:shadow-2xl"
        style={{
          boxShadow: 'var(--border-glow), 0 10px 30px rgba(0,0,0,0.5)'
        }}
        aria-label="Toggle theme switcher"
      >
        <Palette className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" 
          style={{ filter: 'drop-shadow(var(--text-glow))' }} 
        />
      </button>

      {/* Theme Switcher Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="fixed top-32 right-6 p-6 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/30 shadow-2xl min-w-[320px] z-50 animate-fade-in"
            style={{
              boxShadow: 'var(--border-glow), 0 20px 40px rgba(0,0,0,0.8)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold flex items-center gap-2"
                style={{ textShadow: 'var(--text-glow)' }}
              >
                <Sparkles className="w-5 h-5 text-portfolio-purple animate-pulse" />
                Choose Theme
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 border border-white/20 hover:border-white/40"
                aria-label="Close theme switcher"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
            
            {/* Theme Options */}
            <div className="space-y-3">
              {themes.map((themeOption, index) => (
                <button
                  key={themeOption.id}
                  onClick={() => handleThemeChange(themeOption.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-500 border group relative overflow-hidden ${
                    theme === themeOption.id
                      ? 'bg-gradient-to-r from-portfolio-purple/30 to-portfolio-teal/30 border-portfolio-purple text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/15 hover:border-white/30 hover:text-white'
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    boxShadow: theme === themeOption.id ? 'var(--border-glow)' : 'none'
                  }}
                >
                  {/* Background animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-portfolio-purple/10 to-portfolio-teal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center justify-between">
                    <div>
                      <div className="font-medium text-lg mb-1">{themeOption.name}</div>
                      <div className="text-sm opacity-70">{themeOption.description}</div>
                    </div>
                    {theme === themeOption.id && (
                      <div className="w-3 h-3 rounded-full bg-portfolio-purple animate-pulse shadow-lg"
                        style={{ boxShadow: 'var(--text-glow)' }}
                      ></div>
                    )}
                  </div>
                  
                  {/* Theme Preview Bar */}
                  <div 
                    className="mt-3 h-2 rounded-full opacity-70 group-hover:opacity-100 transition-all duration-300"
                    style={{
                      background: `linear-gradient(90deg, ${themeOption.colors.primary}, ${themeOption.colors.secondary})`
                    }}
                  ></div>
                </button>
              ))}
            </div>
            
            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <p className="text-xs text-gray-400 text-center">
                Themes apply instantly with smooth transitions
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;
