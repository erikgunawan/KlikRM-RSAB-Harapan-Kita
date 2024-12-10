import React, { useState, useEffect } from 'react';
import { ClipboardList } from 'lucide-react';
import { Examination, EXAMINATION_TYPES, SERVICES, EXAMINATION_STATUS } from '../../types';

interface ExaminationFormProps {
  patientId: string;
  onSubmit: (examination: Partial<Examination>) => Promise<void>;
  initialData?: Examination;
  isEdit?: boolean;
  onCancel?: () => void;
}

const defaultFormData = (patientId: string) => ({
  patient_id: patientId,
  service: 'Laboratorium',
  examination_types: [],
  status: '',
  notes: '',
  doctor_name: '',
  examination_status: 'Sampel diterima',
  examined_at: new Date().toISOString().split('T')[0]
});

export function ExaminationForm({ patientId, onSubmit, initialData, isEdit, onCancel }: ExaminationFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Examination>>(
    initialData || defaultFormData(patientId)
  );

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        examined_at: initialData.examined_at.split('T')[0]
      });
    } else {
      setFormData(defaultFormData(patientId));
    }
  }, [initialData, patientId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      if (!isEdit) {
        setFormData(defaultFormData(patientId));
      }
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setFormData(defaultFormData(patientId));
    onCancel?.();
  }

  function handleExaminationTypeChange(type: string) {
    const types = formData.examination_types || [];
    const newTypes = types.includes(type)
      ? types.filter(t => t !== type)
      : [...types, type];
    setFormData({ ...formData, examination_types: newTypes });
  }

  return (
    <div className="border-t pt-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <ClipboardList className="h-5 w-5 mr-2" />
        {isEdit ? 'Edit Examination' : 'Add Examination'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service
            </label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            >
              {SERVICES.map(service => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Examination Date
            </label>
            <input
              type="date"
              value={formData.examined_at?.split('T')[0]}
              onChange={(e) => setFormData({ ...formData, examined_at: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doctor Name
            </label>
            <input
              type="text"
              value={formData.doctor_name}
              onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Examination Status
            </label>
            <select
              value={formData.examination_status}
              onChange={(e) => setFormData({ ...formData, examination_status: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            >
              {EXAMINATION_STATUS.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type of Examination
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {EXAMINATION_TYPES.map(type => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.examination_types?.includes(type)}
                  onChange={() => handleExaminationTypeChange(type)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            rows={3}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Examination' : 'Add Examination')}
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
