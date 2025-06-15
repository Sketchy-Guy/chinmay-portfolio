
-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the storage bucket
CREATE POLICY "Public read access for portfolio assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Admin upload access for portfolio assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Admin update access for portfolio assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Admin delete access for portfolio assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-assets');

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_github_stats_updated ON github_stats(last_updated DESC);

-- Add real-time publication for better sync
ALTER PUBLICATION supabase_realtime ADD TABLE contact_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE site_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE github_stats;
