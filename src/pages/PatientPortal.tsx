import React, { useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { Patient, Examination } from '../types';
import { Search, ClipboardList } from 'lucide-react';

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
      alert('Patient not found');
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Patient Portal</h2>
        
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Search className="h-5 w-5 mr-2" />
            View Your Medical Records
          </h3>
          <form onSubmit={searchPatient} className="space-y-4">
            <input
              type="text"
              placeholder="Enter your Medical Record Number"
              value={searchMRN}
              onChange={(e) => setSearchMRN(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Search Records
            </button>
          </form>
        </div>
      </div>

      {patient && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Medical Record Number</p>
                <p className="font-medium">{patient.medical_record_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium">{format(new Date(patient.date_of_birth), 'PP')}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <ClipboardList className="h-5 w-5 mr-2" />
              Examination History
            </h3>
            <div className="space-y-4">
              {examinations.map((exam) => (
                <div key={exam.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium">{exam.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Doctor</p>
                      <p className="font-medium">{exam.doctor_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{format(new Date(exam.examined_at), 'PPp')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Notes</p>
                      <p className="font-medium">{exam.notes}</p>
                    </div>
                  </div>
                </div>
              ))}
              {examinations.length === 0 && (
                <p className="text-center text-gray-500">No examination records found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}