# Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier available)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Supabase Project Setup

1. Go to [Supabase](https://app.supabase.com)
2. Create a new project or select an existing one
3. Wait for the project to be provisioned (takes 1-2 minutes)

#### Enable Google Authentication

1. Go to **Authentication** > **Providers**
2. Enable **Google** provider
3. You'll need to set up Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase

#### Create Database Table

1. Go to **SQL Editor** in Supabase Dashboard
2. Copy and paste the entire contents of `supabase/schema.sql`
3. Click **Run** to execute the SQL
4. This creates the `notes` table with Row Level Security policies

#### Set Up Storage

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Name it: `notes`
4. Make it **Public** (for anonymous read access)
5. Click **Create bucket**

#### Configure Storage Policies

1. Go to **Storage** > **Policies** for the `notes` bucket
2. Create the following policies (see `supabase/storage-policies.sql` for details):

   **Policy 1: Public Read Access**
   - Policy name: "Public read access"
   - Allowed operation: SELECT
   - Policy definition: `true`

   **Policy 2: Authenticated Upload**
   - Policy name: "Authenticated users can upload"
   - Allowed operation: INSERT
   - Policy definition: `auth.role() = 'authenticated'`

   **Policy 3: User Delete Own Files**
   - Policy name: "Users can delete own files"
   - Allowed operation: DELETE
   - Policy definition: `bucket_id = 'notes' AND (storage.foldername(name))[1] = auth.uid()::text`

### 3. Get Supabase Configuration

1. Go to **Project Settings** (gear icon)
2. Click on **API** tab
3. Copy:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### 4. Create Environment File

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Testing

1. **Test Anonymous Access:**
   - Go to `/browse`
   - You should be able to see notes without logging in
   - Try filtering by stream, subject, medium

2. **Test Upload:**
   - Go to `/upload`
   - Sign in with Google
   - Upload a test PDF
   - Verify it appears in `/browse`

3. **Test Download:**
   - From `/browse`, click Download on any note
   - Verify the PDF opens/downloads
   - Check that download count increments

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists and has both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart the dev server after creating `.env.local`

### "Permission denied" errors
- Verify RLS policies are enabled on the `notes` table
- Check that storage policies are set up correctly
- Make sure the storage bucket is set to **Public**

### Upload fails
- Check file size (must be < 50MB)
- Verify file is PDF format
- Check browser console for detailed errors
- Verify storage bucket exists and policies are correct

### Notes don't appear
- Verify the `notes` table exists (check in Table Editor)
- Check that RLS policies allow read access
- Verify filters are set correctly

### Google OAuth not working
- Make sure Google provider is enabled in Supabase
- Verify redirect URI matches in Google Cloud Console
- Check that OAuth credentials are correctly set in Supabase

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Update Google OAuth redirect URI to include your production domain
5. Deploy

### Other Platforms

Make sure to:
- Set all `NEXT_PUBLIC_*` environment variables
- Build command: `npm run build`
- Start command: `npm start`
- Update OAuth redirect URIs for your production domain

## Next Steps

- Add your production domain to Google OAuth authorized redirect URIs
- Consider setting up custom domain in Supabase
- Review and adjust RLS policies as needed
- Set up database backups (Supabase Pro plan)

## Supabase Free Tier Limits

The free tier includes:
- 500 MB database space
- 1 GB file storage
- 2 GB bandwidth
- 50,000 monthly active users
- Unlimited API requests

Perfect for a humanitarian project! 🎉
