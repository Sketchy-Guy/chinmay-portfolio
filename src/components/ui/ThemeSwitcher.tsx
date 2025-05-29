
import { useState } from 'react';
import { Palette, Sparkles } from 'lucide-react';
import { useTheme } from '../effects/ThemeProvider';

const ThemeSwitcher = () => {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
      >
        <Palette className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
      </button>

      {isOpen && (
        <div className="fixed top-20 right-6 p-6 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl min-w-[280px] animate-fade-in">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-portfolio-purple" />
            Choose Theme
          </h3>
          
          <div className="space-y-3">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => {
                  setTheme(themeOption.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all duration-300 border ${
                  theme === themeOption.id
                    ? 'bg-portfolio-purple/20 border-portfolio-purple text-white'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="font-medium">{themeOption.name}</div>
                <div className="text-sm opacity-70">{themeOption.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeSwitcher;
