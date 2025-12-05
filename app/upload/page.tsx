'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { NoteFormData, Stream, Subject, Medium } from '@/lib/types';
import { STREAMS, SUBJECTS, getSubjectsForStream } from '@/lib/constants';
import { Upload, FileText, Loader2, CheckCircle, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function UploadPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const authLoading = status === 'loading';
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
  }, [formData.stream, availableSubjects, formData.subject]);

  const handleSignIn = async () => {
    try {
      await signIn('google');
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
      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.file);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('stream', formData.stream);
      uploadFormData.append('subject', formData.subject);
      uploadFormData.append('medium', formData.medium);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to upload note');
      }

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
      <div className="min-h-screen bg-gradient-to-br from-bg-blue via-bg-soft to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400 mb-4" />
          <p className="text-text-secondary dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-blue/80 via-bg-soft/80 to-white/80 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-gray-900/80">
      {/* Header - Sticky */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-soft border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-text-primary dark:text-gray-100 group-hover:text-text-primary dark:group-hover:text-gray-100 transition-colors flex-shrink-0" />
              <div className="flex flex-col sm:block">
                <h1 className="text-sm sm:text-xl md:text-2xl font-bold text-text-primary dark:text-gray-100 font-display leading-tight">
                  <span className="block sm:inline">A/L</span>{' '}
                  <span className="block sm:inline">நோTස්</span>
                </h1>
                <p className="text-xs text-text-secondary dark:text-gray-400 hidden sm:block">SL Student Relief</p>
              </div>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              {user && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm text-text-secondary dark:text-gray-300 hidden md:inline truncate max-w-[120px]">
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="btn-secondary text-sm flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 whitespace-nowrap"
                  >
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}
              <Link href="/browse" className="text-text-secondary dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium px-3 sm:px-4 py-2 rounded-full hover:bg-primary-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm sm:text-base whitespace-nowrap">
                Browse
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="card animate-fade-in">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-2xl"></div>
              <div className="bg-gradient-to-br from-primary-100 dark:from-primary-900/30 to-orange-100 dark:to-orange-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto relative z-10 shadow-soft">
                <Upload className="h-10 w-10 text-primary-500 dark:text-primary-400" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-gray-100 mb-3 font-display">
              Upload Study Notes
            </h2>
            <p className="text-text-secondary dark:text-gray-300 text-base sm:text-lg">
              Help flood-affected students by sharing your study materials
            </p>
          </div>

          {!user ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="bg-primary-100 dark:bg-primary-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-8 w-8 text-primary-500 dark:text-primary-400" />
              </div>
              <p className="text-text-secondary dark:text-gray-300 mb-6 text-base sm:text-lg">
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
                <label className="block text-sm font-semibold text-text-primary dark:text-gray-100 mb-2.5">
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
                <label className="block text-sm font-semibold text-text-primary dark:text-gray-100 mb-2.5">
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
                <label className="block text-sm font-semibold text-text-primary dark:text-gray-100 mb-2.5">
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
                <label className="block text-sm font-semibold text-text-primary dark:text-gray-100 mb-2.5">
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
                <label className="block text-sm font-semibold text-text-primary dark:text-gray-100 mb-2.5">
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
                <label className="block text-sm font-semibold text-text-primary dark:text-gray-100 mb-2.5">
                  PDF File <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 sm:p-8 md:p-12 text-center hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50/30 dark:hover:bg-primary-900/20 transition-all duration-200 cursor-pointer group">
                  <label htmlFor="file-input" className="cursor-pointer">
                    <div className="bg-primary-100 dark:bg-primary-900/30 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors">
                      <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-primary-500 dark:text-primary-400" />
                    </div>
                    <p className="text-text-primary dark:text-gray-100 font-semibold mb-2 text-sm sm:text-base">
                      <span className="text-primary-500 dark:text-primary-400">Click to upload</span>
                      <span className="hidden sm:inline"> or drag and drop</span>
                    </p>
                    <p className="text-xs sm:text-sm text-text-secondary dark:text-gray-300">
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
                    <div className="mt-4 p-3 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-xl">
                      <p className="text-sm text-success-600 dark:text-success-400 font-medium flex items-center justify-center space-x-2">
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
      <footer className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-t border-gray-100 dark:border-gray-700 mt-16 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-text-secondary dark:text-gray-400 text-sm">
            © 2025 A/L நோTස් - Helping students recover from natural disasters
          </p>
        </div>
      </footer>
    </div>
  );
}

