'use client';

import { useState } from 'react';
import { Note } from '@/lib/types';
import { Download, User, Calendar, Trash2, Loader2, FileText } from 'lucide-react';
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
    <div className="card hover:shadow-blue hover:scale-[1.01] transition-all duration-200">
      <div className="flex flex-col space-y-4">
        {/* Title and Description */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-lg sm:text-xl font-semibold text-text-primary line-clamp-2 flex-1 font-display">
              {note.title}
            </h3>
            <div className="bg-primary-100 p-2 rounded-full flex-shrink-0">
              <FileText className="h-5 w-5 text-primary-500" />
            </div>
          </div>
          {note.description && (
            <p className="text-text-secondary text-sm sm:text-base line-clamp-3 leading-relaxed">
              {note.description}
            </p>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="badge badge-primary">
            {STREAMS[note.stream]}
          </span>
          <span className="badge badge-accent">
            {SUBJECTS[note.stream][note.subject]}
          </span>
          <span className="badge badge-orange">
            {MEDIUMS[note.medium]}
          </span>
        </div>

        {/* Metadata and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100 gap-4">
          <div className="flex flex-col space-y-2 text-sm text-text-secondary">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-primary-400" />
              <span>{note.uploaderName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-primary-400" />
              <span>{formatDate(note.createdAt)}</span>
            </div>
            {note.downloadCount > 0 && (
              <div className="flex items-center space-x-2 text-success-600">
                <Download className="h-4 w-4" />
                <span className="text-xs font-medium">
                  {note.downloadCount} download{note.downloadCount !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end sm:justify-start gap-2 flex-nowrap">
            {isOwner && (
              <>
                {showConfirm ? (
                  <>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded-full border-2 border-red-500 hover:bg-red-600 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-1.5 min-h-[40px]"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          <span>Confirm</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      disabled={isDeleting}
                      className="px-4 py-2 text-sm bg-white text-text-secondary rounded-full border-2 border-gray-300 hover:bg-gray-50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[40px]"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="px-4 py-2 text-sm bg-white text-red-500 rounded-full border-2 border-red-500 hover:bg-red-50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-1.5 min-h-[40px]"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                )}
              </>
            )}
            <button
              onClick={handleDownload}
              className="btn-primary text-sm px-4 py-2 min-h-[40px] flex items-center justify-center space-x-1.5"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

