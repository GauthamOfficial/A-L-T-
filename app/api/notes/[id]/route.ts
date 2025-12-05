import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { supabaseServer } from '@/lib/supabase/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get authenticated session
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const noteId = params.id;
    const userId = session.user.email || session.user.id || 'unknown';

    // Get note to check ownership and get Google Drive file ID
    const { data: note, error: fetchError } = await supabaseServer
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (note.uploaded_by !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: You can only delete your own notes' },
        { status: 403 }
      );
    }

    // Get access token from session
    const accessToken = (session as any).accessToken;

    // Delete from Google Drive if we have the file ID and access token
    if (note.storage_path && accessToken) {
      try {
        await fetch(
          `https://www.googleapis.com/drive/v3/files/${note.storage_path}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (driveError) {
        console.warn('Error deleting file from Google Drive:', driveError);
        // Continue with database deletion even if Drive deletion fails
      }
    }

    // Delete from database
    const { error: dbError } = await supabaseServer
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (dbError) {
      console.error('Database deletion error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete note from database' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Delete failed' },
      { status: 500 }
    );
  }
}

