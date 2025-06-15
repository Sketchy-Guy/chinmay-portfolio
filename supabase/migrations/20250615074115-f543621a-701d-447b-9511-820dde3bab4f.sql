
-- 1. Add unique constraint on github_stats.username column
ALTER TABLE github_stats ADD CONSTRAINT github_stats_username_unique UNIQUE (username);

-- 2. Create RLS policies for contact_messages table to allow public INSERT operations
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact messages (public contact form)
CREATE POLICY "Allow public contact form submissions" 
ON contact_messages 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow authenticated users to view all messages (for admin)
CREATE POLICY "Allow authenticated users to view all messages" 
ON contact_messages 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users to update message status (for admin)
CREATE POLICY "Allow authenticated users to update messages" 
ON contact_messages 
FOR UPDATE 
TO authenticated 
USING (true);

-- Allow authenticated users to delete messages (for admin)
CREATE POLICY "Allow authenticated users to delete messages" 
ON contact_messages 
FOR DELETE 
TO authenticated 
USING (true);

-- 3. Add proper database indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status_created_at ON contact_messages(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_github_stats_last_updated ON github_stats(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_github_stats_username ON github_stats(username);

-- Add RLS policies for analytics_data to allow public inserts
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public analytics tracking" 
ON analytics_data 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view analytics" 
ON analytics_data 
FOR SELECT 
TO authenticated 
USING (true);
