import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, EyeOff, MessageSquare } from 'lucide-react';
import Button from '../components/Button';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12">
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center justify-center p-3 bg-teal-100 rounded-full mb-4">
          <Shield className="h-8 w-8 text-teal-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Anonymous Student Feedback
        </h1>
        <p className="text-lg text-slate-600">
          Your voice matters. Help us improve the School of Midwifery by sharing your honest feedback, concerns, and suggestions safely and anonymously.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl text-left">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <EyeOff className="h-8 w-8 text-indigo-500 mb-4" />
          <h3 className="font-semibold text-lg text-slate-900 mb-2">100% Anonymous</h3>
          <p className="text-slate-600 text-sm">
            We do not track your name, student ID, IP address, or device information. You are completely safe.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <MessageSquare className="h-8 w-8 text-teal-500 mb-4" />
          <h3 className="font-semibold text-lg text-slate-900 mb-2">Constructive</h3>
          <p className="text-slate-600 text-sm">
            Share feedback on academics, facilities, welfare, or clinical postings to help administration make better decisions.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <Shield className="h-8 w-8 text-rose-500 mb-4" />
          <h3 className="font-semibold text-lg text-slate-900 mb-2">Secure</h3>
          <p className="text-slate-600 text-sm">
            Only authorized administrators can view submissions. No public viewing, comments, or replies.
          </p>
        </div>
      </div>

      <div className="pt-4">
        <Link to="/submit">
          <Button className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
            Submit Feedback Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;