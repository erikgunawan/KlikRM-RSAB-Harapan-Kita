import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, User } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex-1 flex items-center justify-between">
              <Link to="/" className="flex items-center text-gray-900">
                <img 
                  src="/rsabhk-logo.png" 
                  alt="RSAB Harapan Kita" 
                  className="h-8 w-auto"
                />
                <span className="ml-2 text-sm md:text-base font-semibold">KlikRM - RSAB Harapan Kita</span>
              </Link>
              
              <div className="flex items-center space-x-2 md:space-x-4">
                <Link
                  to="/doctor"
                  className={`px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium ${
                    location.pathname === '/doctor'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="hidden md:inline">Doctor Portal</span>
                    <span className="md:hidden">Doctor</span>
                  </div>
                </Link>
                <Link
                  to="/patient"
                  className={`px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium ${
                    location.pathname === '/patient'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span className="hidden md:inline">Patient Portal</span>
                    <span className="md:hidden">Patient</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="pt-20 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </main>
      
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'text-sm',
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}
