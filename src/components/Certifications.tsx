
import { useState, useEffect } from "react";
import { ExternalLink, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolioData } from "@/contexts/DataContext";
import { CertificationData } from "@/types/portfolio";

const CertificationCard = ({ certification, isHovered, onHover, onLeaveHover, index }: {
  certification: CertificationData,
  isHovered: boolean,
  onHover: () => void,
  onLeaveHover: () => void,
  index: number
}) => {
  return (
    <div 
      className={`glass-card-hover p-8 group transition-all duration-700 ease-out reveal-stagger ${
        isHovered ? 'scale-[1.02] -translate-y-2' : ''
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={onHover}
      onMouseLeave={onLeaveHover}
    >
      {/* Card header with logo and title */}
      <div className="flex items-center mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-3 mr-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
            <img 
              src={certification.logo} 
              alt={certification.issuer}
              className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
            />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-portfolio-purple to-portfolio-teal rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Star className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-portfolio-purple group-hover:to-portfolio-teal transition-all duration-500">
            {certification.title}
          </h3>
          <p className="text-gray-300 font-medium group-hover:text-gray-200 transition-colors duration-300">
            {certification.issuer}
          </p>
        </div>
      </div>
      
      {/* Certification details */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6 border-l-4 border-gradient-to-b from-portfolio-purple to-portfolio-teal group-hover:bg-white/10 transition-all duration-500">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-portfolio-teal animate-pulse"></div>
            <span className="text-sm text-gray-300">
              <span className="text-portfolio-teal font-semibold">Issued:</span> {certification.date}
            </span>
          </div>
          {certification.credential && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-portfolio-purple animate-pulse"></div>
              <span className="text-sm text-gray-300">
                <span className="text-portfolio-purple font-semibold">ID:</span> {certification.credential}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Action button */}
      {certification.link ? (
        <Button 
          className="w-full btn-primary group-hover:scale-105 transition-all duration-300"
          asChild
        >
          <a href={certification.link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" /> 
            View Certificate
          </a>
        </Button>
      ) : (
        <Button 
          className="w-full bg-white/5 border-2 border-white/20 text-gray-400 hover:text-white hover:border-portfolio-teal hover:bg-portfolio-teal/20 transition-all duration-500 cursor-not-allowed"
          disabled
        >
          <Award className="mr-2 h-5 w-5" /> 
          In Progress
        </Button>
      )}
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-portfolio-purple/5 via-transparent to-portfolio-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
    </div>
  );
};

const Certifications = () => {
  const { data } = usePortfolioData();
  const [hoveredCert, setHoveredCert] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('certifications');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="certifications" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-portfolio-purple/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-r from-portfolio-teal/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className={`max-w-4xl mx-auto text-center mb-20 ${isVisible ? 'reveal active' : 'reveal'}`}>
          <h2 className="section-title">Professional Certifications</h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mt-6">
            Continuous learning and professional development through industry-recognized certifications 
            that validate my expertise and commitment to excellence.
          </p>
          
          {/* Decorative elements */}
          <div className="flex items-center justify-center mt-8 gap-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-portfolio-purple"></div>
            <div className="w-3 h-3 rounded-full bg-portfolio-purple animate-pulse"></div>
            <div className="w-24 h-px bg-gradient-to-r from-portfolio-purple to-portfolio-teal"></div>
            <div className="w-3 h-3 rounded-full bg-portfolio-teal animate-pulse"></div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-portfolio-teal"></div>
          </div>
        </div>
        
        {/* Certifications grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {data.certifications.map((cert, index) => (
            <CertificationCard 
              key={cert.id}
              certification={cert}
              isHovered={hoveredCert === cert.id}
              onHover={() => setHoveredCert(cert.id)}
              onLeaveHover={() => setHoveredCert(null)}
              index={index}
            />
          ))}
        </div>
        
        {/* Stats section */}
        <div className={`mt-20 text-center ${isVisible ? 'reveal-stagger active' : 'reveal-stagger'}`} style={{ animationDelay: '0.8s' }}>
          <div className="glass-card p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">
                  {data.certifications.length}+
                </div>
                <p className="text-gray-300">Certifications Earned</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">
                  {new Set(data.certifications.map(cert => cert.issuer)).size}+
                </div>
                <p className="text-gray-300">Trusted Providers</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">
                  {data.certifications.filter(cert => cert.link).length}
                </div>
                <p className="text-gray-300">Verified Credentials</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
