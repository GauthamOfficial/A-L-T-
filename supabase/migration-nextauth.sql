-- Migration to support next-auth (text-based user IDs instead of UUID)
-- Run this in Supabase SQL Editor after switching to next-auth

-- Step 1: Drop ALL existing policies FIRST (before altering column)
DROP POLICY IF EXISTS "Anyone can read notes" ON notes;
DROP POLICY IF EXISTS "Users can insert their own notes" ON notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON notes;
DROP POLICY IF EXISTS "Allow authenticated inserts" ON notes;
DROP POLICY IF EXISTS "Allow authenticated updates" ON notes;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON notes;

-- Step 2: Drop the foreign key constraint (since we're not using auth.users anymore)
ALTER TABLE notes 
  DROP CONSTRAINT IF EXISTS notes_uploaded_by_fkey;

-- Step 3: NOW alter the column type (after all policies are dropped)
ALTER TABLE notes 
  ALTER COLUMN uploaded_by TYPE TEXT;

-- Step 4: Recreate RLS policies for next-auth
-- Policy: Anyone can read notes (anonymous access for students)
CREATE POLICY "Anyone can read notes" ON notes
  FOR SELECT
  USING (true);

-- Policy: Allow inserts (authorization handled in API routes)
CREATE POLICY "Allow authenticated inserts" ON notes
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow updates (authorization handled in API routes)
CREATE POLICY "Allow authenticated updates" ON notes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Allow deletes (authorization handled in API routes)
CREATE POLICY "Allow authenticated deletes" ON notes
  FOR DELETE
  USING (true);

-- Note: Since we're using next-auth and handling authorization in API routes,
-- these policies are permissive. The API routes verify ownership before allowing operations.