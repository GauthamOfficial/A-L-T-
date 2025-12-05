'use client';

import { useState, useEffect } from 'react';
import { Note } from '@/lib/types';
import { Download, User, Calendar, Trash2, Loader2, FileText } from 'lucide-react';
import { incrementDownloadCount } from '@/lib/supabase/notes';
import { STREAMS, SUBJECTS, MEDIUMS } from '@/lib/constants';
import { useSession } from 'next-auth/react';

interface NoteCardProps {
  note: Note;
  onDelete?: () => void; // Callback to refresh the list after deletion
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isOwner = user && (user.email === note.uploadedBy || user.id === note.uploadedBy);

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
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete note');
      }
      
      // Success - refresh the list to remove deleted note
      setShowDeleteModal(false);
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

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDeleteModal && !isDeleting) {
        setShowDeleteModal(false);
      }
    };
    if (showDeleteModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showDeleteModal, isDeleting]);

  return (
    <>
      <div className={`card transition-all duration-200 ${!showDeleteModal ? 'hover:shadow-blue hover:scale-[1.01]' : 'pointer-events-none'}`}>
        <div className="flex flex-col space-y-4">
        {/* Title and Description */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-lg sm:text-xl font-semibold text-text-primary dark:text-gray-100 line-clamp-2 flex-1 font-display">
              {note.title}
            </h3>
            <div className="bg-primary-100 dark:bg-primary-900/30 p-2.5 rounded-full flex-shrink-0">
              <FileText className="h-5 w-5 text-primary-500 dark:text-primary-400" />
            </div>
          </div>
          {note.description && (
            <p className="text-text-secondary dark:text-gray-300 text-sm sm:text-base line-clamp-3 leading-relaxed">
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
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-secondary dark:text-gray-300">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary-400 dark:text-primary-500 flex-shrink-0" />
                <span>{note.uploaderName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary-400 dark:text-primary-500 flex-shrink-0" />
                <span>{formatDate(note.createdAt)}</span>
              </div>
              {note.downloadCount > 0 && (
                <div className="flex items-center gap-2 text-success-600 dark:text-success-400">
                  <Download className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs font-medium">
                    {note.downloadCount} download{note.downloadCount !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 flex-shrink-0">
              {isOwner && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 text-sm bg-white dark:bg-gray-800 text-red-500 dark:text-red-400 rounded-full border-2 border-red-500 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-1.5 min-h-[40px]"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              )}
              <button
                onClick={handleDownload}
                className="btn-primary text-sm px-4 py-2 min-h-[40px] flex items-center justify-center gap-1.5"
              >
                <Download className="h-4 w-4 flex-shrink-0" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-sm"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          />
          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in border border-gray-100 dark:border-gray-700 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                  <Trash2 className="h-6 w-6 text-red-500 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary dark:text-gray-100 font-display">
                  Delete Note?
                </h3>
              </div>
              <p className="text-text-secondary dark:text-gray-300 mb-6">
                Are you sure you want to delete <span className="font-semibold">&quot;{note.title}&quot;</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm bg-white dark:bg-gray-800 text-text-secondary dark:text-gray-300 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded-full border-2 border-red-500 hover:bg-red-600 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-1.5 min-h-[40px]"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

