
import { useEffect, useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

const SkillsRadar = () => {
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

    const section = document.getElementById('skills-radar');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const skillsData = [
    { skill: 'Frontend', level: 90, fullMark: 100 },
    { skill: 'Backend', level: 85, fullMark: 100 },
    { skill: 'Database', level: 80, fullMark: 100 },
    { skill: 'DevOps', level: 70, fullMark: 100 },
    { skill: 'Mobile', level: 75, fullMark: 100 },
    { skill: 'AI/ML', level: 85, fullMark: 100 },
  ];

  return (
    <section id="skills-radar" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-4xl mx-auto text-center mb-16 ${isVisible ? 'reveal active' : 'reveal'}`}>
          <h2 className="section-title">Skills Overview</h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mt-6">
            A comprehensive view of my technical competencies across different domains
          </p>
        </div>

        <div className="glass-card-enhanced p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillsData}>
                  <PolarGrid stroke="rgba(139, 92, 246, 0.3)" />
                  <PolarAngleAxis 
                    dataKey="skill" 
                    className="text-gray-300 font-medium"
                    tick={{ fill: '#d1d5db', fontSize: 14 }}
                  />
                  <PolarRadiusAxis
                    angle={0}
                    domain={[0, 100]}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    tickCount={5}
                  />
                  <Radar
                    name="Skills"
                    dataKey="level"
                    stroke="url(#skillGradient)"
                    fill="url(#skillGradient)"
                    fillOpacity={0.3}
                    strokeWidth={3}
                  />
                  <defs>
                    <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-6">
              {skillsData.map((skill, index) => (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{skill.skill}</span>
                    <span className="text-purple-400 font-bold">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: isVisible ? `${skill.level}%` : '0%',
                        transitionDelay: `${index * 200}ms`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsRadar;
