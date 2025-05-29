
import { useState, useEffect } from 'react';
import { Home, User, Code, Briefcase, Award, Mail } from 'lucide-react';

const FloatingNavigation = () => {
  const [activeSection, setActiveSection] = useState('hero');

  const navItems = [
    { id: 'hero', icon: Home, label: 'Home' },
    { id: 'about', icon: User, label: 'About' },
    { id: 'skills', icon: Code, label: 'Skills' },
    { id: 'projects', icon: Briefcase, label: 'Projects' },
    { id: 'certifications', icon: Award, label: 'Certs' },
    { id: 'contact', icon: Mail, label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50 animate-fade-in">
      <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-3 shadow-2xl">
        <div className="flex flex-col gap-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative p-3 rounded-xl transition-all duration-500 group ${
                  isActive
                    ? 'bg-gradient-to-r from-portfolio-purple to-portfolio-teal text-white scale-110'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="w-5 h-5" />
                
                {/* Tooltip */}
                <div className={`absolute left-full ml-4 px-3 py-2 bg-black/90 backdrop-blur-md rounded-lg text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 pointer-events-none ${
                  isActive ? 'opacity-100' : ''
                }`}>
                  {item.label}
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-portfolio-purple to-portfolio-teal rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default FloatingNavigation;
