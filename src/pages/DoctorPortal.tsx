import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { Patient, Examination } from '../types';
import { SearchPatientForm } from '../components/doctor/SearchPatientForm';
import { PatientForm } from '../components/doctor/PatientForm';
import { PatientDetails } from '../components/doctor/PatientDetails';
import { clsx } from 'clsx';

export default function DoctorPortal() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [examinations, setExaminations] = useState<Examination[]>([]);

  function handlePatientFound(newPatient: Patient, newExaminations: Examination[]) {
    setPatient(newPatient);
    setExaminations(newExaminations);
  }

  function handlePatientAdded(newPatient: Patient) {
    setPatient(newPatient);
    setExaminations([]);
    setSelectedIndex(0);
  }

  function handleExaminationAdded(examination: Examination) {
    setExaminations([examination, ...examinations]);
  }

  function handleExaminationUpdated(updatedExamination: Examination) {
    setExaminations(examinations.map(exam => 
      exam.id === updatedExamination.id ? updatedExamination : exam
    ));
  }

  function handlePatientUpdated(updatedPatient: Patient) {
    setPatient(updatedPatient);
  }

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Doctor Portal</h2>
        
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/10 p-1">
            <Tab className={({ selected }) =>
              clsx(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-900 hover:bg-white/[0.12] hover:text-blue-800'
              )
            }>
              Search Patient
            </Tab>
            <Tab className={({ selected }) =>
              clsx(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-900 hover:bg-white/[0.12] hover:text-blue-800'
              )
            }>
              Add New Patient
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-6">
            <Tab.Panel>
              <SearchPatientForm onSuccess={handlePatientFound} />
            </Tab.Panel>
            <Tab.Panel>
              <PatientForm onSuccess={handlePatientAdded} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {patient && selectedIndex === 0 && (
        <PatientDetails
          patient={patient}
          examinations={examinations}
          onExaminationAdded={handleExaminationAdded}
          onExaminationUpdated={handleExaminationUpdated}
          onPatientUpdated={handlePatientUpdated}
        />
      )}
    </div>
  );
}
