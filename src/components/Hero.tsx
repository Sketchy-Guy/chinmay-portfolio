
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Github, Linkedin, Mail, Twitter, Instagram, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Hero = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Software Developer | Python | AI | JavaScript";
  const { toast } = useToast();
  
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    
    return () => clearInterval(typingInterval);
  }, []);
  
  const handleDownloadCV = () => {
    // This would be a real download in a production environment
    toast({
      title: "CV Downloaded",
      description: "Your CV has been downloaded successfully!",
    });
  };
  
  const socialLinks = [
    { icon: Github, href: "https://github.com/chinmaykumarpanda", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/chinmay-kumar-panda", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Mail, href: "mailto:chinmaykumarpanda004@gmail.com", label: "Email" },
  ];

  return (
    <section className="min-h-screen flex flex-col justify-center pt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 animate-fade-in">
            <h3 className="text-2xl font-medium text-portfolio-teal mb-2">Hello, I'm</h3>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 gradient-text">Chinmay Kumar Panda</h1>
            <h2 className="text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300 mb-6 h-6">
              {typedText}
              <span className="ml-1 inline-block w-2 h-full bg-portfolio-purple animate-pulse"></span>
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-lg">
              Aspiring software developer with expertise in Python, JavaScript, and AI. 
              Passionate about building scalable applications and leveraging AI tools to improve productivity.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href}
                  aria-label={link.label}
                  className="social-icon"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <link.icon size={20} />
                </a>
              ))}
            </div>
            
            <div className="flex gap-4">
              <Button 
                className="bg-portfolio-purple hover:bg-portfolio-purple/90"
                onClick={handleDownloadCV}
              >
                <Download className="mr-2 h-4 w-4" /> Download CV
              </Button>
              <Button variant="outline" className="border-portfolio-teal text-portfolio-teal hover:bg-portfolio-teal hover:text-white">
                <Mail className="mr-2 h-4 w-4" /> Contact Me
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="w-64 h-64 md:w-80 md:h-80 mx-auto relative z-10 animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-portfolio-purple to-portfolio-teal rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <img 
                src="/lovable-uploads/78295e37-4b4d-4900-b613-21ed6626ab3f.png" 
                alt="Chinmay Kumar Panda"
                className="rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md max-h-md">
              <div className="w-full h-full rounded-full bg-portfolio-purple opacity-5 animate-spin-slow blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
