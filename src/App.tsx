import React, { useState } from 'react';
import { Stethoscope, Users } from 'lucide-react';
import DoctorForm from './components/DoctorForm';
import PatientView from './components/PatientView';

function App() {
  const [activeView, setActiveView] = useState<'doctor' | 'patient'>('doctor');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">MedRecord</h1>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveView('doctor')}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                  activeView === 'doctor'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Stethoscope className="w-5 h-5 mr-2" />
                Doctor View
              </button>
              <button
                onClick={() => setActiveView('patient')}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                  activeView === 'patient'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="w-5 h-5 mr-2" />
                Patient View
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {activeView === 'doctor' ? 'Patient Record Entry' : 'View Medical Records'}
            </h2>
            {activeView === 'doctor' ? <DoctorForm /> : <PatientView />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;