import React, { useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { Patient, Examination } from '../types';
import { ClipboardList, Search, UserPlus } from 'lucide-react';

export default function DoctorPortal() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [searchMRN, setSearchMRN] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [newPatient, setNewPatient] = useState({
    name: '',
    date_of_birth: '',
    medical_record_number: '',
  });
  
  const [newExamination, setNewExamination] = useState({
    status: '',
    notes: '',
    doctor_name: '',
  });

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

  async function addNewPatient(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase
      .from('patients')
      .insert([newPatient])
      .select()
      .single();
      
    if (error) {
      alert('Error adding patient');
      setLoading(false);
      return;
    }
    
    setPatient(data);
    setNewPatient({ name: '', date_of_birth: '', medical_record_number: '' });
    setLoading(false);
  }

  async function addExamination(e: React.FormEvent) {
    e.preventDefault();
    if (!patient) return;
    
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
      alert('Error adding examination');
      setLoading(false);
      return;
    }
    
    setExaminations([data[0], ...examinations]);
    setNewExamination({ status: '', notes: '', doctor_name: '' });
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Doctor Portal</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Search Patient */}
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
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Search
              </button>
            </form>
          </div>

          {/* Add New Patient */}
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
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Patient
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Patient Information and Examinations */}
      {patient && (
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
                className="md:col-span-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}