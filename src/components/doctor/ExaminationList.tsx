import React from 'react';
import { format } from 'date-fns';
import { Pencil } from 'lucide-react';
import { Examination } from '../../types';

interface ExaminationListProps {
  examinations: Examination[];
  onEdit: (examination: Examination) => void;
}

export function ExaminationList({ examinations, onEdit }: ExaminationListProps) {
  return (
    <div className="space-y-4">
      {examinations.map((exam) => (
        <div key={exam.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-sm ${
                exam.examination_status === 'Hasil sudah diambil'
                  ? 'bg-green-100 text-green-800'
                  : exam.examination_status === 'Analisis Dokter'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {exam.examination_status}
              </span>
              <span className="text-sm text-gray-500">
                {format(new Date(exam.examined_at), 'PPp')}
              </span>
            </div>
            <button
              onClick={() => onEdit(exam)}
              className="text-gray-500 hover:text-blue-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Service</p>
              <p className="font-medium">{exam.service}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Doctor</p>
              <p className="font-medium">{exam.doctor_name}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">Type of Examination</p>
            <div className="mt-1 space-y-1">
              {exam.examination_types.map((type) => (
                <p key={type} className="text-sm">• {type}</p>
              ))}
            </div>
          </div>

          {exam.notes && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Notes</p>
              <p className="mt-1 text-sm">{exam.notes}</p>
            </div>
          )}
        </div>
      ))}
      {examinations.length === 0 && (
        <p className="text-center text-gray-500">No examination records found.</p>
      )}
    </div>
  );
}