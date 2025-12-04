'use client';

import { useState } from 'react';
import { Note } from '@/lib/types';
import { Download, User, Calendar, Trash2, Loader2 } from 'lucide-react';
import { incrementDownloadCount, deleteNote } from '@/lib/supabase/notes';
import { STREAMS, SUBJECTS, MEDIUMS } from '@/lib/constants';
import { useAuth } from '@/components/AuthProvider';

interface NoteCardProps {
  note: Note;
  onDelete?: () => void; // Callback to refresh the list after deletion
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isOwner = user && user.id === note.uploadedBy;

  const handleDownload = async () => {
    try {
      // Open download link
      window.open(note.fileUrl, '_blank');
      
      // Increment download count
      await incrementDownloadCount(note.id);
    } catch (error) {
      console.error('Error downloading note:', error);
      // Still open the link even if count fails
      window.open(note.fileUrl, '_blank');
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      // Delete from database and storage
      await deleteNote(note.id, user.id);
      
      // Success - refresh the list to remove deleted note
      if (onDelete) {
        onDelete();
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(error.message || 'Failed to delete note. Please try again.');
      setIsDeleting(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card">
      <div className="flex flex-col space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {note.title}
          </h3>
          {note.description && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {note.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
            {STREAMS[note.stream]}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {SUBJECTS[note.stream][note.subject]}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            {MEDIUMS[note.medium]}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 gap-4">
          <div className="flex flex-col space-y-1 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{note.uploaderName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(note.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end sm:justify-start gap-2 flex-nowrap">
            {isOwner && (
              <>
                {showConfirm ? (
                  <>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg border-2 border-red-600 hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-1.5"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Confirm</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      disabled={isDeleting}
                      className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-lg border-2 border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="px-3 py-1.5 text-sm bg-white text-red-600 rounded-lg border-2 border-red-600 hover:bg-red-50 active:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </>
            )}
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg border-2 border-primary-600 hover:bg-primary-700 active:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {note.downloadCount > 0 && (
          <div className="text-xs text-gray-400 text-center pt-2">
            {note.downloadCount} download{note.downloadCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

