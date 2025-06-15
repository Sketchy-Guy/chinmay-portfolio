
import { useState, useEffect } from "react";
import { Github, Star, GitFork, Calendar } from "lucide-react";

interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  contributions: number;
  streak: number;
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

  useEffect(() => {
    // Simulate API call - replace with actual GitHub API integration
    const fetchGitHubStats = async () => {
      try {
        // Mock data - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStats({
          totalRepos: 25,
          totalStars: 150,
          totalForks: 45,
          contributions: 1200,
          streak: 120
        });
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isVisible) {
      fetchGitHubStats();
    }
  }, [isVisible]);

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

        <div className="glass-card-enhanced p-8 max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold gradient-text mb-4">Contribution Graph</h3>
          <div className="grid grid-cols-52 gap-1 mb-6">
            {Array.from({ length: 365 }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm ${
                  Math.random() > 0.7
                    ? 'bg-green-500'
                    : Math.random() > 0.5
                    ? 'bg-green-400'
                    : Math.random() > 0.3
                    ? 'bg-green-300'
                    : 'bg-gray-700'
                }`}
                title={`Contribution on day ${i + 1}`}
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm">
            Less <span className="inline-flex gap-1 mx-2">
              <div className="w-3 h-3 bg-gray-700 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            </span> More
          </p>
        </div>
      </div>
    </section>
  );
};

export default GitHubStats;
