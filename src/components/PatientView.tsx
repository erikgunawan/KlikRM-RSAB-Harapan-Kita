import React, { useState } from 'react';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPatientExaminations } from '../services/api';
import type { Examination } from '../types';

export default function PatientView() {
  const [medicalRecordNumber, setMedicalRecordNumber] = useState('');
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const results = await getPatientExaminations(medicalRecordNumber);
      setExaminations(results);
      setSearched(true);
      
      if (results.length === 0) {
        toast.error('No records found for this medical record number.');
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to fetch records. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Medical Record Number</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              required
              className="block w-full rounded-md border-gray-300 pr-10 focus:border-blue-500 focus:ring-blue-500"
              value={medicalRecordNumber}
              onChange={(e) => setMedicalRecordNumber(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching...' : 'Search Records'}
        </button>
      </form>

      {searched && examinations.length > 0 && (
        <div className="mt-8">
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Examination History</h2>
            {examinations.map((exam) => (
              <div
                key={exam.id}
                className="bg-white shadow overflow-hidden sm:rounded-lg p-4 border border-gray-200"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(exam.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="mt-1 text-sm text-gray-900">{exam.status}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="mt-1 text-sm text-gray-900">{exam.notes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}