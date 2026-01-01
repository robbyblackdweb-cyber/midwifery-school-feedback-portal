import { FeedbackCategory, YearOfStudy } from './types';

export const APP_NAME = "Midwifery School Feedback Portal";
export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "password123"; // In a real app, this would be hashed/salted in backend

export const CATEGORIES = Object.values(FeedbackCategory);
export const YEARS_OF_STUDY = Object.values(YearOfStudy);

export const MIN_CHARS = 50;
export const MAX_CHARS = 500;

export const RATE_LIMIT_KEY = 'msf_last_submit';
export const RATE_LIMIT_DURATION_MS = 60000; // 1 minute

export const HARASSMENT_WARNING = `
  IMPORTANT: If this is an urgent or life-threatening situation, please contact emergency services or the school’s official reporting channels immediately.
  
  This platform is for anonymous reporting and feedback, not emergency response.
`;