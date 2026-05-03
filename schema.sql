-- 1. Setup Storage Bucket (resumes) via SQL
-- Note: You can also do this manually in the Supabase UI
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies to allow anonymous uploads for the demo
CREATE POLICY "Allow Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "Allow Public View" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');

-- 2. Database Tables
CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_url TEXT NOT NULL,
  extracted_text TEXT,
  filename TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_descriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description_text TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  job_description_id UUID REFERENCES job_descriptions(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL,
  recruiter_verdict TEXT,
  matched_skills TEXT[],
  missing_skills TEXT[],
  rewritten_bullets TEXT[],
  interview_questions TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Permissive Policies for Demo (Allows anonymous usage without Auth)
CREATE POLICY "Public Anonymous Insert" ON resumes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Anonymous Select" ON resumes FOR SELECT USING (true);

CREATE POLICY "Public Anonymous Insert" ON job_descriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Anonymous Select" ON job_descriptions FOR SELECT USING (true);

CREATE POLICY "Public Anonymous Insert" ON analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Anonymous Select" ON analyses FOR SELECT USING (true);
