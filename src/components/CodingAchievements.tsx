
import { useState, useEffect } from "react";
import { Trophy, Code, Target, Zap, Award, Star } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const CodingAchievements = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('achievements');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Mock achievements data
    setAchievements([
      {
        id: '1',
        title: 'Problem Solver',
        description: 'Solved 500+ coding problems',
        icon: Target,
        progress: 523,
        maxProgress: 500,
        isUnlocked: true,
        rarity: 'epic'
      },
      {
        id: '2',
        title: 'Code Warrior',
        description: 'Completed 50+ projects',
        icon: Code,
        progress: 47,
        maxProgress: 50,
        isUnlocked: false,
        rarity: 'rare'
      },
      {
        id: '3',
        title: 'Speed Demon',
        description: 'Solved 10 problems in one day',
        icon: Zap,
        progress: 10,
        maxProgress: 10,
        isUnlocked: true,
        rarity: 'legendary'
      },
      {
        id: '4',
        title: 'Consistency King',
        description: 'Coded for 100 days straight',
        icon: Trophy,
        progress: 120,
        maxProgress: 100,
        isUnlocked: true,
        rarity: 'epic'
      },
      {
        id: '5',
        title: 'Language Master',
        description: 'Proficient in 5+ languages',
        icon: Star,
        progress: 8,
        maxProgress: 5,
        isUnlocked: true,
        rarity: 'rare'
      },
      {
        id: '6',
        title: 'Open Source Hero',
        description: 'Contributed to 20+ repositories',
        icon: Award,
        progress: 15,
        maxProgress: 20,
        isUnlocked: false,
        rarity: 'epic'
      }
    ]);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'rare': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400/50';
      case 'epic': return 'border-purple-500/50';
      case 'rare': return 'border-blue-500/50';
      default: return 'border-gray-500/50';
    }
  };

  const AchievementCard = ({ achievement, index }: { achievement: Achievement, index: number }) => (
    <div
      className={`glass-card-enhanced p-6 relative overflow-hidden group ${getRarityBorder(achievement.rarity)} ${
        !achievement.isUnlocked ? 'opacity-60' : ''
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {achievement.isUnlocked && (
        <div className="absolute top-4 right-4">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} animate-pulse`} />
        </div>
      )}
      
      <div className="flex items-center mb-4">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
          <achievement.icon className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{achievement.title}</h3>
          <p className="text-gray-300 text-sm">{achievement.description}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="text-purple-400 font-semibold">
            {achievement.progress}/{achievement.maxProgress}
          </span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-full transition-all duration-1000 ease-out`}
            style={{
              width: isVisible ? `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%` : '0%',
              transitionDelay: `${index * 200}ms`
            }}
          />
        </div>
      </div>

      {achievement.isUnlocked && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
    </div>
  );

  return (
    <section id="achievements" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-4xl mx-auto text-center mb-16 ${isVisible ? 'reveal active' : 'reveal'}`}>
          <h2 className="section-title">Coding Achievements</h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mt-6">
            Milestones and accomplishments in my coding journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {achievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              index={index}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="glass-card-enhanced p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text mb-1">
                  {achievements.filter(a => a.isUnlocked).length}
                </div>
                <p className="text-gray-300 text-sm">Unlocked</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text mb-1">
                  {Math.round((achievements.filter(a => a.isUnlocked).length / achievements.length) * 100)}%
                </div>
                <p className="text-gray-300 text-sm">Completion</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text mb-1">
                  {achievements.filter(a => a.rarity === 'legendary').length}
                </div>
                <p className="text-gray-300 text-sm">Legendary</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodingAchievements;
