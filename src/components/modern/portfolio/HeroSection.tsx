
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Mail, Download } from 'lucide-react';

/**
 * Modern Hero Section Component
 * Displays the main landing section with animated background and call-to-actions
 * Features: Particle animation, responsive design, social links, CV download
 */
const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Initialize component visibility for animations
  useEffect(() => {
    setIsVisible(true);
  }, []);

  /**
   * Handle CV download functionality
   * Creates and downloads a placeholder CV file
   */
  const handleDownloadCV = () => {
    // This would typically fetch the actual CV file
    const link = document.createElement('a');
    link.href = '/path-to-cv.pdf'; // Replace with actual CV path
    link.download = 'Chinmay_Kumar_Panda_CV.pdf';
    link.click();
  };

  /**
   * Scroll to next section smoothly
   */
  const scrollToNext = () => {
    const nextSection = document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Animated background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading with staggered animation */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-orbitron">
              <span className="holographic-text">Chinmay Kumar</span>
              <br />
              <span className="gradient-text">Panda</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Full Stack Developer & AI Enthusiast crafting innovative digital experiences
            with cutting-edge technologies
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              onClick={handleDownloadCV}
              className="cyber-button px-8 py-4 text-lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download CV
            </Button>
            <Button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="btn-secondary px-8 py-4 text-lg"
            >
              <Mail className="mr-2 h-5 w-5" />
              Get In Touch
            </Button>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center gap-6 mb-16"
          >
            {[
              { icon: Github, href: 'https://github.com/chinmaykumarpanda', label: 'GitHub' },
              { icon: Linkedin, href: 'https://linkedin.com/in/chinmaykumarpanda', label: 'LinkedIn' },
              { icon: Mail, href: 'mailto:chinmaykumarpanda004@gmail.com', label: 'Email' }
            ].map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-purple-600 transition-all duration-300 hover:scale-110"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              >
                <social.icon className="w-6 h-6" />
              </motion.a>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-col items-center"
          >
            <Button
              onClick={scrollToNext}
              variant="ghost"
              className="text-white hover:text-purple-400 transition-colors"
            >
              <ArrowDown className="w-6 h-6 animate-bounce" />
            </Button>
            <span className="text-gray-400 text-sm mt-2">Scroll to explore</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
