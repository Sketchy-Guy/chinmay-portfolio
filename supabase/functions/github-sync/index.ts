
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { githubUrl } = await req.json()
    
    if (!githubUrl) {
      throw new Error('GitHub URL is required')
    }

    // Extract username from GitHub URL
    const urlMatch = githubUrl.match(/github\.com\/([^\/]+)/)
    if (!urlMatch) {
      throw new Error('Invalid GitHub URL format')
    }
    
    const username = urlMatch[1]
    console.log(`Fetching GitHub data for user: ${username}`)

    // Fetch user data
    const userResponse = await fetch(`https://api.github.com/users/${username}`)
    if (!userResponse.ok) {
      throw new Error(`GitHub API error: ${userResponse.status}`)
    }
    const userData = await userResponse.json()

    // Fetch repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
    if (!reposResponse.ok) {
      throw new Error(`GitHub repos API error: ${reposResponse.status}`)
    }
    const repos = await reposResponse.json()

    // Calculate stats
    const totalRepos = userData.public_repos || 0
    const totalStars = repos.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0)
    const totalForks = repos.reduce((sum: number, repo: any) => sum + (repo.forks_count || 0), 0)

    // Generate realistic contribution data (365 days)
    const contributionData = generateContributionData()

    // Calculate streak (mock for now, would need GitHub GraphQL API for real data)
    const currentStreak = Math.floor(Math.random() * 200) + 50

    // Upsert GitHub stats
    const { error } = await supabaseClient
      .from('github_stats')
      .upsert({
        username,
        total_repos: totalRepos,
        total_stars: totalStars,
        total_forks: totalForks,
        total_contributions: Math.floor(Math.random() * 2000) + 500, // Mock for now
        current_streak: currentStreak,
        contribution_data: contributionData,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'username'
      })

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          totalRepos,
          totalStars,
          totalForks,
          currentStreak,
          contributionData
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

function generateContributionData(): number[] {
  const data: number[] = []
  for (let i = 0; i < 365; i++) {
    const weekday = i % 7
    const isWeekend = weekday === 0 || weekday === 6
    
    const baseActivity = isWeekend ? 0.2 : 0.7
    const seasonal = Math.sin((i / 365) * Math.PI * 2) * 0.3 + 0.7
    const random = Math.random()
    
    const activity = baseActivity * seasonal * random
    
    if (activity < 0.1) {
      data.push(0)
    } else if (activity < 0.3) {
      data.push(1)
    } else if (activity < 0.6) {
      data.push(2)
    } else if (activity < 0.8) {
      data.push(3)
    } else {
      data.push(4)
    }
  }
  return data
}
