import { FeedbackRecord, FeedbackSubmission, FeedbackStatus, ApiResponse } from '../types';
import { RATE_LIMIT_KEY, RATE_LIMIT_DURATION_MS } from '../constants';

const STORAGE_KEY = 'msf_feedbacks';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get today's date in YYYY-MM-DD
const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// --- Student API ---

export const submitFeedback = async (submission: FeedbackSubmission): Promise<ApiResponse<null>> => {
  await delay(800); // Simulate network

  // 1. Rate Limiting Check
  const lastSubmit = localStorage.getItem(RATE_LIMIT_KEY);
  const now = Date.now();
  if (lastSubmit && now - parseInt(lastSubmit) < RATE_LIMIT_DURATION_MS) {
    return { success: false, error: "Please wait a moment before submitting another feedback." };
  }

  // 2. Validation
  if (!submission.message || submission.message.length < 50 || submission.message.length > 500) {
    return { success: false, error: "Message must be between 50 and 500 characters." };
  }
  if (!submission.category) {
    return { success: false, error: "Category is required." };
  }

  // 3. Create Record
  const newRecord: FeedbackRecord = {
    ...submission,
    id: crypto.randomUUID(),
    date: getTodayDateString(),
    status: FeedbackStatus.NEW,
    isArchived: false,
  };

  // 4. Store
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    const records: FeedbackRecord[] = existingData ? JSON.parse(existingData) : [];
    records.push(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    
    // Set Rate Limit
    localStorage.setItem(RATE_LIMIT_KEY, now.toString());

    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to save feedback. Please try again." };
  }
};

// --- Admin API ---

export const getFeedbacks = async (): Promise<ApiResponse<FeedbackRecord[]>> => {
  await delay(500);
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    const records: FeedbackRecord[] = existingData ? JSON.parse(existingData) : [];
    // Filter out archived (deleted) records
    const activeRecords = records.filter(r => !r.isArchived).sort((a, b) => {
        // Sort by date desc, then by status priority if needed
        return b.date.localeCompare(a.date);
    });
    return { success: true, data: activeRecords };
  } catch (e) {
    return { success: false, error: "Failed to fetch records." };
  }
};

export const updateFeedbackStatus = async (id: string, status: FeedbackStatus): Promise<ApiResponse<null>> => {
  await delay(300);
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    const records: FeedbackRecord[] = existingData ? JSON.parse(existingData) : [];
    const index = records.findIndex(r => r.id === id);
    
    if (index !== -1) {
      records[index].status = status;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      return { success: true };
    }
    return { success: false, error: "Record not found" };
  } catch (e) {
    return { success: false, error: "Update failed" };
  }
};

export const deleteFeedback = async (id: string): Promise<ApiResponse<null>> => {
  await delay(300);
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    const records: FeedbackRecord[] = existingData ? JSON.parse(existingData) : [];
    const index = records.findIndex(r => r.id === id);
    
    if (index !== -1) {
      // Soft delete
      records[index].isArchived = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      return { success: true };
    }
    return { success: false, error: "Record not found" };
  } catch (e) {
    return { success: false, error: "Delete failed" };
  }
};