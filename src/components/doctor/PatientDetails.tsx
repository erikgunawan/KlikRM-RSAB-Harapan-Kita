import React, { useState } from 'react';
import { format } from 'date-fns';
import { Pencil } from 'lucide-react';
import { Patient, Examination } from '../../types';
import { ExaminationForm } from './ExaminationForm';
import { ExaminationList } from './ExaminationList';
import { PatientForm } from './PatientForm';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface PatientDetailsProps {
  patient: Patient;
  examinations: Examination[];
  onExaminationAdded: (examination: Examination) => void;
  onExaminationUpdated: (examination: Examination) => void;
  onPatientUpdated: (patient: Patient) => void;
}

export function PatientDetails({
  patient,
  examinations,
  onExaminationAdded,
  onExaminationUpdated,
  onPatientUpdated
}: PatientDetailsProps) {
  const [editingExamination, setEditingExamination] = useState<Examination | null>(null);
  const [isEditingPatient, setIsEditingPatient] = useState(false);

  async function handleSubmitExamination(examinationData: Partial<Examination>) {
    if (editingExamination) {
      const { data, error } = await supabase
        .from('examinations')
        .update(examinationData)
        .eq('id', editingExamination.id)
        .select()
        .single();

      if (error) {
        toast.error('Error updating examination');
        throw error;
      }

      toast.success('Examination updated successfully');
      onExaminationUpdated(data);
      setEditingExamination(null);
    } else {
      const { data, error } = await supabase
        .from('examinations')
        .insert([examinationData])
        .select()
        .single();

      if (error) {
        toast.error('Error adding examination');
        throw error;
      }

      toast.success('Examination added successfully');
      onExaminationAdded(data);
    }
  }

  function handleCancelEdit() {
    setEditingExamination(null);
  }

  function handlePatientUpdated(updatedPatient: Patient) {
    onPatientUpdated(updatedPatient);
    setIsEditingPatient(false);
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        {isEditingPatient ? (
          <PatientForm
            patient={patient}
            isEdit
            onSuccess={handlePatientUpdated}
            onCancel={() => setIsEditingPatient(false)}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Patient Information</h3>
              <button
                onClick={() => setIsEditingPatient(true)}
                className="text-gray-500 hover:text-blue-600"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
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
          </>
        )}
      </div>

      <ExaminationForm
        patientId={patient.id}
        onSubmit={handleSubmitExamination}
        initialData={editingExamination || undefined}
        isEdit={!!editingExamination}
        onCancel={handleCancelEdit}
      />

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Examination History</h3>
        <ExaminationList
          examinations={examinations}
          onEdit={setEditingExamination}
        />
      </div>
    </div>
  );
}
