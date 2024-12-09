import { useState } from 'react';
import { PlusCircle, Search, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { ExaminationHistory } from './ExaminationHistory';
import { savePatient, saveExamination, getPatientByMedicalNumber, getPatientExaminations } from '../services/api';
import type { Patient, Examination } from '../types';

const EXAMINATION_STATUS_OPTIONS = [
  { value: '', label: 'Select status' },
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
];

export default function DoctorForm() {
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    medicalRecordNumber: '',
    status: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [examinations, setExaminations] = useState<Examination[]>([]);

  const resetForm = () => {
    setFormData({
      name: '',
      dateOfBirth: '',
      medicalRecordNumber: '',
      status: '',
      notes: '',
    });
    setCurrentPatient(null);
    setExaminations([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let patientId = currentPatient?.id;

      if (!patientId) {
        const patient = await savePatient({
          name: formData.name,
          dateOfBirth: formData.dateOfBirth,
          medicalRecordNumber: formData.medicalRecordNumber,
        });
        patientId = patient?.id;
      }

      if (patientId) {
        await saveExamination({
          patientId,
          status: formData.status,
          notes: formData.notes,
        });

        // Refresh examination list
        const updatedExaminations = await getPatientExaminations(formData.medicalRecordNumber);
        setExaminations(updatedExaminations);

        setFormData(prev => ({
          ...prev,
          status: '',
          notes: '',
        }));

        toast.success('Examination record saved successfully!');
      }
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Failed to save record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = async () => {
    if (!formData.medicalRecordNumber) return;
    
    setIsSearching(true);
    try {
      const patient = await getPatientByMedicalNumber(formData.medicalRecordNumber);
      if (patient) {
        setCurrentPatient(patient);
        setFormData(prev => ({
          ...prev,
          name: patient.name,
          dateOfBirth: patient.dateOfBirth,
        }));
        
        const patientExaminations = await getPatientExaminations(formData.medicalRecordNumber);
        setExaminations(patientExaminations);
        toast.success('Patient found!');
      } else {
        toast.error('No patient found with this medical record number.');
        setCurrentPatient(null);
        setExaminations([]);
      }
    } catch (error) {
      console.error('Error searching patient:', error);
      toast.error('Failed to search patient. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <Button
            variant={mode === 'new' ? 'primary' : 'outline'}
            onClick={() => {
              setMode('new');
              resetForm();
            }}
          >
            New Patient
          </Button>
          <Button
            variant={mode === 'existing' ? 'primary' : 'outline'}
            onClick={() => {
              setMode('existing');
              resetForm();
            }}
          >
            Existing Patient
          </Button>
        </div>
        <Button
          variant="secondary"
          onClick={resetForm}
          className="flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Clear Form
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6">
          <div className="flex gap-4">
            <Input
              label="Medical Record Number"
              required
              value={formData.medicalRecordNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, medicalRecordNumber: e.target.value }))}
              placeholder="Enter medical record number"
            />
            {mode === 'existing' && (
              <Button
                type="button"
                variant="secondary"
                className="mt-7"
                onClick={handleSearch}
                isLoading={isSearching}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            )}
          </div>

          {(mode === 'new' || currentPatient) && (
            <>
              <Input
                label="Patient Name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={mode === 'existing'}
                placeholder="Enter patient name"
              />

              <Input
                label="Date of Birth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                disabled={mode === 'existing'}
              />

              <Select
                label="Examination Status"
                required
                options={EXAMINATION_STATUS_OPTIONS}
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 focus:border-blue-400 transition-colors duration-200"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Enter examination notes"
                />
              </div>

              <Button type="submit" isLoading={isSubmitting} className="mt-4">
                <PlusCircle className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Examination'}
              </Button>
            </>
          )}
        </div>
      </form>

      {examinations.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Examination History</h3>
          <ExaminationHistory examinations={examinations} patientName={currentPatient?.name} />
        </div>
      )}
    </div>
  );
}