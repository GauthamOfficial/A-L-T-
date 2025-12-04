'use client';

import { useState, useEffect } from 'react';
import { Note, Stream, Subject, Medium } from '@/lib/types';
import { searchNotes } from '@/lib/supabase/notes';
import { NoteCard } from '@/components/NoteCard';
import { FilterPanel } from '@/components/FilterPanel';
import { Search, Loader2, Upload, FileText, Filter, X } from 'lucide-react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { STREAMS, SUBJECTS, MEDIUMS } from '@/lib/constants';

export default function BrowsePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState<Stream | ''>('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | ''>('');
  const [selectedMedium, setSelectedMedium] = useState<Medium | ''>('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <ThemeToggle />
              <Link href="/upload" className="btn-primary flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-2.5 sm:px-3 md:px-6 whitespace-nowrap" title="Upload Notes">
                <Upload className="h-4 w-4 flex-shrink-0" />
                <span className="hidden md:inline">Upload Notes</span>
                <span className="hidden sm:inline md:hidden">Upload</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search Bar and Mobile Filter Button */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-text-secondary dark:text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="input-field pl-10 sm:pl-12 pr-4 text-sm sm:text-base"
              />
            </div>
            <div className="flex gap-3 sm:gap-4">
              {/* Mobile Filter Button */}
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="btn-secondary flex items-center justify-center space-x-2 lg:hidden min-w-[120px]"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              <button onClick={handleSearch} className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto min-w-[120px]">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
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

          {/* Mobile Filter Drawer */}
          {showMobileFilters && (
            <>
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setShowMobileFilters(false)}
              />
              <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-xl z-50 lg:hidden overflow-y-auto animate-slide-in-right">
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-text-primary dark:text-gray-100">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    aria-label="Close filters"
                  >
                    <X className="h-5 w-5 text-text-secondary dark:text-gray-400" />
                  </button>
                </div>
                <div className="p-4">
                  <FilterPanel
                    selectedStream={selectedStream}
                    selectedSubject={selectedSubject}
                    selectedMedium={selectedMedium}
                    onStreamChange={(stream) => {
                      setSelectedStream(stream);
                    }}
                    onSubjectChange={(subject) => {
                      setSelectedSubject(subject);
                    }}
                    onMediumChange={(medium) => {
                      setSelectedMedium(medium);
                    }}
                    onReset={() => {
                      handleReset();
                      setShowMobileFilters(false);
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Notes Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400 mb-4" />
                <p className="text-text-secondary dark:text-gray-300">Loading notes...</p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="card text-center py-16 animate-fade-in">
                <div className="bg-bg-blue dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-10 w-10 text-text-secondary dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary dark:text-gray-100 mb-2 font-display">No notes found</h3>
                <p className="text-text-secondary dark:text-gray-300 mb-6">
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
            
            {/* Active Filters Display - Mobile */}
            {(selectedStream || selectedSubject || selectedMedium) && (
              <div className="lg:hidden mt-4 flex flex-wrap gap-2">
                {selectedStream && (
                  <button
                    onClick={() => {
                      setSelectedStream('');
                      setSelectedSubject('');
                    }}
                    className="badge badge-primary flex items-center space-x-1"
                  >
                    <span>{STREAMS[selectedStream]}</span>
                    <X className="h-3 w-3" />
                  </button>
                )}
                {selectedSubject && selectedStream && (
                  <button
                    onClick={() => setSelectedSubject('')}
                    className="badge badge-accent flex items-center space-x-1"
                  >
                    <span>{SUBJECTS[selectedStream]?.[selectedSubject] || selectedSubject}</span>
                    <X className="h-3 w-3" />
                  </button>
                )}
                {selectedMedium && (
                  <button
                    onClick={() => setSelectedMedium('')}
                    className="badge badge-orange flex items-center space-x-1"
                  >
                    <span>{MEDIUMS[selectedMedium]}</span>
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}
          </div>
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

