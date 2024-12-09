import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { Patient, Examination } from '../types';
import { SearchPatientForm } from '../components/doctor/SearchPatientForm';
import { AddPatientForm } from '../components/doctor/AddPatientForm';
import { PatientDetails } from '../components/doctor/PatientDetails';
import { clsx } from 'clsx';

export default function DoctorPortal() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [examinations, setExaminations] = useState<Examination[]>([]);

  function handlePatientFound(newPatient: Patient, newExaminations: Examination[]) {
    setPatient(newPatient);
    setExaminations(newExaminations);
  }

  function handlePatientAdded(newPatient: Patient) {
    setPatient(newPatient);
    setExaminations([]);
  }

  function handleExaminationAdded(examination: Examination) {
    setExaminations([examination, ...examinations]);
  }

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Doctor Portal</h2>
        
        <Tab.Group>
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
              <AddPatientForm onSuccess={handlePatientAdded} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {patient && (
        <PatientDetails
          patient={patient}
          examinations={examinations}
          onExaminationAdded={handleExaminationAdded}
        />
      )}
    </div>
  );
}