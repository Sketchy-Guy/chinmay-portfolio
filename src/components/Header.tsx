
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState as useReactState } from "react";

// Helper hook to get site logo from settings table
function useSiteLogo() {
  const [logoUrl, setLogoUrl] = useReactState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchLogo() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .eq("key", "site_logo")
        .maybeSingle();

      if (data?.value && typeof data.value === "string" && data.value.startsWith("/lovable-uploads/")) {
        if (mounted) setLogoUrl(data.value);
      } else {
        // fallback to default uploaded logo
        if (mounted) setLogoUrl("/lovable-uploads/a5f88509-5d42-4d11-8b7c-6abe9e64cfd0.png");
      }
    }
    fetchLogo();
    return () => {
      mounted = false;
    };
  }, []);
  return logoUrl;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const logoUrl = useSiteLogo();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { title: "Home", href: "#" },
    { title: "About", href: "#about" },
    { title: "Skills", href: "#skills" },
    { title: "Projects", href: "#projects" },
    { title: "Contact", href: "#contact" },
  ];
  
  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrollPosition > 50 
          ? "py-4 glass-morphism backdrop-blur-xl shadow-2xl border-b border-purple-500/20" 
          : "py-6 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <a 
            href="#" 
            className="flex items-center gap-2 text-2xl md:text-3xl font-bold font-orbitron transition-all duration-300 hover:scale-105"
            aria-label="Homepage"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Site Logo"
                className="h-10 w-10 object-contain rounded-full border-2 border-purple-500 shadow-md bg-white"
                loading="lazy"
              />
            ) : (
              <>
                <span className="holographic-text">CK</span>
                <span className="text-cyan-400">Panda</span>
              </>
            )}
          </a>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="relative text-gray-300 hover:text-white transition-all duration-300 font-medium group"
              >
                {link.title}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <Button className="cyber-button relative overflow-hidden" onClick={() => window.location.href = "#contact"}>
              <span className="relative z-10">Hire Me</span>
            </Button>
          </nav>
          
          <button 
            className="md:hidden text-purple-400 hover:text-white transition-colors p-2 rounded-lg border border-purple-500/30 hover:border-purple-400"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu size={24} />
          </button>
          
          {/* Enhanced Mobile Menu */}
          <div 
            className={`fixed inset-0 glass-morphism backdrop-blur-xl z-50 flex flex-col p-8 md:hidden transition-all duration-500 ease-out ${
              isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
          >
            <div className="flex justify-between items-center mb-12">
              <a href="#" className="flex items-center gap-2 text-2xl font-bold font-orbitron">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Site Logo"
                    className="h-10 w-10 object-contain rounded-full border-2 border-purple-500 bg-white shadow"
                  />
                ) : (
                  <>
                    <span className="holographic-text">CK</span>
                    <span className="text-cyan-400">Panda</span>
                  </>
                )}
              </a>
              <button 
                className="text-purple-400 hover:text-white transition-colors p-2 rounded-lg border border-purple-500/30 hover:border-purple-400"
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
                  className="text-xl text-gray-300 hover:text-white transition-all duration-300 font-medium py-3 border-b border-purple-500/20 hover:border-purple-400/50"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {link.title}
                </a>
              ))}
              <Button 
                className="cyber-button w-full mt-8"
                onClick={() => {
                  setIsMenuOpen(false);
                  window.location.href = "#contact";
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
