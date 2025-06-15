
-- First, let's add some initial timeline events to populate the database
INSERT INTO public.timeline_events (
  title, 
  organization, 
  description, 
  event_type, 
  start_date, 
  end_date, 
  location, 
  link_url, 
  is_featured, 
  order_index, 
  skills
) VALUES 
(
  'Full Stack Developer',
  'Tech Innovation Corp',
  'Leading development of scalable web applications using React, Node.js, and cloud technologies. Implementing CI/CD pipelines and mentoring junior developers.',
  'work',
  '2023-01-01',
  NULL,
  'San Francisco, CA',
  NULL,
  true,
  4,
  '["React", "Node.js", "AWS", "MongoDB", "TypeScript"]'::jsonb
),
(
  'Software Engineering Intern',
  'StartupXYZ',
  'Developed and maintained web applications, collaborated with cross-functional teams to deliver high-quality software solutions.',
  'work',
  '2022-06-01',
  '2023-01-01',
  'Remote',
  NULL,
  false,
  3,
  '["JavaScript", "Python", "SQL", "Git", "React"]'::jsonb
),
(
  'Bachelor of Computer Science',
  'University of Technology',
  'Bachelor of Science in Computer Science with focus on software engineering, artificial intelligence, and database systems. Graduated Magna Cum Laude.',
  'education',
  '2020-09-01',
  '2024-05-01',
  'California',
  NULL,
  true,
  2,
  '["Data Structures", "Algorithms", "Machine Learning", "Database Systems", "Software Engineering"]'::jsonb
),
(
  'Portfolio Website Launch',
  'Personal Project',
  'Built a comprehensive portfolio website with modern technologies, featuring responsive design, dark mode, and dynamic content management.',
  'project',
  '2024-01-01',
  '2024-02-01',
  'Online',
  'https://your-portfolio.com',
  true,
  1,
  '["React", "TypeScript", "Tailwind CSS", "Supabase", "Framer Motion"]'::jsonb
);

-- Add some contact messages for testing
INSERT INTO public.contact_messages (
  name,
  email,
  subject,
  message,
  status
) VALUES 
(
  'John Doe',
  'john.doe@example.com',
  'Collaboration Opportunity',
  'Hi! I saw your portfolio and would love to discuss a potential collaboration on a React project.',
  'unread'
),
(
  'Sarah Johnson',
  'sarah.j@techcorp.com',
  'Job Opportunity',
  'We have an exciting full-stack developer position that might interest you. Would you be available for a call?',
  'unread'
),
(
  'Mike Chen',
  'mike@startup.io',
  'Project Inquiry',
  'Your work on the portfolio website is impressive. We need similar expertise for our startup.',
  'read'
);

-- Add site settings for better configuration
INSERT INTO public.site_settings (
  key,
  value,
  description
) VALUES 
(
  'site_title',
  '"Portfolio Dashboard"'::jsonb,
  'Main title for the portfolio site'
),
(
  'contact_email',
  '"contact@portfolio.com"'::jsonb,
  'Primary contact email address'
),
(
  'github_username',
  '"Sketchy-Guy"'::jsonb,
  'GitHub username for stats integration'
),
(
  'linkedin_url',
  '"https://linkedin.com/in/yourprofile"'::jsonb,
  'LinkedIn profile URL'
),
(
  'resume_url',
  '"https://drive.google.com/file/d/your-resume"'::jsonb,
  'Direct link to resume/CV'
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();
