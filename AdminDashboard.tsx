import React, { useEffect, useState } from 'react';
import { Filter, Inbox, CheckCircle, Trash2, AlertCircle } from 'lucide-react';
import { FeedbackRecord, FeedbackStatus, FeedbackCategory } from '../types';
import { getFeedbacks, updateFeedbackStatus, deleteFeedback } from '../services/api';
import { CATEGORIES } from '../constants';
import Button from '../components/Button';

const AdminDashboard: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const fetchData = async () => {
    setLoading(true);
    const result = await getFeedbacks();
    if (result.success && result.data) {
      setFeedbacks(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: FeedbackStatus) => {
    // Optimistic UI update
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
    await updateFeedbackStatus(id, newStatus);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this feedback? This action cannot be undone.")) {
      setFeedbacks(prev => prev.filter(f => f.id !== id));
      await deleteFeedback(id);
    }
  };

  const filteredFeedbacks = feedbacks.filter(f => {
    const catMatch = filterCategory === 'All' || f.category === filterCategory;
    const statMatch = filterStatus === 'All' || f.status === filterStatus;
    return catMatch && statMatch;
  });

  const getStatusColor = (status: FeedbackStatus) => {
    switch (status) {
      case FeedbackStatus.NEW: return 'bg-blue-100 text-blue-800';
      case FeedbackStatus.UNDER_REVIEW: return 'bg-amber-100 text-amber-800';
      case FeedbackStatus.ADDRESSED: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm">Manage student feedback anonymously.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-md border-slate-300 text-sm shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border-slate-300 text-sm shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="All">All Statuses</option>
            {Object.values(FeedbackStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          
          <Button variant="secondary" onClick={fetchData} className="px-3">Refresh</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200 border-dashed">
          <Inbox className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">No feedback found</h3>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or wait for new submissions.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredFeedbacks.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 transition hover:shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">{item.category}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex gap-2">
                    <span>{item.date}</span>
                    {item.yearOfStudy && <span>• {item.yearOfStudy}</span>}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select 
                    value={item.status}
                    onChange={(e) => handleStatusUpdate(item.id, e.target.value as FeedbackStatus)}
                    className="text-xs border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500 py-1"
                  >
                    {Object.values(FeedbackStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                    title="Delete Submission"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                {item.message}
              </div>

              {item.category === FeedbackCategory.HARASSMENT && (
                 <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                   <AlertCircle className="h-4 w-4" />
                   <span>Harassment report - Handle with strict confidentiality.</span>
                 </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;