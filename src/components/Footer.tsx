
import { Github, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: Github, href: "https://github.com/chinmaykumarpanda", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/chinmay-kumar-panda", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ];

  return (
    <footer className="bg-gray-900/95 backdrop-blur-xl border-t border-purple-500/20 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-4 gradient-text font-orbitron">Chinmay Kumar Panda</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Software Developer specializing in Python, JavaScript, and AI development. Creating innovative digital solutions with cutting-edge technologies.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-white hover:bg-purple-600 transition-all duration-300 group"
                >
                  <link.icon size={18} className="group-hover:scale-110 transition-transform duration-300" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4 font-orbitron">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "About", href: "#about" },
                { name: "Skills", href: "#skills" },
                { name: "Projects", href: "#projects" },
                { name: "Contact", href: "#contact" }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-300 relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4 font-orbitron">Contact Info</h3>
            <div className="space-y-3 text-gray-300">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Bhubaneswar, Odisha, India
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                chinmaykumarpanda004@gmail.com
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                +91 7815014638
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-purple-500/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0 font-orbitron">
            &copy; {currentYear} Chinmay Kumar Panda. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              Made with <span className="text-red-500 animate-pulse">❤️</span> by Chinmay Kumar Panda
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
