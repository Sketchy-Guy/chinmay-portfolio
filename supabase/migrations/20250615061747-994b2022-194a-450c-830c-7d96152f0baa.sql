
-- Create new tables for enhanced portfolio features without modifying existing structure

-- Contact form messages storage
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Site configuration and settings
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced analytics data
CREATE TABLE public.analytics_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'page_view', 'contact_form', 'download', etc.
  event_data JSONB,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Coding achievements and badges
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT, -- Lucide icon name
  category TEXT NOT NULL, -- 'coding', 'project', 'learning', etc.
  progress INTEGER DEFAULT 0,
  max_progress INTEGER NOT NULL,
  is_unlocked BOOLEAN DEFAULT false,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  unlock_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced timeline events for professional journey
CREATE TABLE public.timeline_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  location TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('work', 'education', 'project', 'achievement')),
  skills JSONB, -- Array of skills used/learned
  image_url TEXT,
  link_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- GitHub statistics cache (to avoid API rate limits)
CREATE TABLE public.github_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  total_repos INTEGER DEFAULT 0,
  total_stars INTEGER DEFAULT 0,
  total_forks INTEGER DEFAULT 0,
  total_contributions INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  contribution_data JSONB, -- Store contribution graph data
  languages JSONB, -- Programming languages stats
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on new tables
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access and admin write access
-- Contact messages - only admins can read/write
CREATE POLICY "Admins can manage contact messages" ON public.contact_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.auth_users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Site settings - public read, admin write
CREATE POLICY "Public can view site settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON public.site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.auth_users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Analytics - only admins can access
CREATE POLICY "Admins can manage analytics" ON public.analytics_data
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.auth_users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Achievements - public read, admin write
CREATE POLICY "Public can view achievements" ON public.achievements
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage achievements" ON public.achievements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.auth_users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Timeline events - public read, admin write
CREATE POLICY "Public can view timeline events" ON public.timeline_events
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage timeline events" ON public.timeline_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.auth_users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- GitHub stats - public read, admin write
CREATE POLICY "Public can view github stats" ON public.github_stats
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage github stats" ON public.github_stats
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.auth_users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Insert some default achievements
INSERT INTO public.achievements (title, description, icon, category, progress, max_progress, is_unlocked, rarity) VALUES
('Problem Solver', 'Solved 500+ coding problems', 'Target', 'coding', 523, 500, true, 'epic'),
('Code Warrior', 'Completed 50+ projects', 'Code', 'project', 47, 50, false, 'rare'),
('Speed Demon', 'Solved 10 problems in one day', 'Zap', 'coding', 10, 10, true, 'legendary'),
('Consistency King', 'Coded for 100 days straight', 'Trophy', 'habit', 120, 100, true, 'epic'),
('Language Master', 'Proficient in 5+ languages', 'Star', 'skill', 8, 5, true, 'rare'),
('Open Source Hero', 'Contributed to 20+ repositories', 'Award', 'contribution', 15, 20, false, 'epic');

-- Insert default site settings
INSERT INTO public.site_settings (key, value, description) VALUES
('github_username', '"chinmaykumarpanda"', 'GitHub username for stats display'),
('site_analytics_enabled', 'true', 'Enable site analytics tracking'),
('contact_form_enabled', 'true', 'Enable contact form submissions'),
('achievements_visible', 'true', 'Show achievements section on main site'),
('timeline_visible', 'true', 'Show timeline section on main site');

-- Add indexes for better performance
CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX idx_analytics_event_type ON public.analytics_data(event_type);
CREATE INDEX idx_analytics_created_at ON public.analytics_data(created_at DESC);
CREATE INDEX idx_achievements_category ON public.achievements(category);
CREATE INDEX idx_achievements_is_unlocked ON public.achievements(is_unlocked);
CREATE INDEX idx_timeline_events_type ON public.timeline_events(event_type);
CREATE INDEX idx_timeline_events_order ON public.timeline_events(order_index);
CREATE INDEX idx_site_settings_key ON public.site_settings(key);
