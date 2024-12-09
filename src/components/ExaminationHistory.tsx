import { Examination } from '../types';

interface ExaminationHistoryProps {
  examinations: Examination[];
  patientName?: string;
}

export function ExaminationHistory({ examinations, patientName }: ExaminationHistoryProps) {
  if (examinations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No examination records found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {patientName && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900">
            Patient: {patientName}
          </h3>
        </div>
      )}
      <div className="grid gap-4">
        {examinations.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(exam.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={clsx(
                    'px-3 py-1 rounded-full text-sm font-medium',
                    {
                      'bg-green-100 text-green-800': exam.status === 'Completed',
                      'bg-yellow-100 text-yellow-800': exam.status === 'In Progress',
                      'bg-blue-100 text-blue-800': exam.status === 'Scheduled',
                    }
                  )}
                >
                  {exam.status}
                </span>
              </div>
              <div className="prose prose-sm">
                <h4 className="text-sm font-medium text-gray-900 mb-1">Notes</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{exam.notes}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}