import { useState, useEffect } from "react";
import { Trophy, Target, Zap, Star, Award, Code, Medal, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

// Interface for achievement data structure
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  progress: number;
  max_progress: number;
  is_unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlock_date?: string;
}

const CodingAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Set up intersection observer for animations
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

  // Fetch achievements from database
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .order('is_unlocked', { ascending: false })
          .order('rarity', { ascending: false });

        if (error) throw error;

        // Type-safe conversion of database data to Achievement interface
        const typedAchievements: Achievement[] = (data || []).map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          icon: item.icon || 'Trophy',
          category: item.category,
          progress: item.progress || 0,
          max_progress: item.max_progress,
          is_unlocked: item.is_unlocked || false,
          rarity: (item.rarity as 'common' | 'rare' | 'epic' | 'legendary') || 'common',
          unlock_date: item.unlock_date || undefined
        }));

        setAchievements(typedAchievements);
      } catch (error) {
        console.error('Error fetching achievements:', error);
        // Set default achievements as fallback
        setAchievements([
          {
            id: '1',
            title: 'Problem Solver',
            description: 'Solved 500+ coding problems',
            icon: 'Target',
            category: 'coding',
            progress: 523,
            max_progress: 500,
            is_unlocked: true,
            rarity: 'epic'
          },
          {
            id: '2',
            title: 'Code Warrior',
            description: 'Completed 50+ projects',
            icon: 'Code',
            category: 'project',
            progress: 47,
            max_progress: 50,
            is_unlocked: false,
            rarity: 'rare'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // Map icon names to actual icon components
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Trophy, Target, Zap, Star, Award, Code, Medal, Crown
    };
    return icons[iconName] || Trophy;
  };

  // Get rarity colors and effects
  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          gradient: 'from-yellow-400 via-orange-500 to-red-500',
          glow: 'shadow-yellow-500/25',
          border: 'border-yellow-400/50',
          text: 'text-yellow-400'
        };
      case 'epic':
        return {
          gradient: 'from-purple-400 via-pink-500 to-purple-600',
          glow: 'shadow-purple-500/25',
          border: 'border-purple-400/50',
          text: 'text-purple-400'
        };
      case 'rare':
        return {
          gradient: 'from-blue-400 via-cyan-500 to-blue-600',
          glow: 'shadow-blue-500/25',
          border: 'border-blue-400/50',
          text: 'text-blue-400'
        };
      default:
        return {
          gradient: 'from-gray-400 via-gray-500 to-gray-600',
          glow: 'shadow-gray-500/25',
          border: 'border-gray-400/50',
          text: 'text-gray-400'
        };
    }
  };

  // Calculate overall progress
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.is_unlocked).length;
  const completionPercentage = totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0;

  // Achievement card component
  const AchievementCard = ({ achievement, index }: { achievement: Achievement, index: number }) => {
    const Icon = getIconComponent(achievement.icon);
    const styles = getRarityStyles(achievement.rarity);
    const progressPercentage = (achievement.progress / achievement.max_progress) * 100;

    return (
      <Card className={`glass-card-enhanced group relative overflow-hidden transition-all duration-500 hover:scale-105 ${
        achievement.is_unlocked ? `${styles.glow} ${styles.border}` : 'opacity-75'
      } ${isVisible ? 'reveal-stagger active' : 'reveal-stagger'}`}
      style={{ animationDelay: `${index * 100}ms` }}>
        
        {/* Rarity indicator */}
        <div className={`absolute top-0 right-0 p-2`}>
          <Badge variant="outline" className={`${styles.text} ${styles.border} bg-black/50 backdrop-blur-sm`}>
            {achievement.rarity}
          </Badge>
        </div>

        {/* Achievement content */}
        <CardContent className="p-6 text-center">
          {/* Icon with gradient background */}
          <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${styles.gradient} 
            flex items-center justify-center group-hover:scale-110 transition-transform duration-300
            ${achievement.is_unlocked ? 'shadow-lg' : 'grayscale'}`}>
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Achievement title */}
          <h3 className={`text-lg font-bold mb-2 ${achievement.is_unlocked ? 'text-white' : 'text-gray-400'}`}>
            {achievement.title}
          </h3>

          {/* Achievement description */}
          <p className={`text-sm mb-4 ${achievement.is_unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
            {achievement.description}
          </p>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className={achievement.is_unlocked ? 'text-gray-300' : 'text-gray-500'}>
                Progress
              </span>
              <span className={`font-medium ${styles.text}`}>
                {achievement.progress}/{achievement.max_progress}
              </span>
            </div>
            
            <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${styles.gradient} transition-all duration-1000 ease-out`}
                style={{
                  width: `${Math.min(progressPercentage, 100)}%`,
                  transitionDelay: `${index * 200}ms`
                }}
              />
            </div>
          </div>

          {/* Unlock status */}
          {achievement.is_unlocked && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Trophy className={`w-4 h-4 ${styles.text}`} />
              <span className={`text-xs font-medium ${styles.text}`}>
                Unlocked!
              </span>
            </div>
          )}
        </CardContent>

        {/* Shine effect for unlocked achievements */}
        {achievement.is_unlocked && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
            -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        )}
      </Card>
    );
  };

  if (isLoading) {
    return (
      <section id="achievements" className="py-24 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="loading-skeleton h-12 w-64 mx-auto mb-4"></div>
            <div className="loading-skeleton h-6 w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="achievements" className="py-24 md:py-32 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      <div className="absolute top-20 right-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className={`max-w-4xl mx-auto text-center mb-16 ${isVisible ? 'reveal active' : 'reveal'}`}>
          <h2 className="section-title">Coding Achievements</h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mt-6">
            Milestones and accomplishments that showcase my dedication to continuous learning and growth
          </p>
          
          {/* Overall progress indicator */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Overall Progress</span>
              <span className="text-purple-400 font-medium">
                {unlockedAchievements}/{totalAchievements} Unlocked
              </span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-1000 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {completionPercentage.toFixed(0)}% Complete
            </p>
          </div>
        </div>

        {/* Achievement cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {achievements.map((achievement, index) => (
            <AchievementCard 
              key={achievement.id} 
              achievement={achievement} 
              index={index}
            />
          ))}
        </div>

        {/* Call to action */}
        {unlockedAchievements < totalAchievements && (
          <div className="text-center mt-12">
            <p className="text-gray-300 mb-4">
              Keep exploring to unlock more achievements!
            </p>
            <div className="flex justify-center gap-2">
              {[...Array(totalAchievements - unlockedAchievements)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-gray-600 rounded-full animate-pulse" 
                     style={{ animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CodingAchievements;
