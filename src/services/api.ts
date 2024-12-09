import { supabase } from '../lib/supabase';
import type { Patient, Examination } from '../types';

export async function savePatient(patient: Omit<Patient, 'id'>): Promise<Patient | null> {
  try {
    // First check if patient exists
    const { data: existingPatient, error: searchError } = await supabase
      .from('patients')
      .select()
      .eq('medical_record_number', patient.medicalRecordNumber)
      .single();

    if (searchError && searchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw searchError;
    }

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
      throw error;
    }

    return data ? {
      id: data.id,
      name: data.name,
      dateOfBirth: data.date_of_birth,
      medicalRecordNumber: data.medical_record_number,
    } : null;
  } catch (error) {
    console.error('Error in savePatient:', error);
    throw new Error('Failed to save patient');
  }
}

export async function getPatientByMedicalNumber(medicalRecordNumber: string): Promise<Patient | null> {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select()
      .eq('medical_record_number', medicalRecordNumber)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      throw error;
    }

    return data ? {
      id: data.id,
      name: data.name,
      dateOfBirth: data.date_of_birth,
      medicalRecordNumber: data.medical_record_number,
    } : null;
  } catch (error) {
    console.error('Error in getPatientByMedicalNumber:', error);
    throw new Error('Failed to fetch patient');
  }
}

export async function saveExamination(examination: Omit<Examination, 'id' | 'date'>): Promise<Examination | null> {
  try {
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
      throw error;
    }

    return data ? {
      id: data.id,
      patientId: data.patient_id,
      date: data.created_at,
      status: data.status,
      notes: data.notes,
    } : null;
  } catch (error) {
    console.error('Error in saveExamination:', error);
    throw new Error('Failed to save examination');
  }
}

export async function getPatientExaminations(medicalRecordNumber: string): Promise<Examination[]> {
  try {
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select()
      .eq('medical_record_number', medicalRecordNumber)
      .single();

    if (patientError) {
      if (patientError.code === 'PGRST116') { // No rows returned
        return [];
      }
      throw patientError;
    }

    if (!patient) return [];

    const { data: examinations, error: examinationsError } = await supabase
      .from('examinations')
      .select('*')
      .eq('patient_id', patient.id)
      .order('created_at', { ascending: false });

    if (examinationsError) {
      throw examinationsError;
    }

    return examinations.map(exam => ({
      id: exam.id,
      patientId: exam.patient_id,
      date: exam.created_at,
      status: exam.status,
      notes: exam.notes,
    }));
  } catch (error) {
    console.error('Error in getPatientExaminations:', error);
    throw new Error('Failed to fetch examinations');
  }
}