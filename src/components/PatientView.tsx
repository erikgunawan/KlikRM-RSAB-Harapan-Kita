import React, { useState } from 'react';
import { Search, User, Calendar, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPatientByMedicalNumber, getPatientExaminations } from '../services/api';
import type { Patient, Examination } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export default function PatientView() {
  const [medicalRecordNumber, setMedicalRecordNumber] = useState('');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const patientData = await getPatientByMedicalNumber(medicalRecordNumber);
      setPatient(patientData);
      
      if (patientData) {
        const results = await getPatientExaminations(medicalRecordNumber);
        setExaminations(results);
        setSearched(true);
        
        if (results.length === 0) {
          toast.info('No examination records found for this patient.');
        }
      } else {
        toast.error('No patient found with this medical record number.');
        setExaminations([]);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to fetch records. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMedicalRecordNumber('');
    setPatient(null);
    setExaminations([]);
    setSearched(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="max-w-xl">
        <div className="space-y-4">
          <Input
            label="Medical Record Number"
            required
            value={medicalRecordNumber}
            onChange={(e) => setMedicalRecordNumber(e.target.value)}
            placeholder="Enter your medical record number"
          />

          <div className="flex space-x-4">
            <Button type="submit" isLoading={isLoading} className="flex-1">
              <Search className="w-4 h-4 mr-2" />
              {isLoading ? 'Searching...' : 'Search Records'}
            </Button>
            {searched && (
              <Button type="button" variant="secondary" onClick={handleReset}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </form>

      {patient && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient Information</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-gray-900">{patient.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="text-gray-900">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Medical Record Number</p>
                <p className="text-gray-900">{patient.medicalRecordNumber}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {searched && examinations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Examination History</h2>
          <div className="grid gap-4">
            {examinations.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <p className="text-gray-900 font-medium">
                      {new Date(exam.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      exam.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : exam.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {exam.status}
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{exam.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searched && !patient && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No patient found with the provided medical record number.</p>
        </div>
      )}
    </div>
  );
}