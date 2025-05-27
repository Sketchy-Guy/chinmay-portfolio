
import { useState, useEffect } from "react";
import Skills3D from "./3d/Skills3D";

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
  { name: "Data Structures", category: "Technical Skills", level: 85 },
  { name: "Algorithms", category: "Technical Skills", level: 80 },
  { name: "AI Prompting", category: "AI & ML", level: 90 },
  { name: "OpenAI APIs", category: "AI & ML", level: 85 },
  { name: "Machine Learning", category: "AI & ML", level: 75 },
  { name: "Team Leadership", category: "Soft Skills", level: 90 },
  { name: "Communication", category: "Soft Skills", level: 85 },
];

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>(skillData);
  const [view3D, setView3D] = useState(true);
  
  const categories = ["All", ...Array.from(new Set(skillData.map(skill => skill.category)))];
  
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredSkills(skillData);
    } else {
      setFilteredSkills(skillData.filter(skill => skill.category === activeCategory));
    }
  }, [activeCategory]);

  return (
    <section id="skills" className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">My Skills</h2>
          <div className="w-20 h-1 bg-portfolio-teal mx-auto mb-8 rounded-full"></div>
          <p className="text-gray-300">
            Explore my skills in an interactive 3D space. Click and drag to navigate, click on spheres to learn more.
          </p>
        </div>
        
        <div className="mb-10 flex flex-wrap justify-center gap-4 reveal">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              view3D 
              ? "bg-portfolio-purple text-white shadow-lg shadow-purple-500/25" 
              : "bg-white/10 backdrop-blur-sm hover:bg-white/20 text-gray-300 border border-gray-600"
            }`}
            onClick={() => setView3D(!view3D)}
          >
            {view3D ? "3D View" : "List View"}
          </button>
          
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category 
                ? "bg-portfolio-teal text-white shadow-lg shadow-teal-500/25" 
                : "bg-white/10 backdrop-blur-sm hover:bg-white/20 text-gray-300 border border-gray-600"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {view3D ? (
          <div className="reveal">
            <Skills3D skills={filteredSkills} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
            {filteredSkills.map((skill, index) => (
              <div 
                key={index}
                className="glass-card p-6 backdrop-blur-sm bg-white/10 border border-gray-600 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg text-white">{skill.name}</h3>
                  <span className="text-sm font-medium text-portfolio-purple">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-portfolio-purple to-portfolio-teal h-2.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{skill.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
