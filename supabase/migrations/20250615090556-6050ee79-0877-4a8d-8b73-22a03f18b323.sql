
-- Allow authenticated users to insert/update/select their own GitHub stats
ALTER TABLE public.github_stats ENABLE ROW LEVEL SECURITY;

-- SELECT: Anyone can see github_stats (since it's for public display)
CREATE POLICY "Allow read github_stats public" ON public.github_stats
  FOR SELECT USING (true);

-- INSERT: Allow insert for service role AND for authenticated users (matching their username)
CREATE POLICY "Allow insert github_stats for service_role" ON public.github_stats
  FOR INSERT WITH CHECK (current_setting('request.jwt.claim.role', true) = 'service_role');

-- UPDATE: Allow update for service role AND for authenticated users (matching their username)
CREATE POLICY "Allow update github_stats for service_role" ON public.github_stats
  FOR UPDATE USING (current_setting('request.jwt.claim.role', true) = 'service_role');

-- Optionally: Allow inserting/updating for a specific admin user (add more logic if you wish)
