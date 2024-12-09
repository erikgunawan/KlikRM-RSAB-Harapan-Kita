import { supabase } from '../lib/supabase';
import type { Patient, Examination } from '../types';

export async function savePatient(patient: Omit<Patient, 'id'>): Promise<Patient | null> {
  // First check if patient exists
  const { data: existingPatient } = await supabase
    .from('patients')
    .select()
    .eq('medical_record_number', patient.medicalRecordNumber)
    .single();

  if (existingPatient) {
    return {
      id: existingPatient.id,
      name: existingPatient.name,
      dateOfBirth: existingPatient.date_of_birth,
      medicalRecordNumber: existingPatient.medical_record_number,
    };
  }

  const { data, error } = await supabase
    .from('patients')
    .insert([{
      name: patient.name,
      date_of_birth: patient.dateOfBirth,
      medical_record_number: patient.medicalRecordNumber,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error saving patient:', error);
    throw error;
  }

  return data ? {
    id: data.id,
    name: data.name,
    dateOfBirth: data.date_of_birth,
    medicalRecordNumber: data.medical_record_number,
  } : null;
}

export async function getPatientByMedicalNumber(medicalRecordNumber: string): Promise<Patient | null> {
  const { data, error } = await supabase
    .from('patients')
    .select()
    .eq('medical_record_number', medicalRecordNumber)
    .single();

  if (error) {
    console.error('Error finding patient:', error);
    return null;
  }

  return data ? {
    id: data.id,
    name: data.name,
    dateOfBirth: data.date_of_birth,
    medicalRecordNumber: data.medical_record_number,
  } : null;
}

export async function saveExamination(examination: Omit<Examination, 'id' | 'date'>): Promise<Examination | null> {
  const { data, error } = await supabase
    .from('examinations')
    .insert([{
      patient_id: examination.patientId,
      status: examination.status,
      notes: examination.notes,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error saving examination:', error);
    throw error;
  }

  return data ? {
    id: data.id,
    patientId: data.patient_id,
    date: data.created_at,
    status: data.status,
    notes: data.notes,
  } : null;
}

export async function getPatientExaminations(medicalRecordNumber: string): Promise<Examination[]> {
  const { data: patient } = await supabase
    .from('patients')
    .select()
    .eq('medical_record_number', medicalRecordNumber)
    .single();

  if (!patient) return [];

  const { data: examinations, error: examinationsError } = await supabase
    .from('examinations')
    .select('*')
    .eq('patient_id', patient.id)
    .order('created_at', { ascending: false });

  if (examinationsError) {
    console.error('Error fetching examinations:', examinationsError);
    return [];
  }

  return examinations.map(exam => ({
    id: exam.id,
    patientId: exam.patient_id,
    date: exam.created_at,
    status: exam.status,
    notes: exam.notes,
  }));
}