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
  service: 'Laboratorium' | 'Farmasi' | 'Radiologi';
  examination_types: string[];
  status: string;
  notes: string;
  examined_at: string;
  doctor_name: string;
  examination_status: 'Sampel diterima' | 'Sedang dalam proses' | 'Analisis Dokter' | 'Hasil sudah diambil';
}

export const EXAMINATION_TYPES = [
  'Analisa Kromosom Darah Tepi',
  'Analisa Kromosom Darah Tali Pusat Prenatal',
  'Analisa Kromosom Darah Tali Pusat Postnatal',
  'Analisa Kromosom Cairan Amnion',
  'Analisa Kromosom Jaringan Produk Konsepsi (PoC)',
  'Chromosomal Micro Array (CMA)',
  'DNA Thalassemia Alpha',
  'DNA Thalassemia Beta',
  'Pre Implantation Genetic Test for Aneuploidy (PGT-A)',
  'NIPT'
] as const;

export const SERVICES = ['Laboratorium', 'Farmasi', 'Radiologi'] as const;

export const EXAMINATION_STATUS = [
  'Sampel diterima',
  'Sedang dalam proses',
  'Analisis Dokter',
  'Hasil sudah diambil'
] as const;