
import { useState, useEffect, useRef } from "react";

interface Skill {
  name: string;
  category: string;
  level: number;
}

const skillData: Skill[] = [
  { name: "Python", category: "Programming Languages", level: 90 },
  { name: "JavaScript", category: "Programming Languages", level: 85 },
  { name: "Java", category: "Programming Languages", level: 75 },
  { name: "C", category: "Programming Languages", level: 70 },
  { name: "MySQL", category: "Databases", level: 80 },
  { name: "Firebase", category: "Databases", level: 75 },
  { name: "MongoDB", category: "Databases", level: 70 },
  { name: "HTML", category: "Web Development", level: 95 },
  { name: "CSS", category: "Web Development", level: 90 },
  { name: "React.js", category: "Web Development", level: 85 },
  { name: "Node.js", category: "Web Development", level: 80 },
  { name: "Git", category: "Tools & Platforms", level: 85 },
  { name: "VS Code", category: "Tools & Platforms", level: 95 },
  { name: "Figma", category: "Tools & Platforms", level: 75 },
  { name: "Canva", category: "Tools & Platforms", level: 90 },
  { name: "Data Structures", category: "Technical Skills", level: 85 },
  { name: "Algorithms", category: "Technical Skills", level: 80 },
  { name: "AI Prompting", category: "AI & ML", level: 90 },
  { name: "OpenAI/Gemini APIs", category: "AI & ML", level: 85 },
  { name: "Machine Learning", category: "AI & ML", level: 75 },
  { name: "Team Leadership", category: "Soft Skills", level: 90 },
  { name: "Communication", category: "Soft Skills", level: 85 },
  { name: "Project Coordination", category: "Soft Skills", level: 90 },
  { name: "Public Speaking", category: "Soft Skills", level: 80 },
];

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>(skillData);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  const categories = ["All", ...Array.from(new Set(skillData.map(skill => skill.category)))];
  
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredSkills(skillData);
    } else {
      setFilteredSkills(skillData.filter(skill => skill.category === activeCategory));
    }
  }, [activeCategory]);
  
  // Intersection Observer to trigger animations when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Reset animation when category changes
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  return (
    <section ref={sectionRef} id="skills" className="py-16 md:py-24 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-portfolio-purple/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-portfolio-teal/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 gradient-text"
            style={{ textShadow: 'var(--text-glow)' }}
          >
            My Skills
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-portfolio-purple to-portfolio-teal mx-auto mb-8 rounded-full"
            style={{ boxShadow: 'var(--border-glow)' }}
          ></div>
          <p className="text-gray-300 text-lg leading-relaxed">
            I've acquired a diverse set of skills throughout my education and projects. 
            Here's a comprehensive list of my technical and professional competencies.
          </p>
        </div>
        
        <div className="mb-12 overflow-x-auto reveal">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 min-w-max px-4">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-500 hover:scale-105 ${
                  activeCategory === category 
                  ? "bg-gradient-to-r from-portfolio-purple to-portfolio-teal text-white shadow-lg border-2 border-white/30" 
                  : "bg-white/10 backdrop-blur-sm hover:bg-white/20 text-gray-300 border border-gray-600 hover:border-white/50"
                }`}
                style={{
                  boxShadow: activeCategory === category ? 'var(--border-glow)' : 'none',
                  textShadow: activeCategory === category ? 'var(--text-glow)' : 'none'
                }}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
          {filteredSkills.map((skill, index) => (
            <div 
              key={`${skill.name}-${activeCategory}`}
              className={`relative group p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-gray-600/50 hover:bg-white/10 hover:border-white/30 transition-all duration-700 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-portfolio-purple/10 to-portfolio-teal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                style={{ filter: 'blur(10px)' }}
              ></div>
              
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg text-white group-hover:text-portfolio-purple transition-colors duration-300"
                  style={{ textShadow: 'var(--text-glow)' }}
                >
                  {skill.name}
                </h3>
                <span className="text-sm font-bold text-portfolio-teal px-2 py-1 rounded-full bg-portfolio-teal/20 border border-portfolio-teal/30">
                  {skill.level}%
                </span>
              </div>
              
              {/* Progress Bar Container */}
              <div className="w-full bg-gray-800/50 rounded-full h-3 mb-3 overflow-hidden border border-gray-700/50">
                <div 
                  className="h-full rounded-full transition-all duration-2000 ease-out relative overflow-hidden"
                  style={{ 
                    width: isVisible ? `${skill.level}%` : '0%',
                    background: `linear-gradient(90deg, var(--portfolio-purple), var(--portfolio-teal))`,
                    boxShadow: 'var(--border-glow)',
                    transitionDelay: `${index * 100 + 200}ms`
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
                </div>
              </div>
              
              <p className="text-xs text-gray-400 mt-2 group-hover:text-gray-300 transition-colors">
                {skill.category}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
