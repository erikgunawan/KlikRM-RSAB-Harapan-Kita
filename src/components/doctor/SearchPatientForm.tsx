import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Patient, Examination } from '../../types';
import toast from 'react-hot-toast';

interface SearchPatientFormProps {
  onSuccess: (patient: Patient, examinations: Examination[]) => void;
}

export function SearchPatientForm({ onSuccess }: SearchPatientFormProps) {
  const [loading, setLoading] = useState(false);
  const [searchMRN, setSearchMRN] = useState('');

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
    
    const { data: examinationData } = await supabase
      .from('examinations')
      .select('*')
      .eq('patient_id', patientData.id)
      .order('examined_at', { ascending: false });
      
    onSuccess(patientData, examinationData || []);
    setLoading(false);
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Search className="h-5 w-5 mr-2" />
        Search Patient
      </h3>
      <form onSubmit={searchPatient} className="space-y-4">
        <input
          type="text"
          placeholder="Medical Record Number"
          value={searchMRN}
          onChange={(e) => setSearchMRN(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Search
        </button>
      </form>
    </div>
  );
}