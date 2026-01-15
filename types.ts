
export interface RawArticle {
  Author_family_name: string;
  author_given_name: string;
  article_title: string;
  received: string | number;
  accepted: string | number;
  article_last_page: number;
  editorial_ms_number: string;
  doi: string;
  rubric: string;
  production_state: string;
  online_first_date: string | number;
  notes_on_issue_building?: string;
  note_for_pe?: string;
}

export interface Article extends RawArticle {
  id: string;
  fullAuthor: string;
  formattedDate: string;
  selected: boolean;
  downloaded: boolean;
  topic: string; // New field for clinical categorization
}

export interface Filters {
  rubrics: string[];
  productionStates: string[];
  topics: string[]; // New filter
  dateRange: [string, string];
}

export const SURGICAL_TOPICS = [
  "Trauma",
  "Orthognathic",
  "Oral Oncology",
  "Reconstruction",
  "Pathology",
  "Dental Implants",
  "Cleft & Craniofacial",
  "Salivary Gland",
  "TMJ",
  "General Oral Surgery"
];
