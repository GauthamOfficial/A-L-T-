# Google Drive OAuth Migration Summary

## Changes Made

### 1. Authentication System
- **Replaced**: Supabase Auth → NextAuth.js with Google OAuth
- **Files Changed**:
  - `app/api/auth/[...nextauth]/route.ts` - NextAuth configuration with Google provider and Drive scope
  - `components/AuthProvider.tsx` - Updated to use NextAuth SessionProvider
  - `app/upload/page.tsx` - Updated to use `useSession` from next-auth

### 2. Upload System
- **Created**: `app/api/upload/route.ts` - New API route that:
  - Uses Google OAuth access token to upload PDFs to Google Drive
  - Stores metadata (fileId, webViewLink) in Supabase database
  - Makes files publicly accessible
  - Returns `{ success: true, fileUrl, fileId }`

### 3. Delete System
- **Created**: `app/api/notes/[id]/route.ts` - New API route for deleting notes
  - Deletes file from Google Drive using OAuth token
  - Deletes metadata from Supabase database
- **Updated**: `components/NoteCard.tsx` - Now calls the delete API route

### 4. Server-Side Supabase Client
- **Created**: `lib/supabase/server.ts` - Server-side Supabase client with service role key
  - Bypasses RLS for server-side operations
  - Used in API routes for database operations

## Setup Instructions

### 1. Install Dependencies
Already installed: `next-auth@beta`

### 2. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable **Google Drive API**
4. Go to **APIs & Services** > **Credentials**
5. Create **OAuth 2.0 Client ID**:
   - Application type: **Web application**
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://your-domain.com/api/auth/callback/google` (for production)
6. Copy **Client ID** and **Client Secret**

### 3. Environment Variables
Add to `.env.local`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
AUTH_SECRET=your_nextauth_secret
# Generate with: openssl rand -base64 32

# Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# Get from: Supabase Dashboard > Project Settings > API > service_role key
```

### 4. Database Migration
Run the migration SQL in Supabase SQL Editor:

```sql
-- See: supabase/migration-nextauth.sql
```

This migration:
- Changes `uploaded_by` from UUID to TEXT (to work with next-auth user emails)
- Updates RLS policies to allow server-side operations
- Removes foreign key constraint to `auth.users`

**Important**: Run this migration **after** setting up environment variables and before testing uploads.

### 5. Test the System
1. Start the dev server: `npm run dev`
2. Go to `/upload`
3. Sign in with Google (will request Drive access)
4. Upload a test PDF
5. Verify:
   - File appears in your Google Drive
   - File is publicly accessible
   - Metadata is stored in Supabase
   - File appears in `/browse`

## API Endpoints

### POST `/api/upload`
Uploads a PDF to Google Drive and stores metadata in Supabase.

**Request**: `FormData` with:
- `file`: PDF file
- `title`: Note title
- `description`: Note description
- `stream`: Stream type
- `subject`: Subject type
- `medium`: Medium type

**Response**:
```json
{
  "success": true,
  "fileUrl": "https://drive.google.com/uc?export=download&id=FILE_ID",
  "fileId": "FILE_ID"
}
```

### DELETE `/api/notes/[id]`
Deletes a note from Google Drive and Supabase database.

**Response**:
```json
{
  "success": true
}
```

## File Storage

- **PDFs**: Stored in your personal Google Drive (via OAuth)
- **Metadata**: Stored in Supabase database (`notes` table)
- **File URLs**: Google Drive public download links
- **File IDs**: Stored in `storage_path` column for deletion

## Notes

- Files are automatically made publicly accessible after upload
- Students can download files via Google Drive public links
- All authorization is handled in API routes (not RLS policies)
- Supabase storage is **not used** - only database for metadata
- OAuth tokens are stored in NextAuth session

## Troubleshooting

### "Google OAuth token not found"
- Sign out and sign in again
- Check that OAuth flow completed successfully
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set

### "Failed to upload to Google Drive"
- Check that Google Drive API is enabled in Google Cloud Console
- Verify OAuth scope includes `https://www.googleapis.com/auth/drive.file`
- Check browser console for detailed error messages

### "Failed to save note metadata"
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check that migration SQL has been run
- Verify Supabase database connection

### Files not publicly accessible
- The API attempts to set public permissions automatically
- If it fails, you may need to manually share files in Google Drive
- Check Google Drive API permissions

