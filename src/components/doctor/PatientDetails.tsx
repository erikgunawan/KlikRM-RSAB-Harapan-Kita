import React, { useState } from 'react';
import { format } from 'date-fns';
import { ClipboardList } from 'lucide-react';
import { Patient, Examination } from '../../types';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface PatientDetailsProps {
  patient: Patient;
  examinations: Examination[];
  onExaminationAdded: (examination: Examination) => void;
}

export function PatientDetails({ patient, examinations, onExaminationAdded }: PatientDetailsProps) {
  const [loading, setLoading] = useState(false);
  const [newExamination, setNewExamination] = useState({
    status: '',
    notes: '',
    doctor_name: '',
  });

  async function addExamination(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase
      .from('examinations')
      .insert([{
        ...newExamination,
        patient_id: patient.id,
        examined_at: new Date().toISOString(),
      }])
      .select();
      
    if (error) {
      toast.error('Error adding examination');
      setLoading(false);
      return;
    }
    
    toast.success('Examination added successfully');
    onExaminationAdded(data[0]);
    setNewExamination({ status: '', notes: '', doctor_name: '' });
    setLoading(false);
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Patient Information</h3>
        <div className="grid grid-cols-2 gap-4">
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
          Add Examination
        </h3>
        <form onSubmit={addExamination} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Status"
            value={newExamination.status}
            onChange={(e) => setNewExamination({ ...newExamination, status: e.target.value })}
            className="px-4 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Doctor Name"
            value={newExamination.doctor_name}
            onChange={(e) => setNewExamination({ ...newExamination, doctor_name: e.target.value })}
            className="px-4 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Notes"
            value={newExamination.notes}
            onChange={(e) => setNewExamination({ ...newExamination, notes: e.target.value })}
            className="px-4 py-2 border rounded-md"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Add Examination
          </button>
        </form>

        <h3 className="text-xl font-semibold mb-4">Examination History</h3>
        <div className="space-y-4">
          {examinations.map((exam) => (
            <div key={exam.id} className="border rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
  );
}