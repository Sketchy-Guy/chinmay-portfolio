
import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
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
  
  const headerClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${
    isVisible ? 'translate-y-0' : '-translate-y-full'
  } ${
    scrollPosition > 50 
      ? "py-4 bg-black/80 backdrop-blur-lg shadow-2xl border-b border-white/10" 
      : "py-6 bg-transparent"
  }`;
  
  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a 
            href="#" 
            className="group flex items-center gap-2 text-2xl md:text-3xl font-bold transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <Sparkles className="w-6 h-6 text-portfolio-purple group-hover:animate-spin" />
              <div className="absolute inset-0 w-6 h-6 bg-portfolio-purple/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
            </div>
            <span className="gradient-text">
              CK<span className="text-portfolio-teal">Panda</span>
            </span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="relative group py-2 px-4 rounded-lg text-white/80 hover:text-white transition-all duration-300 hover:bg-white/5"
              >
                {link.title}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-portfolio-purple to-portfolio-teal transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </a>
            ))}
            
            <Button 
              className="btn-primary ml-4 group"
              onClick={() => window.location.href = "#contact"}
            >
              <Sparkles className="mr-2 h-4 w-4 group-hover:animate-spin" />
              Hire Me
            </Button>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu size={24} />
          </button>
          
          {/* Mobile Menu Overlay */}
          <div 
            className={`fixed inset-0 bg-black/90 backdrop-blur-lg z-50 md:hidden transition-all duration-500 ease-out ${
              isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <div 
              className={`h-full w-80 bg-black/90 backdrop-blur-xl border-r border-white/10 p-8 transition-transform duration-500 ease-out ${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Header */}
              <div className="flex justify-between items-center mb-12">
                <a href="#" className="flex items-center gap-2 text-2xl font-bold">
                  <Sparkles className="w-6 h-6 text-portfolio-purple" />
                  <span className="gradient-text">
                    CK<span className="text-portfolio-teal">Panda</span>
                  </span>
                </a>
                <button 
                  className="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close mobile menu"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Mobile Navigation */}
              <nav className="space-y-6">
                {navLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="block text-xl text-white/80 hover:text-white transition-all duration-300 py-3 px-4 rounded-lg hover:bg-white/10 border border-transparent hover:border-white/20"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {link.title}
                  </a>
                ))}
                
                <Button 
                  className="btn-primary w-full mt-8 group"
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
