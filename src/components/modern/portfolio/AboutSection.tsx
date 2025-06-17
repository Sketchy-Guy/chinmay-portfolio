
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Palette, Zap, Users } from 'lucide-react';

/**
 * Modern About Section Component
 * Displays personal information, highlights, and key strengths
 * Features: Animated cards, skill highlights, responsive grid layout
 */
const AboutSection = () => {
  // Core strengths data with icons and descriptions
  const strengths = [
    {
      icon: Code,
      title: 'Full Stack Development',
      description: 'Expert in React, Node.js, Python, and modern web technologies',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Creating intuitive and beautiful user experiences',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Building fast, scalable, and efficient applications',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Leading projects and mentoring developers',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  // Technical expertise areas
  const expertise = [
    'React & Next.js', 'Node.js & Express', 'Python & Django',
    'TypeScript', 'PostgreSQL', 'MongoDB', 'AWS & Docker',
    'GraphQL', 'React Native', 'AI/ML Integration'
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-900/50 via-purple-900/10 to-gray-900/50 relative">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-orbitron">
            About <span className="holographic-text">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mb-8"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Personal introduction */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="futuristic-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6 font-orbitron">
                  Passionate Developer & Innovator
                </h3>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    With over 5 years of experience in full-stack development, I specialize in 
                    creating scalable web applications that combine cutting-edge technology with 
                    exceptional user experiences.
                  </p>
                  <p>
                    My journey in software development has led me through various domains including 
                    e-commerce, fintech, and AI-powered applications. I'm passionate about writing 
                    clean, maintainable code and staying updated with the latest industry trends.
                  </p>
                  <p>
                    When I'm not coding, you'll find me contributing to open-source projects, 
                    mentoring junior developers, or exploring new technologies that can solve 
                    real-world problems.
                  </p>
                </div>

                {/* Technical expertise tags */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4">Technical Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {expertise.map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Badge 
                          variant="outline" 
                          className="bg-purple-500/20 border-purple-400/30 text-purple-300 hover:bg-purple-500/30 transition-colors"
                        >
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Core strengths grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {strengths.map((strength, index) => (
              <motion.div
                key={strength.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="futuristic-card h-full group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${strength.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <strength.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 font-orbitron">
                      {strength.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {strength.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Statistics section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { number: '50+', label: 'Projects Completed' },
              { number: '5+', label: 'Years Experience' },
              { number: '100+', label: 'Happy Clients' },
              { number: '24/7', label: 'Support Available' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-orbitron">
                  <span className="holographic-text">{stat.number}</span>
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
