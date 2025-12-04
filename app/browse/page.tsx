'use client';

import { useState, useEffect } from 'react';
import { Note, Stream, Subject, Medium } from '@/lib/types';
import { searchNotes } from '@/lib/supabase/notes';
import { NoteCard } from '@/components/NoteCard';
import { FilterPanel } from '@/components/FilterPanel';
import { Search, Loader2, Upload, FileText } from 'lucide-react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function BrowsePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState<Stream | ''>('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | ''>('');
  const [selectedMedium, setSelectedMedium] = useState<Medium | ''>('');

  useEffect(() => {
    loadNotes();
  }, [selectedStream, selectedSubject, selectedMedium]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const filters = {
        stream: selectedStream || undefined,
        subject: selectedSubject || undefined,
        medium: selectedMedium || undefined,
        searchQuery: searchQuery || undefined,
      };
      const results = await searchNotes(filters);
      setNotes(results);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteDeleted = () => {
    // Reload notes after deletion
    loadNotes();
  };

  const handleSearch = () => {
    loadNotes();
  };

  const handleReset = () => {
    setSelectedStream('');
    setSelectedSubject('');
    setSelectedMedium('');
    setSearchQuery('');
  };

  // Filter notes by search query on client side if needed
  const filteredNotes = searchQuery
    ? notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (note.description && note.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : notes;

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
            <Link href="/upload" className="btn-primary flex items-center justify-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload Notes</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search Bar - Mobile-first */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary pointer-events-none" />
              <input
                type="text"
                placeholder="Search notes by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="input-field pl-12 pr-4"
              />
            </div>
            <button onClick={handleSearch} className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto min-w-[120px]">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              selectedStream={selectedStream}
              selectedSubject={selectedSubject}
              selectedMedium={selectedMedium}
              onStreamChange={setSelectedStream}
              onSubjectChange={setSelectedSubject}
              onMediumChange={setSelectedMedium}
              onReset={handleReset}
            />
          </div>

          {/* Notes Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-primary-500 mb-4" />
                <p className="text-text-secondary">Loading notes...</p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="card text-center py-16 animate-fade-in">
                <div className="bg-bg-blue w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-10 w-10 text-text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2 font-display">No notes found</h3>
                <p className="text-text-secondary mb-6">
                  Try adjusting your filters or search query
                </p>
                <button onClick={handleReset} className="btn-secondary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {filteredNotes.map((note) => (
                  <NoteCard 
                    key={note.id} 
                    note={note} 
                    onDelete={handleNoteDeleted}
                  />
                ))}
              </div>
            )}
          </div>
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

