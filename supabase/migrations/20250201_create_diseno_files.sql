-- Create diseno_files table for storing file upload metadata
CREATE TABLE public.diseno_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blob_url TEXT NOT NULL,
  blob_pathname TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  content_type TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'text', 'cad')),
  order_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster user file lookups
CREATE INDEX idx_diseno_files_user_id ON public.diseno_files(user_id);

-- Enable Row Level Security
ALTER TABLE public.diseno_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own files
CREATE POLICY "Users can view own files"
  ON public.diseno_files
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own files"
  ON public.diseno_files
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own files"
  ON public.diseno_files
  FOR DELETE
  USING (auth.uid() = user_id);
