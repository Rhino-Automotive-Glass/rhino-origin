-- Create origin_sheets table for storing origin sheet data
CREATE TABLE public.origin_sheets (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rhino_code TEXT,
  descripcion TEXT,
  clave_externa TEXT,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster user lookups
CREATE INDEX idx_origin_sheets_user_id ON public.origin_sheets(user_id);

-- Enable Row Level Security
ALTER TABLE public.origin_sheets ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own sheets
CREATE POLICY "Users can view own origin sheets"
  ON public.origin_sheets
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own origin sheets"
  ON public.origin_sheets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own origin sheets"
  ON public.origin_sheets
  FOR DELETE
  USING (auth.uid() = user_id);
