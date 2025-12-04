'use client';

import { Stream, Subject, Medium } from '@/lib/types';
import { STREAMS, SUBJECTS, MEDIUMS, getSubjectsForStream } from '@/lib/constants';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
  selectedStream: Stream | '';
  selectedSubject: Subject | '';
  selectedMedium: Medium | '';
  onStreamChange: (stream: Stream | '') => void;
  onSubjectChange: (subject: Subject | '') => void;
  onMediumChange: (medium: Medium | '') => void;
  onReset: () => void;
}

export function FilterPanel({
  selectedStream,
  selectedSubject,
  selectedMedium,
  onStreamChange,
  onSubjectChange,
  onMediumChange,
  onReset,
}: FilterPanelProps) {
  const availableSubjects = selectedStream
    ? getSubjectsForStream(selectedStream)
    : {};

  const hasActiveFilters = selectedStream || selectedSubject || selectedMedium;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full">
            <Filter className="h-5 w-5 text-primary-500 dark:text-primary-400" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary dark:text-gray-100 font-display">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Reset filters"
          >
            <X className="h-4 w-4 text-text-secondary dark:text-gray-400" />
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Stream Filter */}
        <div>
          <label className="block text-sm font-semibold text-text-primary dark:text-gray-100 mb-2.5">
            Stream
          </label>
          <select
            value={selectedStream}
            onChange={(e) => {
              onStreamChange(e.target.value as Stream | '');
              onSubjectChange(''); // Reset subject when stream changes
            }}
            className="input-field"
          >
            <option value="">All Streams</option>
            {Object.entries(STREAMS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="block text-sm font-semibold text-text-primary dark:text-gray-100 mb-2.5">
            Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value as Subject | '')}
            className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedStream}
          >
            <option value="">All Subjects</option>
            {Object.entries(availableSubjects).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Medium Filter */}
        <div>
          <label className="block text-sm font-semibold text-text-primary dark:text-gray-100 mb-2.5">
            Medium
          </label>
          <select
            value={selectedMedium}
            onChange={(e) => onMediumChange(e.target.value as Medium | '')}
            className="input-field"
          >
            <option value="">All Mediums</option>
            {Object.entries(MEDIUMS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button - Mobile friendly */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="btn-secondary w-full flex items-center justify-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Clear All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}

