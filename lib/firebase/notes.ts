import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
  updateDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';
import { Note, NoteFormData, Stream, Subject, Medium } from '../types';

const NOTES_COLLECTION = 'notes';

export const uploadNote = async (
  formData: NoteFormData,
  userId: string,
  userName: string
): Promise<string> => {
  if (!formData.file) {
    throw new Error('File is required');
  }

  try {
    // Upload file to Firebase Storage
    const fileRef = ref(
      storage,
      `notes/${userId}/${Date.now()}_${formData.file.name}`
    );
    await uploadBytes(fileRef, formData.file);
    const fileUrl = await getDownloadURL(fileRef);

    // Add document to Firestore
    const docRef = await addDoc(collection(db, NOTES_COLLECTION), {
      title: formData.title,
      description: formData.description,
      stream: formData.stream,
      subject: formData.subject,
      medium: formData.medium,
      fileUrl,
      storagePath: fileRef.fullPath,
      uploadedBy: userId,
      uploaderName: userName,
      createdAt: Timestamp.now(),
      downloadCount: 0,
    });

    return docRef.id;
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
    let q = query(collection(db, NOTES_COLLECTION));

    // Apply filters
    if (filters.stream) {
      q = query(q, where('stream', '==', filters.stream));
    }
    if (filters.subject) {
      q = query(q, where('subject', '==', filters.subject));
    }
    if (filters.medium) {
      q = query(q, where('medium', '==', filters.medium));
    }

    // Order by creation date (newest first)
    q = query(q, orderBy('createdAt', 'desc'), limit(maxResults));

    const querySnapshot = await getDocs(q);
    const notes: Note[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notes.push({
        id: doc.id,
        ...data,
      } as Note);
    });

    // Client-side search filtering for title/description
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.description.toLowerCase().includes(query)
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
    const noteRef = doc(db, NOTES_COLLECTION, noteId);
    await updateDoc(noteRef, {
      downloadCount: increment(1),
    });
  } catch (error) {
    console.error('Error incrementing download count:', error);
    // Don't throw - download should still work even if count fails
  }
};

export const deleteNote = async (noteId: string, userId: string): Promise<void> => {
  try {
    // Get note to check ownership and get storage path
    const noteRef = doc(db, NOTES_COLLECTION, noteId);
    const noteSnap = await getDoc(noteRef);

    if (!noteSnap.exists()) {
      throw new Error('Note not found');
    }

    const note = noteSnap.data() as Note;

    // Verify ownership
    if (note.uploadedBy !== userId) {
      throw new Error('Unauthorized: You can only delete your own notes');
    }

    // Delete file from Storage
    const fileRef = ref(storage, note.storagePath);
    await deleteObject(fileRef);

    // Delete document from Firestore
    await updateDoc(noteRef, {
      // Soft delete or actually delete
    });
    // Note: For actual deletion, use deleteDoc(noteRef) instead
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

