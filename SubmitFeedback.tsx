import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { CATEGORIES, YEARS_OF_STUDY, MIN_CHARS, MAX_CHARS, HARASSMENT_WARNING } from '../constants';
import { FeedbackCategory, YearOfStudy } from '../types';
import { submitFeedback } from '../services/api';
import Button from '../components/Button';

const SubmitFeedback: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<FeedbackCategory | ''>('');
  const [yearOfStudy, setYearOfStudy] = useState<YearOfStudy | ''>('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [showHarassmentWarning, setShowHarassmentWarning] = useState(false);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as FeedbackCategory;
    setCategory(val);
    if (val === FeedbackCategory.HARASSMENT) {
      setShowHarassmentWarning(true);
    } else {
      setShowHarassmentWarning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !message) return;
    
    setIsSubmitting(true);
    setError(null);

    const result = await submitFeedback({
      category,
      message,
      yearOfStudy: yearOfStudy || undefined
    });

    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      window.scrollTo(0, 0);
    } else {
      setError(result.error || "An unexpected error occurred.");
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-12 bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Feedback Received</h2>
        <p className="text-slate-600 mb-8">
          Thank you for your submission. Your identity has not been recorded.
        </p>
        <Button onClick={() => navigate('/')} variant="outline">
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Submit Feedback</h1>
        <p className="text-slate-500 mt-2">
          Your submission is anonymous. Do not include your name in the message.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200">
        
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm border border-red-200">
            {error}
          </div>
        )}

        {/* Category Selection */}
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium text-slate-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            required
            value={category}
            onChange={handleCategoryChange}
            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2.5 px-3 border bg-white"
          >
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Harassment Warning Alert */}
        {showHarassmentWarning && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">Urgent Notice</h3>
                <div className="mt-2 text-sm text-amber-700 whitespace-pre-line">
                  {HARASSMENT_WARNING}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Year of Study */}
        <div className="space-y-2">
          <label htmlFor="year" className="block text-sm font-medium text-slate-700">
            Year of Study <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <select
            id="year"
            value={yearOfStudy}
            onChange={(e) => setYearOfStudy(e.target.value as YearOfStudy)}
            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2.5 px-3 border bg-white"
          >
            <option value="">Prefer not to say</option>
            {YEARS_OF_STUDY.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-slate-700">
            Message <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <textarea
              id="message"
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 px-3 py-2 border sm:text-sm"
              placeholder="Write your feedback here..."
            />
            <div className={`absolute bottom-2 right-2 text-xs ${message.length < MIN_CHARS || message.length > MAX_CHARS ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
              {message.length} / {MAX_CHARS}
            </div>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Info className="h-3 w-3" />
            Between {MIN_CHARS} and {MAX_CHARS} characters.
          </p>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full text-lg py-3"
            isLoading={isSubmitting}
            disabled={message.length < MIN_CHARS || message.length > MAX_CHARS || !category}
          >
            Submit Securely
          </Button>
        </div>

      </form>
    </div>
  );
};

export default SubmitFeedback;