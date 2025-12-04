'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { signInWithGoogle, logout } from '@/lib/supabase/auth';
import { uploadNote } from '@/lib/supabase/notes';
import { NoteFormData, Stream, Subject, Medium } from '@/lib/types';
import { STREAMS, SUBJECTS, getSubjectsForStream } from '@/lib/constants';
import { Upload, FileText, Loader2, CheckCircle, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function UploadPage() {
  const { user, loading: authLoading } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    description: '',
    stream: 'physical_science',
    subject: 'combined_mathematics',
    medium: 'sinhala',
    file: null,
  });

  const availableSubjects = getSubjectsForStream(formData.stream);

  useEffect(() => {
    // Reset subject when stream changes
    const subjects = Object.keys(availableSubjects);
    if (subjects.length > 0 && !subjects.includes(formData.subject)) {
      setFormData((prev) => ({
        ...prev,
        subject: subjects[0] as Subject,
      }));
    }
  }, [formData.stream]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in first');
      return;
    }

    if (!formData.file) {
      setError('Please select a PDF file');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      await uploadNote(
        formData,
        user.id,
        user.user_metadata?.full_name || user.email || 'Anonymous'
      );
      setSuccess(true);
      // Reset form
      setFormData({
        title: '',
        description: '',
        stream: 'physical_science',
        subject: 'combined_mathematics',
        medium: 'sinhala',
        file: null,
      });
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      setError(error.message || 'Failed to upload note');
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-blue via-bg-soft to-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500 mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-blue via-bg-soft to-white">
      {/* Header - Sticky */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <BookOpen className="h-8 w-8 text-text-primary group-hover:text-text-primary transition-colors" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-display">A/L நோTස්</h1>
                <p className="text-xs text-text-secondary hidden sm:block">SL Student Relief</p>
              </div>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {user && (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-xs sm:text-sm text-text-secondary hidden sm:inline">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="btn-secondary text-sm flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}
              <Link href="/browse" className="text-text-secondary hover:text-primary-500 font-medium px-3 sm:px-4 py-2 rounded-full hover:bg-primary-50 transition-all duration-200 text-sm sm:text-base">
                Browse
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="card animate-fade-in">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-2xl"></div>
              <div className="bg-gradient-to-br from-primary-100 to-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto relative z-10 shadow-soft">
                <Upload className="h-10 w-10 text-primary-500" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3 font-display">
              Upload Study Notes
            </h2>
            <p className="text-text-secondary text-base sm:text-lg">
              Help flood-affected students by sharing your study materials
            </p>
          </div>

          {!user ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-8 w-8 text-primary-500" />
              </div>
              <p className="text-text-secondary mb-6 text-base sm:text-lg">
                Please sign in with Google to upload notes
              </p>
              <button onClick={handleSignIn} className="btn-primary">
                Sign in with Google
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g., Physics Unit 1 - Mechanics"
                  className="input-field"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of the notes... (optional)"
                  rows={4}
                  className="input-field resize-none"
                />
              </div>

              {/* Stream */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2.5">
                  Stream <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.stream}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stream: e.target.value as Stream,
                    }))
                  }
                  className="input-field"
                >
                  {Object.entries(STREAMS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2.5">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subject: e.target.value as Subject,
                    }))
                  }
                  className="input-field"
                >
                  {Object.entries(availableSubjects).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Medium */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2.5">
                  Medium <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.medium}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      medium: e.target.value as Medium,
                    }))
                  }
                  className="input-field"
                >
                  <option value="sinhala">Sinhala</option>
                  <option value="tamil">Tamil</option>
                  <option value="english">English</option>
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2.5">
                  PDF File <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 sm:p-12 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all duration-200 cursor-pointer group">
                  <label htmlFor="file-input" className="cursor-pointer">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                      <FileText className="h-8 w-8 text-primary-500" />
                    </div>
                    <p className="text-text-primary font-semibold mb-2">
                      <span className="text-primary-500">Click to upload</span>{' '}
                      <span className="text-text-secondary">or drag and drop</span>
                    </p>
                    <p className="text-sm text-text-secondary">
                      PDF only, max 50MB
                    </p>
                    <input
                      id="file-input"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                  </label>
                  {formData.file && (
                    <div className="mt-4 p-3 bg-success-50 border border-success-200 rounded-xl">
                      <p className="text-sm text-success-600 font-medium flex items-center justify-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Selected: {formData.file.name}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="toast-error">
                  <span>{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="toast-success">
                  <CheckCircle className="h-5 w-5" />
                  <span>Note uploaded successfully!</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploading}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    <span>Upload Note</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer - Minimal */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-text-secondary text-sm">
            © 2025 A/L நோTස් - Helping students recover from natural disasters
          </p>
        </div>
      </footer>
    </div>
  );
}

