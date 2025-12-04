import { Stream, Subject } from './types';

export const STREAMS: Record<Stream, string> = {
  physical_science: 'Physical Science',
  biological_science: 'Biological Science',
  commerce: 'Commerce',
  arts: 'Arts',
  technology: 'Technology',
};

export const SUBJECTS: Record<Stream, Record<string, string>> = {
  physical_science: {
    combined_mathematics: 'Combined Mathematics',
    physics: 'Physics',
    chemistry: 'Chemistry',
  },
  biological_science: {
    biology: 'Biology',
    chemistry: 'Chemistry',
    physics: 'Physics',
    agricultural_science: 'Agricultural Science',
  },
  commerce: {
    business_studies: 'Business Studies',
    accounting: 'Accounting',
    economics: 'Economics',
  },
  arts: {
    history: 'History',
    political_science: 'Political Science',
    geography: 'Geography',
    sinhala: 'Sinhala',
    tamil: 'Tamil',
    english: 'English',
    media_studies: 'Media Studies',
  },
  technology: {
    engineering_tech: 'Engineering Tech (ET)',
    bio_system_tech: 'Bio-system Tech (BST)',
    science_for_tech: 'Science for Tech (SFT)',
    information_technology: 'Information Technology',
  },
};

export const MEDIUMS: Record<string, string> = {
  sinhala: 'Sinhala',
  tamil: 'Tamil',
  english: 'English',
};

export const getSubjectsForStream = (stream: Stream): Record<string, string> => {
  return SUBJECTS[stream] || {};
};

