'use client';

import { Stream, Subject, Medium } from '@/lib/types';
import { STREAMS, SUBJECTS, MEDIUMS, getSubjectsForStream } from '@/lib/constants';
import { Filter } from 'lucide-react';

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

  return (
    <div className="card mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
      </div>

      <div className="space-y-4">
        {/* Stream Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value as Subject | '')}
            className="input-field"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
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

        {/* Reset Button */}
        {(selectedStream || selectedSubject || selectedMedium) && (
          <button
            onClick={onReset}
            className="btn-secondary w-full"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}

