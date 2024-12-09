import React, { useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { Patient, Examination } from '../types';
import { Search, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientPortal() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [searchMRN, setSearchMRN] = useState('');
  const [loading, setLoading] = useState(false);

  async function searchPatient(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('medical_record_number', searchMRN)
      .single();
      
    if (patientError) {
      toast.error('Patient not found');
      setLoading(false);
      return;
    }
    
    setPatient(patientData);
    
    const { data: examinationData } = await supabase
      .from('examinations')
      .select('*')
      .eq('patient_id', patientData.id)
      .order('examined_at', { ascending: false });
      
    setExaminations(examinationData || []);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Patient Portal</h2>
        
        <div className="max-w-md mx-auto">
          <h3 className="text-base md:text-lg font-semibold mb-4 flex items-center">
            <Search className="h-5 w-5 mr-2" />
            View Your Medical Records
          </h3>
          <form onSubmit={searchPatient} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your Medical Record Number"
                value={searchMRN}
                onChange={(e) => setSearchMRN(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg text-sm md:text-base"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base font-medium disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search Records'}
            </button>
          </form>
        </div>
      </div>

      {patient && (
        <div className="bg-white shadow rounded-lg p-4 md:p-6">
          <div className="mb-6">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{patient.name}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Medical Record Number</p>
                <p className="font-medium">{patient.medical_record_number}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium">{format(new Date(patient.date_of_birth), 'PP')}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center">
              <ClipboardList className="h-5 w-5 mr-2" />
              Examination History
            </h3>
            <div className="space-y-4">
              {examinations.map((exam) => (
                <div key={exam.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center">
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {exam.status}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(exam.examined_at), 'PP')}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Doctor</p>
                      <p className="font-medium">{exam.doctor_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Notes</p>
                      <p className="font-medium text-sm">{exam.notes}</p>
                    </div>
                  </div>
                </div>
              ))}
              {examinations.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No examination records found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}