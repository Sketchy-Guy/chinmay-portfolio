-- Add missing site settings that the frontend expects
INSERT INTO site_settings (key, value, description) 
VALUES 
  ('site_name', '"Mr. Chinmay Kumar Panda"', 'Site owner name'),
  ('site_logo', '"https://lvjfqefqrmgzwkhtknbj.supabase.co/storage/v1/object/public/portfolio/profile_photo/10f6f545-cd03-4b5f-bbf4-96dc44158959_1748369247959_RUID2215dd59959849e29dc07c311fc1f98c.jpg"', 'Site logo URL'),
  ('site_description', '"Software Developer | Python | AI | Javascript | Java | App Developer | Mentor | AI/ML"', 'Site description'),
  ('social_github', '"https://github.com/Sketchy-Guy"', 'GitHub profile URL'),
  ('social_linkedin', '"https://shorturl.at/NneJ0"', 'LinkedIn profile URL'),
  ('social_twitter', '"https://x.com/Chinmay_Panda01?t=26ySu9BXe13Q24JXiiy57Q&s=09"', 'Twitter profile URL'),
  ('social_instagram', '"https://www.instagram.com/mr_chintu_.panda?igsh=MWoybDVtZGllMmtyaQ=="', 'Instagram profile URL'),
  ('social_facebook', '"https://facebook.com"', 'Facebook profile URL'),
  ('social_email', '"chinmaykumarpanda004@gmail.com"', 'Contact email')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = now();