
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

  const navLinks = [
    { title: "Home", href: "#" },
    { title: "About", href: "#about" },
    { title: "Skills", href: "#skills" },
    { title: "Projects", href: "#projects" },
    { title: "Contact", href: "#contact" },
  ];

  const logo = settings.site_logo || "/lovable-uploads/a5f88509-5d42-4d11-8b7c-6abe9e64cfd0.png";
  const name = settings.site_name || "Portfolio";

  if (loading) {
    return (
      <header className="fixed top-0 left-0 w-full z-50 h-20 bg-gray-900/95 backdrop-blur-xl border-b border-purple-500/20">
        <div className="container mx-auto px-6 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="animate-pulse h-10 w-32 bg-gray-700/50 rounded"></div>
            <div className="animate-pulse h-10 w-24 bg-gray-700/50 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrollPosition > 50
          ? "h-16 bg-gray-900/98 backdrop-blur-xl shadow-2xl border-b border-purple-500/30"
          : "h-20 bg-gray-900/90 backdrop-blur-md border-b border-purple-500/10"
      }`}
    >
      <div className="container mx-auto px-6 h-full">
        <div className="flex justify-between items-center h-full">
          <a
            href="#"
            className="flex items-center gap-3 text-2xl md:text-3xl font-bold font-orbitron transition-all duration-300 hover:scale-105 group"
            aria-label="Homepage"
          >
            <div className="relative">
              <img
                src={logo}
                alt="Site Logo"
                className="h-10 w-10 object-contain rounded-full border-2 border-purple-500/50 group-hover:border-purple-400 shadow-lg bg-white/10 backdrop-blur transition-all duration-300 group-hover:shadow-purple-500/25"
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {name}
            </span>
          </a>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="relative text-gray-300 hover:text-purple-400 transition-all duration-300 font-medium group py-2 font-orbitron"
              >
                {link.title}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                <div className="absolute inset-0 bg-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            ))}
            <Button 
              className="cyber-button px-6 py-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 font-orbitron" 
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  const headerOffset = 100;
                  const elementPosition = contactSection.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                }
              }}
            >
              <span className="relative z-10">Hire Me</span>
            </Button>
          </nav>
          
          <button
            className="md:hidden text-purple-400 hover:text-white transition-colors p-2 rounded-lg border border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/10"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu size={24} />
          </button>
          
          {/* Enhanced Mobile Menu */}
          <div
            className={`fixed inset-0 bg-gray-900/98 backdrop-blur-xl z-50 flex flex-col p-8 md:hidden transition-all duration-500 ease-out ${
              isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
          >
            <div className="flex justify-between items-center mb-12">
              <a href="#" className="flex items-center gap-3 text-2xl font-bold font-orbitron">
                <img 
                  src={logo} 
                  alt="Site Logo" 
                  className="h-10 w-10 object-contain rounded-full border-2 border-purple-500 bg-white/10 shadow-lg" 
                />
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {name}
                </span>
              </a>
              <button
                className="text-purple-400 hover:text-white transition-colors p-2 rounded-lg border border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/10"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close mobile menu"
              >
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex flex-col space-y-8">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-xl text-gray-300 hover:text-purple-400 transition-all duration-300 font-medium py-3 border-b border-purple-500/20 hover:border-purple-400/50 animate-fade-in font-orbitron"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {link.title}
                </a>
              ))}
              <Button
                className="cyber-button w-full mt-8 py-3 font-medium font-orbitron"
                onClick={() => {
                  setIsMenuOpen(false);
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    const headerOffset = 100;
                    const elementPosition = contactSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
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
