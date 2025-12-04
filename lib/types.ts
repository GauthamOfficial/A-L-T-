// Domain Types for A/L Notes Platform

export type Stream = 
  | 'physical_science'
  | 'biological_science'
  | 'commerce'
  | 'arts'
  | 'technology';

export type Medium = 'sinhala' | 'tamil' | 'english';

export type PhysicalScienceSubject = 
  | 'combined_mathematics'
  | 'physics'
  | 'chemistry';

export type BiologicalScienceSubject = 
  | 'biology'
  | 'chemistry'
  | 'physics'
  | 'agricultural_science';

export type CommerceSubject = 
  | 'business_studies'
  | 'accounting'
  | 'economics';

export type ArtsSubject = 
  | 'history'
  | 'political_science'
  | 'geography'
  | 'sinhala'
  | 'tamil'
  | 'english'
  | 'media_studies';

export type TechnologySubject = 
  | 'engineering_tech'
  | 'bio_system_tech'
  | 'science_for_tech'
  | 'information_technology';

export type Subject = 
  | PhysicalScienceSubject
  | BiologicalScienceSubject
  | CommerceSubject
  | ArtsSubject
  | TechnologySubject;

export interface Note {
  id: string;
  title: string;
  description: string;
  stream: Stream;
  subject: Subject;
  medium: Medium;
  fileUrl: string;
  storagePath: string;
  uploadedBy: string;
  uploaderName: string;
  createdAt: any; // PostgreSQL timestamp (ISO string)
  downloadCount: number;
}

export interface NoteFormData {
  title: string;
  description: string;
  stream: Stream;
  subject: Subject;
  medium: Medium;
  file: File | null;
}

