import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { ShieldCheck, LogOut } from 'lucide-react';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAdmin }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const isLoginPage = location.pathname === '/admin/login';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-teal-600 p-1.5 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <span className="font-semibold text-slate-800 hidden sm:block">{APP_NAME}</span>
            </Link>
            
            <nav className="flex items-center gap-4">
              {isAdmin ? (
                <button 
                  onClick={logout}
                  className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                !isLoginPage && (
                  <Link 
                    to="/admin/login"
                    className="text-xs text-slate-400 hover:text-teal-600 transition-colors"
                  >
                    Admin Access
                  </Link>
                )
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} {APP_NAME}. All submissions are anonymous.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;