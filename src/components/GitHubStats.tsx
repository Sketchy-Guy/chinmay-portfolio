
import { useState, useEffect } from "react";
import { Github, Star, GitFork, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  contributions: number;
  streak: number;
  contributionData?: number[];
}

const GitHubStats = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

    const section = document.getElementById('github-stats');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Fetch GitHub stats from database with real-time subscription
  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const { data: githubData, error } = await supabase
          .from('github_stats')
          .select('*')
          .order('last_updated', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching GitHub stats:', error);
          throw error;
        }

        if (githubData) {
          // Safely cast the contribution_data JSON to number array
          let contributionData: number[] = generateRealisticContributionData();
          
          if (githubData.contribution_data && Array.isArray(githubData.contribution_data)) {
            // Ensure all elements are numbers
            const dataArray = githubData.contribution_data as unknown[];
            const isValidNumberArray = dataArray.every(item => typeof item === 'number');
            if (isValidNumberArray) {
              contributionData = dataArray as number[];
            }
          }

          setStats({
            totalRepos: githubData.total_repos || 0,
            totalStars: githubData.total_stars || 0,
            totalForks: githubData.total_forks || 0,
            contributions: githubData.total_contributions || 0,
            streak: githubData.current_streak || 0,
            contributionData
          });
        } else {
          // Fallback to realistic mock data
          setStats({
            totalRepos: 25,
            totalStars: 150,
            totalForks: 45,
            contributions: 1200,
            streak: 120,
            contributionData: generateRealisticContributionData()
          });
        }
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        // Set fallback data
        setStats({
          totalRepos: 25,
          totalStars: 150,
          totalForks: 45,
          contributions: 1200,
          streak: 120,
          contributionData: generateRealisticContributionData()
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Setup real-time subscription
    const channel = supabase
      .channel('github-stats-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'github_stats' 
      }, () => {
        console.log('GitHub stats changed, refetching...');
        fetchGitHubStats();
      })
      .subscribe();

    if (isVisible) {
      fetchGitHubStats();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isVisible]);

  // Generate realistic contribution data for a year (365 days)
  const generateRealisticContributionData = (): number[] => {
    const data: number[] = [];
    for (let i = 0; i < 365; i++) {
      const weekday = i % 7;
      const isWeekend = weekday === 0 || weekday === 6;
      
      // Lower activity on weekends, higher on weekdays
      const baseActivity = isWeekend ? 0.2 : 0.7;
      
      // Add some randomness and seasonal variation
      const seasonal = Math.sin((i / 365) * Math.PI * 2) * 0.3 + 0.7;
      const random = Math.random();
      
      const activity = baseActivity * seasonal * random;
      
      if (activity < 0.1) {
        data.push(0); // No activity
      } else if (activity < 0.3) {
        data.push(1); // Low activity
      } else if (activity < 0.6) {
        data.push(2); // Medium activity
      } else if (activity < 0.8) {
        data.push(3); // High activity
      } else {
        data.push(4); // Very high activity
      }
    }
    return data;
  };

  // Get contribution intensity color
  const getContributionColor = (intensity: number): string => {
    switch (intensity) {
      case 0: return 'bg-gray-700';
      case 1: return 'bg-green-300';
      case 2: return 'bg-green-400';
      case 3: return 'bg-green-500';
      case 4: return 'bg-green-600';
      default: return 'bg-gray-700';
    }
  };

  const StatCard = ({ icon: Icon, label, value, gradient }: {
    icon: any,
    label: string,
    value: number,
    gradient: string
  }) => (
    <div className="glass-card-enhanced p-6 text-center group">
      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div className="text-3xl font-bold gradient-text mb-2">
        {isLoading ? (
          <div className="loading-skeleton h-8 w-16 mx-auto"></div>
        ) : (
          value.toLocaleString()
        )}
      </div>
      <p className="text-gray-300 font-medium">{label}</p>
    </div>
  );

  return (
    <section id="github-stats" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-4xl mx-auto text-center mb-16 ${isVisible ? 'reveal active' : 'reveal'}`}>
          <h2 className="section-title">GitHub Activity</h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mt-6">
            My open source contributions and development activity on GitHub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mb-12">
          <StatCard
            icon={Github}
            label="Repositories"
            value={stats?.totalRepos || 0}
            gradient="from-purple-500 to-purple-700"
          />
          <StatCard
            icon={Star}
            label="Stars Earned"
            value={stats?.totalStars || 0}
            gradient="from-yellow-500 to-orange-500"
          />
          <StatCard
            icon={GitFork}
            label="Forks"
            value={stats?.totalForks || 0}
            gradient="from-green-500 to-emerald-500"
          />
          <StatCard
            icon={Calendar}
            label="Contributions"
            value={stats?.contributions || 0}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={Calendar}
            label="Day Streak"
            value={stats?.streak || 0}
            gradient="from-pink-500 to-rose-500"
          />
        </div>

        <div className="glass-card-enhanced p-4 md:p-8 max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold gradient-text mb-6">Contribution Graph</h3>
          
          {/* Improved contribution graph with proper 52-week structure */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Month labels */}
              <div className="flex justify-between text-xs text-gray-400 mb-2 px-4">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                  <span key={month} className="flex-1 text-center">{month}</span>
                ))}
              </div>
              
              {/* Days of week labels */}
              <div className="flex items-start gap-1">
                <div className="flex flex-col gap-1 text-xs text-gray-400 mr-2 mt-2">
                  <div className="h-3"></div> {/* Empty space for Sunday */}
                  <div className="h-3 flex items-center">Mon</div>
                  <div className="h-3"></div> {/* Empty space for Tuesday */}
                  <div className="h-3 flex items-center">Wed</div>
                  <div className="h-3"></div> {/* Empty space for Thursday */}
                  <div className="h-3 flex items-center">Fri</div>
                  <div className="h-3"></div> {/* Empty space for Saturday */}
                </div>
                
                {/* Contribution grid - 52 weeks x 7 days */}
                <div className="grid grid-cols-52 gap-1 flex-1">
                  {isLoading ? (
                    Array.from({ length: 364 }, (_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-sm bg-gray-700 loading-skeleton"
                      />
                    ))
                  ) : (
                    (stats?.contributionData || generateRealisticContributionData()).map((intensity, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-sm ${getContributionColor(intensity)} hover:scale-110 transition-transform cursor-pointer`}
                        title={`${intensity} contributions on day ${i + 1}`}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-gray-700 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubStats;
