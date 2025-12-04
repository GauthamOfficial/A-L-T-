import { supabase } from './config';
import { Note, NoteFormData, Stream, Subject, Medium } from '../types';

const NOTES_TABLE = 'notes';

export const uploadNote = async (
  formData: NoteFormData,
  userId: string,
  userName: string
): Promise<string> => {
  if (!formData.file) {
    throw new Error('File is required');
  }

  try {
    // Upload file to Supabase Storage
    const fileName = `${Date.now()}_${formData.file.name}`;
    const filePath = `notes/${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('notes')
      .upload(filePath, formData.file, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('notes')
      .getPublicUrl(filePath);

    const fileUrl = urlData.publicUrl;

    // Insert note into database
    const { data, error } = await supabase
      .from(NOTES_TABLE)
      .insert({
        title: formData.title,
        description: formData.description || null,
        stream: formData.stream,
        subject: formData.subject,
        medium: formData.medium,
        file_url: fileUrl,
        storage_path: filePath,
        uploaded_by: userId,
        uploader_name: userName,
        download_count: 0,
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create note');

    return data.id;
  } catch (error) {
    console.error('Error uploading note:', error);
    throw error;
  }
};

export interface SearchFilters {
  stream?: Stream;
  subject?: Subject;
  medium?: Medium;
  searchQuery?: string;
}

export const searchNotes = async (
  filters: SearchFilters = {},
  maxResults: number = 50
): Promise<Note[]> => {
  try {
    let query = supabase
      .from(NOTES_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(maxResults);

    // Apply filters
    if (filters.stream) {
      query = query.eq('stream', filters.stream);
    }
    if (filters.subject) {
      query = query.eq('subject', filters.subject);
    }
    if (filters.medium) {
      query = query.eq('medium', filters.medium);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform database format to Note format
    const notes: Note[] = (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      stream: row.stream,
      subject: row.subject,
      medium: row.medium,
      fileUrl: row.file_url,
      storagePath: row.storage_path,
      uploadedBy: row.uploaded_by,
      uploaderName: row.uploader_name,
      createdAt: row.created_at,
      downloadCount: row.download_count || 0,
    }));

    // Client-side search filtering for title/description
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          (note.description && note.description.toLowerCase().includes(query))
      );
    }

    return notes;
  } catch (error) {
    console.error('Error searching notes:', error);
    throw error;
  }
};

export const incrementDownloadCount = async (noteId: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('increment_download_count', {
      note_id: noteId,
    });

    // If RPC function doesn't exist, use update
    if (error && error.message.includes('function')) {
      const { data: note } = await supabase
        .from(NOTES_TABLE)
        .select('download_count')
        .eq('id', noteId)
        .single();

      if (note) {
        await supabase
          .from(NOTES_TABLE)
          .update({ download_count: (note.download_count || 0) + 1 })
          .eq('id', noteId);
      }
    } else if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error incrementing download count:', error);
    // Don't throw - download should still work even if count fails
  }
};

export const deleteNote = async (noteId: string, userId: string): Promise<void> => {
  try {
    // Get note to check ownership and get storage path
    const { data: note, error: fetchError } = await supabase
      .from(NOTES_TABLE)
      .select('*')
      .eq('id', noteId)
      .single();

    if (fetchError) throw fetchError;
    if (!note) throw new Error('Note not found');

    // Verify ownership
    if (note.uploaded_by !== userId) {
      throw new Error('Unauthorized: You can only delete your own notes');
    }

    // Delete file from Storage first
    const { error: storageError } = await supabase.storage
      .from('notes')
      .remove([note.storage_path]);

    if (storageError) {
      console.warn('Error deleting file from storage:', storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database - THIS IS THE CRITICAL PART
    const { data: deletedData, error: dbError } = await supabase
      .from(NOTES_TABLE)
      .delete()
      .eq('id', noteId)
      .select();

    if (dbError) {
      console.error('Database deletion error:', dbError);
      throw new Error(`Failed to delete note from database: ${dbError.message}`);
    }

    // Verify deletion was successful
    if (!deletedData || deletedData.length === 0) {
      throw new Error('Note was not deleted from database. It may not exist or you may not have permission.');
    }

    console.log('Note successfully deleted from database:', noteId);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

