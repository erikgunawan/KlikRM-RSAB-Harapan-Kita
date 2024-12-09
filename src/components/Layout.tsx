import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, Users, LogIn } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-2 py-2 text-gray-900">
                <Stethoscope className="h-6 w-6 text-blue-600" />
                <span className="ml-2 text-lg font-semibold">MedRecord</span>
              </Link>
              
              <div className="ml-10 flex items-center space-x-4">
                <Link
                  to="/doctor"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/doctor'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Doctor Portal
                  </div>
                </Link>
                <Link
                  to="/patient"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/patient'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <LogIn className="h-4 w-4 mr-1" />
                    Patient Login
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}