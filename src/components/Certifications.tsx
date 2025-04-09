
import { useState } from "react";
import { ExternalLink, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Certification {
  title: string;
  issuer: string;
  date: string;
  credential: string;
  link?: string;
  logo: string;
}

const certificationsData: Certification[] = [
  {
    title: "Crash Course on Python",
    issuer: "Google",
    date: "Jun 2024",
    credential: "JA55X9WMWGYK",
    link: "https://coursera.org/verify/JA55X9WMWGYK",
    logo: "/lovable-uploads/f9f301cf-7ee5-4609-845e-2f2afc316a9a.png",
  },
  {
    title: "Python for Data Science",
    issuer: "IBM",
    date: "In Progress",
    credential: "In Progress",
    logo: "/lovable-uploads/bb075ae5-f91f-43e6-b800-4ad15066260c.png",
  },
  {
    title: "Microsoft Cybersecurity Analyst",
    issuer: "Microsoft",
    date: "In Progress",
    credential: "In Progress",
    logo: "/lovable-uploads/84ae8bec-4c2f-4a49-94cf-34673064b572.png",
  },
];

const Certifications = () => {
  const [hoveredCert, setHoveredCert] = useState<string | null>(null);

  return (
    <section id="certifications" className="py-16 md:py-24 bg-gradient-to-b from-white to-portfolio-soft-teal/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Certifications</h2>
          <div className="w-20 h-1 bg-portfolio-teal mx-auto mb-8 rounded-full"></div>
          <p className="text-gray-700 dark:text-gray-300">
            I believe in continuous learning. Here are some professional certifications I've earned.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificationsData.map((cert, index) => (
            <div 
              key={index}
              className={`glass-card p-6 transition-all duration-300 hover:shadow-xl reveal ${
                hoveredCert === cert.title ? 'scale-[1.03]' : 'scale-100'
              }`}
              onMouseEnter={() => setHoveredCert(cert.title)}
              onMouseLeave={() => setHoveredCert(null)}
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2 mr-4 shadow-md">
                  <img 
                    src={cert.logo} 
                    alt={cert.issuer}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-portfolio-purple">{cert.title}</h3>
                  <p className="text-gray-600">{cert.issuer}</p>
                </div>
              </div>
              
              <div className="border-l-4 border-portfolio-teal pl-4 py-2 mb-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Issued: {cert.date}</span>
                  <span className="text-sm text-gray-500">Credential ID: {cert.credential}</span>
                </div>
              </div>
              
              {cert.link && (
                <Button 
                  variant="outline" 
                  className="w-full border-portfolio-teal text-portfolio-teal hover:bg-portfolio-teal hover:text-white"
                  asChild
                >
                  <a href={cert.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> View Certificate
                  </a>
                </Button>
              )}
              
              {!cert.link && (
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-500 cursor-not-allowed"
                  disabled
                >
                  <Award className="mr-2 h-4 w-4" /> In Progress
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
