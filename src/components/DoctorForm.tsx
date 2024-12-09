import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Patient, Examination } from '../types';
import { savePatient, saveExamination } from '../utils/storage';

export default function DoctorForm() {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    medicalRecordNumber: '',
    status: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const patient: Patient = {
      id: crypto.randomUUID(),
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      medicalRecordNumber: formData.medicalRecordNumber
    };

    const examination: Examination = {
      id: crypto.randomUUID(),
      patientId: patient.id,
      date: new Date().toISOString(),
      status: formData.status,
      notes: formData.notes
    };

    savePatient(patient);
    saveExamination(examination);
    
    setFormData({
      name: '',
      dateOfBirth: '',
      medicalRecordNumber: '',
      status: '',
      notes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div>
        <label className="block text-sm font-medium text-gray-700">Patient Name</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
        <input
          type="date"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Medical Record Number</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.medicalRecordNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, medicalRecordNumber: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Examination Status</label>
        <select
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
        >
          <option value="">Select status</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Scheduled">Scheduled</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      <button
        type="submit"
        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Add Patient Record
      </button>
    </form>
  );
}