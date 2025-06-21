
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOptimizedSiteSettings } from "@/hooks/modern/useOptimizedSiteSettings";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { settings, loading } = useOptimizedSiteSettings();

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    
    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerOffset = 100;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const navLinks = [
    { title: "Home", href: "#" },
    { title: "About", href: "#about" },
    { title: "Skills", href: "#skills" },
    { title: "Timeline", href: "#timeline" },
    { title: "Projects", href: "#projects" },
    { title: "Contact", href: "#contact" },
  ];

  const logo = settings.site_logo || "/lovable-uploads/a5f88509-5d42-4d11-8b7c-6abe9e64cfd0.png";
  const name = settings.site_name || "Chinmay Kumar Panda";

  console.log('Header settings:', { logo, name, settings });

  if (loading) {
    return (
      <header className="fixed top-0 left-0 w-full z-50 h-16 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="animate-pulse h-8 w-40 bg-slate-700/50 rounded"></div>
            <div className="animate-pulse h-8 w-20 bg-slate-700/50 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrollPosition > 50
          ? "h-14 bg-slate-900/98 backdrop-blur-xl shadow-xl border-b border-slate-700/50"
          : "h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/30"
      }`}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          <button
            onClick={() => handleNavClick('#')}
            className="flex items-center gap-3 text-lg md:text-xl font-bold font-orbitron transition-all duration-300 hover:scale-105 group"
            aria-label="Homepage"
          >
            <div className="relative">
              <img
                src={logo}
                alt="Site Logo"
                className="h-8 w-8 md:h-10 md:w-10 object-cover rounded-full border-2 border-blue-500/50 group-hover:border-blue-400 shadow-lg transition-all duration-300"
                loading="lazy"
                onError={(e) => {
                  console.error('Logo failed to load:', logo);
                  e.currentTarget.src = "/lovable-uploads/a5f88509-5d42-4d11-8b7c-6abe9e64cfd0.png";
                }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hidden sm:block">
              {name}
            </span>
          </button>
          
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(link.href)}
                className="relative text-slate-300 hover:text-blue-400 transition-all duration-300 font-medium group py-2 font-orbitron text-sm lg:text-base"
              >
                {link.title}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 lg:px-6 py-2 font-medium transition-all duration-300 hover:scale-105 font-orbitron text-sm lg:text-base border-0" 
              onClick={() => handleNavClick('#contact')}
            >
              <span className="relative z-10">Hire Me</span>
            </Button>
          </nav>
          
          <button
            className="md:hidden text-blue-400 hover:text-white transition-colors p-2 rounded-lg border border-blue-500/30 hover:border-blue-400 hover:bg-blue-500/10"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu size={20} />
          </button>
          
          {/* Mobile Menu */}
          <div
            className={`fixed inset-0 bg-slate-900/98 backdrop-blur-xl z-50 flex flex-col p-6 md:hidden transition-all duration-500 ease-out ${
              isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
          >
            <div className="flex justify-between items-center mb-8">
              <button 
                onClick={() => handleNavClick('#')}
                className="flex items-center gap-3 text-xl font-bold font-orbitron"
              >
                <img 
                  src={logo} 
                  alt="Site Logo" 
                  className="h-8 w-8 object-cover rounded-full border-2 border-blue-500 shadow-lg" 
                />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  {name}
                </span>
              </button>
              <button
                className="text-blue-400 hover:text-white transition-colors p-2 rounded-lg border border-blue-500/30 hover:border-blue-400 hover:bg-blue-500/10"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close mobile menu"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex flex-col space-y-6">
              {navLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleNavClick(link.href)}
                  className="text-lg text-slate-300 hover:text-blue-400 transition-all duration-300 font-medium py-3 border-b border-slate-700/30 hover:border-blue-400/50 font-orbitron text-left"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {link.title}
                </button>
              ))}
              <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white w-full mt-6 py-3 font-medium font-orbitron border-0"
                onClick={() => handleNavClick('#contact')}
              >
                <span className="relative z-10">Hire Me</span>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
