
import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/effects/ThemeProvider";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { theme } = useTheme();
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrollPosition(currentScrollY);
      
      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);
  
  const navLinks = [
    { title: "Home", href: "#" },
    { title: "About", href: "#about" },
    { title: "Skills", href: "#skills" },
    { title: "Projects", href: "#projects" },
    { title: "Contact", href: "#contact" },
  ];
  
  const headerClasses = `fixed top-0 left-0 w-full z-40 transition-all duration-500 ease-out ${
    isVisible ? 'translate-y-0' : '-translate-y-full'
  } ${
    scrollPosition > 50 
      ? "py-3 bg-black/80 backdrop-blur-lg shadow-2xl border-b border-white/10" 
      : "py-4 bg-transparent"
  }`;
  
  const getThemeButtonStyles = () => {
    const baseStyles = "ml-4 group relative overflow-hidden transition-all duration-300 hover:scale-105";
    const glowStyle = { boxShadow: 'var(--border-glow)' };
    
    switch (theme) {
      case 'cyber':
        return {
          className: `${baseStyles} bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white border border-cyan-400`,
          style: glowStyle
        };
      case 'neon':
        return {
          className: `${baseStyles} bg-gradient-to-r from-pink-600 to-green-500 hover:from-pink-500 hover:to-green-400 text-white border border-green-400`,
          style: glowStyle
        };
      case 'holographic':
        return {
          className: `${baseStyles} bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white border border-blue-400`,
          style: glowStyle
        };
      default:
        return {
          className: `${baseStyles} bg-gradient-to-r from-portfolio-purple to-portfolio-teal hover:from-purple-500 hover:to-cyan-400 text-white`,
          style: glowStyle
        };
    }
  };

  const buttonStyles = getThemeButtonStyles();
  
  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a 
            href="#" 
            className="group flex items-center gap-2 text-xl sm:text-2xl lg:text-3xl font-bold transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-portfolio-purple group-hover:animate-spin transition-all duration-300" />
              <div className="absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 bg-portfolio-purple/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
            </div>
            <span className="gradient-text">
              CK<span className="text-portfolio-teal">Panda</span>
            </span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="relative group py-2 px-3 xl:px-4 rounded-lg text-white/80 hover:text-white transition-all duration-300 hover:bg-white/5 text-sm xl:text-base"
                style={{ textShadow: scrollPosition > 50 ? 'var(--text-glow)' : 'none' }}
              >
                {link.title}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-portfolio-purple to-portfolio-teal transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </a>
            ))}
            
            <Button 
              className={buttonStyles.className}
              style={buttonStyles.style}
              onClick={() => window.location.href = "#contact"}
            >
              <Sparkles className="mr-2 h-4 w-4 group-hover:animate-spin transition-all duration-300" />
              <span className="text-sm xl:text-base">Hire Me</span>
            </Button>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu size={20} />
          </button>
          
          {/* Mobile Menu Overlay */}
          <div 
            className={`fixed inset-0 bg-black/90 backdrop-blur-lg z-50 lg:hidden transition-all duration-500 ease-out ${
              isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <div 
              className={`h-full w-80 max-w-[90vw] bg-black/90 backdrop-blur-xl border-r border-white/10 p-6 transition-transform duration-500 ease-out ${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Header */}
              <div className="flex justify-between items-center mb-10">
                <a href="#" className="flex items-center gap-2 text-xl font-bold">
                  <Sparkles className="w-5 h-5 text-portfolio-purple" />
                  <span className="gradient-text">
                    CK<span className="text-portfolio-teal">Panda</span>
                  </span>
                </a>
                <button 
                  className="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close mobile menu"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Mobile Navigation */}
              <nav className="space-y-4">
                {navLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="block text-lg text-white/80 hover:text-white transition-all duration-300 py-3 px-4 rounded-lg hover:bg-white/10 border border-transparent hover:border-white/20"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      textShadow: 'var(--text-glow)'
                    }}
                  >
                    {link.title}
                  </a>
                ))}
                
                <Button 
                  className={`${buttonStyles.className} w-full mt-6`}
                  style={buttonStyles.style}
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.location.href = "#contact";
                  }}
                >
                  <Sparkles className="mr-2 h-4 w-4 group-hover:animate-spin" />
                  Hire Me
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
