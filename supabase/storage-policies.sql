-- Storage bucket policies for 'notes' bucket
-- These should be set up in Supabase Dashboard > Storage > Policies

-- Policy: Anyone can read (download) notes
-- In Supabase Dashboard: Storage > notes bucket > Policies > New Policy
-- Policy name: "Public read access"
-- Allowed operation: SELECT
-- Policy definition: true

-- Policy: Authenticated users can upload
-- In Supabase Dashboard: Storage > notes bucket > Policies > New Policy
-- Policy name: "Authenticated users can upload"
-- Allowed operation: INSERT
-- Policy definition: auth.role() = 'authenticated'

-- Policy: Users can delete their own files
-- In Supabase Dashboard: Storage > notes bucket > Policies > New Policy
-- Policy name: "Users can delete own files"
-- Allowed operation: DELETE
-- Policy definition: bucket_id = 'notes' AND (storage.foldername(name))[1] = auth.uid()::text

-- Note: These policies need to be created manually in Supabase Dashboard
-- Go to: Storage > notes bucket > Policies > New Policy

