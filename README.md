# A/L நோTස් - SL Student Relief

A humanitarian EdTech platform to help flood-affected G.C.E. A/L students in Sri Lanka access lost study notes.

## Features

- **For Contributors (Teachers/University Students):**
  - Upload PDF notes via Google Authentication
  - Organize notes by Stream, Subject, and Medium
  - Track download statistics

- **For Students:**
  - Browse and search notes without login (anonymous access)
  - Filter by Stream, Subject, and Medium
  - Free downloads of all notes

## Tech Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS (Mobile-first, high contrast)
- **Backend:** Supabase (PostgreSQL, Storage, Auth)
- **Icons:** Lucide-React

## Domain Structure

### Streams
1. Physical Science
2. Biological Science
3. Commerce
4. Arts
5. Technology

### Subjects by Stream

**Physical Science:**
- Combined Mathematics
- Physics
- Chemistry

**Biological Science:**
- Biology
- Chemistry
- Physics
- Agricultural Science

**Commerce:**
- Business Studies
- Accounting
- Economics

**Arts:**
- History
- Political Science
- Geography
- Sinhala
- Tamil
- English
- Media Studies

**Technology:**
- Engineering Tech (ET)
- Bio-system Tech (BST)
- Science for Tech (SFT)
- Information Technology

### Mediums
- Sinhala
- Tamil
- English

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Google provider
3. Create a Firestore database
4. Create a Storage bucket
5. Copy your Firebase configuration

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Firebase Security Rules

#### Firestore Rules

Deploy the rules from `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

Or copy the contents of `firestore.rules` to your Firebase Console under Firestore Database > Rules.

#### Storage Rules

Deploy the rules from `storage.rules`:

```bash
firebase deploy --only storage:rules
```

Or copy the contents of `storage.rules` to your Firebase Console under Storage > Rules.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Table: `notes`

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  stream TEXT NOT NULL,
  subject TEXT NOT NULL,
  medium TEXT NOT NULL,
  file_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  uploader_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  download_count INTEGER DEFAULT 0
);
```

The table uses Row Level Security (RLS) policies:
- **Public read**: Anyone can read notes (anonymous access)
- **Authenticated insert**: Only authenticated users can upload
- **User update/delete**: Users can only modify their own notes
```

## Project Structure

```
├── app/
│   ├── browse/          # Browse and search notes (anonymous)
│   ├── upload/          # Upload notes (requires auth)
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── AuthProvider.tsx # Firebase auth context
│   ├── FilterPanel.tsx  # Filter sidebar component
│   └── NoteCard.tsx     # Note display card
├── lib/
│   ├── constants.ts     # Domain constants (streams, subjects, mediums)
│   ├── types.ts         # TypeScript types
│   └── firebase/
│       ├── config.ts    # Firebase initialization
│       ├── auth.ts     # Authentication functions
│       └── notes.ts    # Firestore operations
├── firestore.rules      # Firestore security rules
└── storage.rules        # Storage security rules
```

## Security Features

- Row Level Security (RLS) policies for database access
- Anonymous read access for students (no login required)
- Authenticated write access for contributors
- User ownership validation for updates/deletes
- Storage bucket policies for file access control
- File size and type validation (PDF only, 50MB max)
- Download count tracking

## Mobile-First Design

- Large touch targets (minimum 48x48px)
- High contrast colors for accessibility
- Responsive grid layouts
- Touch-friendly form inputs
- Optimized for small screens

## Contributing

This is a humanitarian project. Contributions are welcome to help flood-affected students in Sri Lanka.

## License

This project is created for humanitarian purposes to help students affected by natural disasters.

