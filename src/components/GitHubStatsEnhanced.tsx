
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, Star, GitFork, Activity, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GitHubStats {
  id: string;
  username: string;
  total_repos: number;
  total_stars: number;
  total_forks: number;
  total_contributions: number;
  current_streak: number;
  contribution_data: any;
  languages: any;
  last_updated: string;
}

interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

const GitHubStatsEnhanced = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('Sketchy-Guy');

  // Fetch GitHub stats from database
  const fetchStoredStats = async () => {
    try {
      const { data, error } = await supabase
        .from('github_stats')
        .select('*')
        .eq('username', username)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error;
      }

      if (data) {
        setStats(data);
        console.log('GitHub stats loaded from database:', data);
      }
    } catch (error: any) {
      console.error('Error fetching stored GitHub stats:', error);
    }
  };

  // Fetch fresh data from GitHub API with rate limiting and error handling
  const fetchFreshGitHubData = async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      // Check rate limit first
      const rateLimitResponse = await fetch('https://api.github.com/rate_limit');
      const rateLimit = await rateLimitResponse.json();
      
      if (rateLimit.rate.remaining < 10) {
        throw new Error(`GitHub API rate limit exceeded. Resets at ${new Date(rateLimit.rate.reset * 1000).toLocaleTimeString()}`);
      }

      // Fetch user data
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!userResponse.ok) {
        throw new Error(`GitHub user not found: ${username}`);
      }
      const userData: GitHubUser = await userResponse.json();

      // Fetch repositories with pagination
      let allRepos = [];
      let page = 1;
      const perPage = 100;
      
      while (true) {
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated`
        );
        
        if (!reposResponse.ok) break;
        
        const repos = await reposResponse.json();
        if (repos.length === 0) break;
        
        allRepos.push(...repos);
        if (repos.length < perPage) break;
        page++;
      }

      // Calculate statistics
      const totalStars = allRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = allRepos.reduce((sum, repo) => sum + repo.forks_count, 0);

      // Get language statistics
      const languageStats: Record<string, number> = {};
      for (const repo of allRepos.slice(0, 20)) { // Limit to avoid rate limits
        if (repo.language) {
          languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
        }
      }

      // Sort languages by usage
      const sortedLanguages = Object.entries(languageStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);

      const statsData = {
        username: userData.login,
        total_repos: userData.public_repos,
        total_stars: totalStars,
        total_forks: totalForks,
        total_contributions: 0, // Would need GitHub GraphQL API for accurate data
        current_streak: 0, // Would need contribution calendar data
        contribution_data: null,
        languages: sortedLanguages,
        last_updated: new Date().toISOString()
      };

      // Store in database
      const { data, error } = await supabase
        .from('github_stats')
        .upsert(statsData, { onConflict: 'username' })
        .select()
        .single();

      if (error) throw error;

      setStats(data);
      toast.success('GitHub stats updated successfully!');
      console.log('Fresh GitHub data fetched and stored:', data);

    } catch (error: any) {
      console.error('Error fetching GitHub data:', error);
      setError(error.message);
      toast.error(`Failed to update GitHub stats: ${error.message}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Load username from site settings
    const loadUsername = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'github_username')
          .single();

        if (data?.value && typeof data.value === 'string') {
          const githubUsername = JSON.parse(data.value);
          setUsername(githubUsername);
        }
      } catch (error) {
        console.error('Error loading GitHub username:', error);
      }
    };

    loadUsername();
  }, []);

  useEffect(() => {
    if (username) {
      fetchStoredStats().finally(() => setIsLoading(false));
    }
  }, [username]);

  const isDataStale = stats && new Date(stats.last_updated) < new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours

  if (isLoading) {
    return (
      <Card className="glass-card-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Github className="w-5 h-5" />
            GitHub Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="loading-skeleton h-16 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card-enhanced">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Github className="w-5 h-5" />
            GitHub Statistics
            {isDataStale && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                Stale Data
              </Badge>
            )}
          </CardTitle>
          <Button
            onClick={fetchFreshGitHubData}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="text-purple-400 border-purple-400/30 hover:bg-purple-400/10"
          >
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {stats ? (
          <div className="space-y-6">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="text-2xl font-bold text-blue-400">{stats.total_repos}</div>
                <div className="text-sm text-gray-400">Repositories</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <div className="text-2xl font-bold text-yellow-400">{stats.total_stars}</div>
                <div className="text-sm text-gray-400">Stars</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="text-2xl font-bold text-green-400">{stats.total_forks}</div>
                <div className="text-sm text-gray-400">Forks</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <div className="text-2xl font-bold text-purple-400">{stats.total_contributions}</div>
                <div className="text-sm text-gray-400">Contributions</div>
              </div>
            </div>

            {/* Top Languages */}
            {stats.languages && Array.isArray(stats.languages) && stats.languages.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Top Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {stats.languages.map(([language, count], index) => (
                    <Badge
                      key={language}
                      className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 border-purple-500/30"
                    >
                      {language} ({count})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Last Updated */}
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Last updated: {new Date(stats.last_updated).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Github className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No GitHub statistics available</p>
            <Button
              onClick={fetchFreshGitHubData}
              className="mt-4 cyber-button"
              disabled={isRefreshing}
            >
              Load GitHub Data
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GitHubStatsEnhanced;
