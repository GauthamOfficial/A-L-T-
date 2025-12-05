import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated session
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get access token from session
    const accessToken = (session as any).accessToken;
    
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Google OAuth token not found. Please sign in again.' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const stream = formData.get('stream') as string;
    const subject = formData.get('subject') as string;
    const medium = formData.get('medium') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File is required' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 50MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create multipart form data for Google Drive upload
    const boundary = `----WebKitFormBoundary${Date.now()}`;
    const metadata = {
      name: `${Date.now()}_${file.name}`,
      mimeType: 'application/pdf',
    };

    const multipartBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from('Content-Type: application/json; charset=UTF-8\r\n\r\n'),
      Buffer.from(JSON.stringify(metadata)),
      Buffer.from(`\r\n--${boundary}\r\n`),
      Buffer.from('Content-Type: application/pdf\r\n\r\n'),
      buffer,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    // Upload to Google Drive
    const driveResponse = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
          'Content-Length': multipartBody.length.toString(),
        },
        body: multipartBody,
      }
    );

    if (!driveResponse.ok) {
      const errorText = await driveResponse.text();
      console.error('Google Drive upload error:', errorText);
      return NextResponse.json(
        { success: false, error: 'Failed to upload to Google Drive' },
        { status: 500 }
      );
    }

    const driveData = await driveResponse.json();
    const fileId = driveData.id;

    // Get file metadata to get webViewLink
    const fileInfoResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=webViewLink,webContentLink`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!fileInfoResponse.ok) {
      // If we can't get the link, still proceed with fileId
      console.warn('Could not get file info from Google Drive');
    }

    const fileInfo = await fileInfoResponse.ok ? await fileInfoResponse.json() : null;
    const webViewLink = fileInfo?.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;
    const webContentLink = fileInfo?.webContentLink || `https://drive.google.com/uc?export=download&id=${fileId}`;

    // Make the file publicly viewable
    try {
      await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            role: 'reader',
            type: 'anyone',
          }),
        }
      );
    } catch (permissionError) {
      console.warn('Could not make file public:', permissionError);
      // Continue anyway - user can manually share if needed
    }

    // Store metadata in Supabase
    // Use email as user identifier
    const userId = session.user.email || session.user.id || 'unknown';
    const userName = session.user.name || session.user.email || 'Anonymous';

    // Use server-side client (with service role key) to bypass RLS
    const { data, error } = await supabaseServer
      .from('notes')
      .insert({
        title,
        description: description || null,
        stream,
        subject,
        medium,
        file_url: webContentLink,
        storage_path: fileId, // Store Google Drive file ID
        uploaded_by: userId as any, // Store as text (schema needs to be updated to TEXT)
        uploader_name: userName,
        download_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save note metadata' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      fileUrl: webContentLink,
      fileId: fileId,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

