export interface Patient {
  id: string;
  medical_record_number: string;
  name: string;
  date_of_birth: string;
  created_at: string;
}

export interface Examination {
  id: string;
  patient_id: string;
  status: string;
  notes: string;
  examined_at: string;
  doctor_name: string;
}