'use client';

import { useState, useEffect } from 'react';
import { Note, Stream, Subject, Medium } from '@/lib/types';
import { searchNotes } from '@/lib/supabase/notes';
import { NoteCard } from '@/components/NoteCard';
import { FilterPanel } from '@/components/FilterPanel';
import { Search, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">A/L நோTස්</h1>
            </Link>
            <Link href="/upload" className="btn-primary">
              Upload Notes
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="input-field pl-12"
              />
            </div>
            <button onClick={handleSearch} className="btn-primary">
              Search
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
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                <span className="ml-3 text-gray-600">Loading notes...</span>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-600 text-lg mb-2">No notes found</p>
                <p className="text-gray-500">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
}

