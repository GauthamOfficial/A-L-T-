'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { signInWithGoogle, logout } from '@/lib/supabase/auth';
import { uploadNote } from '@/lib/supabase/notes';
import { NoteFormData, Stream, Subject, Medium } from '@/lib/types';
import { STREAMS, SUBJECTS, getSubjectsForStream } from '@/lib/constants';
import { Upload, FileText, Loader2, CheckCircle, LogOut } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">A/L நோTස්</h1>
            </Link>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
              <Link href="/browse" className="text-gray-700 hover:text-primary-600 font-medium">
                Browse Notes
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="text-center mb-8">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Upload Study Notes
            </h2>
            <p className="text-gray-600">
              Help flood-affected students by sharing your study materials
            </p>
          </div>

          {!user ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">
                Please sign in with Google to upload notes
              </p>
              <button onClick={handleSignIn} className="btn-primary">
                Sign in with Google
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF File <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <label htmlFor="file-input" className="cursor-pointer">
                    <span className="text-primary-600 font-semibold">
                      Click to upload
                    </span>{' '}
                    <span className="text-gray-600">or drag and drop</span>
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
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
                  {formData.file && (
                    <p className="text-sm text-gray-700 mt-4">
                      Selected: {formData.file.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
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
    </div>
  );
}

