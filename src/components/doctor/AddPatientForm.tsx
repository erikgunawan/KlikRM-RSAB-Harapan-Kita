import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Patient } from '../../types';
import toast from 'react-hot-toast';

interface AddPatientFormProps {
  onSuccess: (patient: Patient) => void;
}

export function AddPatientForm({ onSuccess }: AddPatientFormProps) {
  const [loading, setLoading] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    date_of_birth: '',
    medical_record_number: '',
  });

  async function addNewPatient(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase
      .from('patients')
      .insert([newPatient])
      .select()
      .single();
      
    if (error) {
      toast.error('Error adding patient');
      setLoading(false);
      return;
    }
    
    toast.success('Patient added successfully');
    onSuccess(data);
    setNewPatient({ name: '', date_of_birth: '', medical_record_number: '' });
    setLoading(false);
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <UserPlus className="h-5 w-5 mr-2" />
        Add New Patient
      </h3>
      <form onSubmit={addNewPatient} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={newPatient.name}
          onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <input
          type="date"
          value={newPatient.date_of_birth}
          onChange={(e) => setNewPatient({ ...newPatient, date_of_birth: e.target.value })}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <input
          type="text"
          placeholder="Medical Record Number"
          value={newPatient.medical_record_number}
          onChange={(e) => setNewPatient({ ...newPatient, medical_record_number: e.target.value })}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          Add Patient
        </button>
      </form>
    </div>
  );
}