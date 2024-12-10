import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Patient } from '../../types';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface PatientFormProps {
  patient?: Patient;
  isEdit?: boolean;
  onSuccess: (patient: Patient) => void;
  onCancel?: () => void;
}

export function PatientForm({ patient, isEdit, onSuccess, onCancel }: PatientFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    medical_record_number: '',
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        date_of_birth: patient.date_of_birth.split('T')[0],
        medical_record_number: patient.medical_record_number,
      });
    }
  }, [patient]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && patient) {
        const { data, error } = await supabase
          .from('patients')
          .update(formData)
          .eq('id', patient.id)
          .select()
          .single();

        if (error) throw error;
        toast.success('Patient updated successfully');
        onSuccess(data);
      } else {
        const { data, error } = await supabase
          .from('patients')
          .insert([formData])
          .select()
          .single();

        if (error) throw error;
        toast.success('Patient added successfully');
        onSuccess(data);
        setFormData({ name: '', date_of_birth: '', medical_record_number: '' });
      }
    } catch (error) {
      toast.error(isEdit ? 'Error updating patient' : 'Error adding patient');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <User className="h-5 w-5 mr-2" />
        {isEdit ? 'Edit Patient' : 'Add New Patient'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <input
          type="date"
          value={formData.date_of_birth}
          onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <input
          type="text"
          placeholder="Medical Record Number"
          value={formData.medical_record_number}
          onChange={(e) => setFormData({ ...formData, medical_record_number: e.target.value })}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Patient' : 'Add Patient')}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
