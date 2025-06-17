
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Phone, Mail, MapPin, Globe, Github, Linkedin, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ContactInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  avatar?: string;
}

const ContactCard = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const contactInfo: ContactInfo = {
    name: "Chinmay Kumar Panda",
    title: "Full Stack Developer",
    email: "chinmaykumarpanda004@gmail.com",
    phone: "+91 123 456 7890",
    location: "India",
    website: "https://chinmay-portfolio.com",
    github: "https://github.com/chinmaykumarpanda",
    linkedin: "https://linkedin.com/in/chinmaykumarpanda"
  };

  const generateVCard = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${contactInfo.name}
TITLE:${contactInfo.title}
EMAIL:${contactInfo.email}
TEL:${contactInfo.phone}
ADR:;;${contactInfo.location};;;;
URL:${contactInfo.website}
NOTE:GitHub: ${contactInfo.github}\\nLinkedIn: ${contactInfo.linkedin}
END:VCARD`;
    
    return vCard;
  };

  const downloadVCard = async () => {
    try {
      setIsDownloading(true);
      
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const vCardData = generateVCard();
      const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${contactInfo.name.replace(/\s+/g, '_')}_Contact.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      setIsDownloaded(true);
      toast.success('Contact card downloaded successfully!');
      
      // Reset download state after 3 seconds
      setTimeout(() => {
        setIsDownloaded(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error downloading contact card:', error);
      toast.error('Failed to download contact card');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <Card className="bg-gradient-to-br from-gray-900/95 to-purple-900/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 overflow-hidden group">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <CardContent className="p-8 relative z-10">
          {/* Avatar */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold text-white">
                {contactInfo.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{contactInfo.name}</h3>
            <p className="text-purple-400 font-medium">{contactInfo.title}</p>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
              <Mail className="w-4 h-4 text-purple-400" />
              <span className="text-sm">{contactInfo.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
              <Phone className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">{contactInfo.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
              <MapPin className="w-4 h-4 text-green-400" />
              <span className="text-sm">{contactInfo.location}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-sm">{contactInfo.website}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-6">
            <a
              href={contactInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Github className="w-5 h-5 text-white" />
            </a>
            <a
              href={contactInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-cyan-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Linkedin className="w-5 h-5 text-white" />
            </a>
          </div>

          {/* Download Button */}
          <Button
            onClick={downloadVCard}
            disabled={isDownloading}
            className={`w-full transition-all duration-500 ${
              isDownloaded
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700'
            } text-white border-0 group/btn`}
          >
            <motion.div
              className="flex items-center justify-center gap-2"
              animate={isDownloading ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: isDownloading ? Infinity : 0 }}
            >
              {isDownloaded ? (
                <>
                  <Check className="w-4 h-4" />
                  Downloaded!
                </>
              ) : isDownloading ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 group-hover/btn:animate-bounce" />
                  Download Contact Card
                </>
              )}
            </motion.div>
          </Button>

          {/* Subtitle */}
          <p className="text-center text-xs text-gray-500 mt-3">
            Save to your contacts for easy access
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContactCard;
