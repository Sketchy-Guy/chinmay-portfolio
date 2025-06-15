
import { useState, useEffect } from "react";
import { ArrowDown, Download, MapPin, Mail, Phone, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolioData } from "@/contexts/DataContext";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { data, isLoading } = usePortfolioData();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const profile = data?.user || {
    name: "Your Name",
    title: "Full Stack Developer",
    bio: "Passionate about creating amazing web experiences",
    location: "San Francisco, CA",
    email: "hello@example.com",
    phone: "+1 (555) 123-4567",
    profileImage: null
  };

  const socialLinks = data?.user?.social ? [
    { platform: 'github', url: data.user.social.github },
    { platform: 'linkedin', url: data.user.social.linkedin },
    { platform: 'twitter', url: data.user.social.twitter }
  ].filter(link => link.url && link.url !== '#') : [];

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github': return Github;
      case 'linkedin': return Linkedin;
      case 'twitter': return Twitter;
      default: return Github;
    }
  };

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const downloadResume = () => {
    // Create a mock resume download
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'resume.pdf';
    link.click();
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900"></div>
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          
          {/* Profile Image - Fixed positioning */}
          <div className="mb-8 flex justify-center">
            <div className="relative z-10">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-purple-500/30 shadow-2xl">
                {isLoading ? (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 animate-pulse"></div>
                ) : profile.profileImage ? (
                  <img 
                    src={profile.profileImage} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-xl -z-10"></div>
            </div>
          </div>

          {/* Content */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-orbitron">
            <span className="gradient-text">{profile.name}</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-purple-400 mb-6 font-medium">
            {profile.title}
          </h2>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {profile.bio}
          </p>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-gray-400">
            {profile.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{profile.phone}</span>
              </div>
            )}
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex justify-center gap-4 mb-8">
              {socialLinks.map((link, index) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={scrollToAbout}
              className="cyber-button"
              size="lg"
            >
              Explore My Work
            </Button>
            
            <Button 
              onClick={downloadResume}
              variant="outline" 
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CV
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <button 
              onClick={scrollToAbout}
              className="text-purple-400 hover:text-purple-300 transition-colors"
              aria-label="Scroll to about section"
            >
              <ArrowDown className="w-6 h-6 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
