export enum FeedbackCategory {
  ACADEMICS = 'Academics',
  CLINICAL = 'Clinical Posting / Hospital Practice',
  FACILITIES = 'Facilities',
  WELFARE = 'Welfare',
  HARASSMENT = 'Harassment / Misconduct',
  OTHER = 'Other'
}

export enum FeedbackStatus {
  NEW = 'New',
  UNDER_REVIEW = 'Under Review',
  ADDRESSED = 'Addressed'
}

export enum YearOfStudy {
  YEAR_1 = 'Year 1',
  YEAR_2 = 'Year 2',
  YEAR_3 = 'Year 3',
}

export interface FeedbackSubmission {
  category: FeedbackCategory;
  message: string;
  yearOfStudy?: YearOfStudy;
}

export interface FeedbackRecord extends FeedbackSubmission {
  id: string;
  date: string; // YYYY-MM-DD
  status: FeedbackStatus;
  isArchived: boolean; // Soft delete for spam
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}