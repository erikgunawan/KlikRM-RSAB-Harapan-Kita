import { Patient, Examination } from '../types';

export const savePatient = (patient: Patient) => {
  const patients = getPatients();
  patients.push(patient);
  localStorage.setItem('patients', JSON.stringify(patients));
};

export const getPatients = (): Patient[] => {
  const patients = localStorage.getItem('patients');
  return patients ? JSON.parse(patients) : [];
};

export const saveExamination = (examination: Examination) => {
  const examinations = getExaminations();
  examinations.push(examination);
  localStorage.setItem('examinations', JSON.stringify(examinations));
};

export const getExaminations = (): Examination[] => {
  const examinations = localStorage.getItem('examinations');
  return examinations ? JSON.parse(examinations) : [];
};

export const getPatientExaminations = (medicalRecordNumber: string): Examination[] => {
  const patient = getPatients().find(p => p.medicalRecordNumber === medicalRecordNumber);
  if (!patient) return [];
  
  return getExaminations().filter(e => e.patientId === patient.id);
};