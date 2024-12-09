export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  medicalRecordNumber: string;
}

export interface Examination {
  id: string;
  patientId: string;
  date: string;
  status: string;
  notes: string;
}