-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  stream TEXT NOT NULL CHECK (stream IN ('physical_science', 'biological_science', 'commerce', 'arts', 'technology')),
  subject TEXT NOT NULL,
  medium TEXT NOT NULL CHECK (medium IN ('sinhala', 'tamil', 'english')),
  file_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  uploader_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  download_count INTEGER DEFAULT 0 NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notes_stream ON notes(stream);
CREATE INDEX IF NOT EXISTS idx_notes_subject ON notes(subject);
CREATE INDEX IF NOT EXISTS idx_notes_medium ON notes(medium);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_uploaded_by ON notes(uploaded_by);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running the schema)
DROP POLICY IF EXISTS "Anyone can read notes" ON notes;
DROP POLICY IF EXISTS "Users can insert their own notes" ON notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON notes;

-- Policy: Anyone can read notes (anonymous access for students)
CREATE POLICY "Anyone can read notes" ON notes
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert their own notes
CREATE POLICY "Users can insert their own notes" ON notes
  FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

-- Policy: Users can update their own notes (for download count)
CREATE POLICY "Users can update their own notes" ON notes
  FOR UPDATE
  USING (auth.uid() = uploaded_by)
  WITH CHECK (auth.uid() = uploaded_by);

-- Policy: Users can delete their own notes
CREATE POLICY "Users can delete their own notes" ON notes
  FOR DELETE
  USING (auth.uid() = uploaded_by);

-- Function to increment download count (optional, for atomic updates)
CREATE OR REPLACE FUNCTION increment_download_count(note_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE notes
  SET download_count = download_count + 1
  WHERE id = note_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on function
GRANT EXECUTE ON FUNCTION increment_download_count(UUID) TO anon, authenticated;

