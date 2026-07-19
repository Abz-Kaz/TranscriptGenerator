import { useState, useEffect } from 'react';

interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
}

interface Grade {
  id: number;
  course: Course;
  marks_obtained: number;
  max_marks: number;
  grade_letter: string;
}

interface SemesterRecord {
  semester: { name: string };
  grades: Grade[];
  gpa: number;
}

interface TranscriptData {
  student: {
    first_name: string;
    last_name: string;
    registration_number: string;
    major: string;
  };
  semesters: SemesterRecord[];
  cgpa: number;
  total_credits: number;
}

export default function TranscriptView({ studentId, onBack }: { studentId: number, onBack: () => void }) {
  const [data, setData] = useState<TranscriptData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTranscript();
  }, [studentId]);

  const fetchTranscript = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/students/${studentId}/transcript`);
      const transcriptData = await response.json();
      setData(transcriptData);
    } catch (error) {
      console.error('Error fetching transcript:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    window.open(`${apiUrl}/students/${studentId}/transcript/pdf`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-10 text-red-500">Failed to load transcript.</div>;
  }

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-xl p-8">
      <button 
        className="mb-6 text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors" 
        onClick={onBack}
      >
        <span>&larr;</span> Back to Search
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Academic Transcript</h2>
          <div>
            <div className="text-xl font-medium text-slate-700">
              {data.student.first_name} {data.student.last_name}
            </div>
            <div className="text-sm text-slate-500 tracking-wide uppercase mt-1">
              Registration: {data.student.registration_number}
            </div>
          </div>
        </div>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-all hover:-translate-y-0.5"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Download PDF
        </button>
      </div>

      <div className="space-y-8">
        {data.semesters.map((semRecord, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-blue-50 px-6 py-4 flex justify-between items-center border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 m-0">{semRecord.semester.name}</h3>
              <div className="font-bold text-blue-700">GPA: {semRecord.gpa.toFixed(2)}</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Course Code</th>
                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Name</th>
                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Credits</th>
                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Marks</th>
                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {semRecord.grades.map((grade) => {
                    const gradeColors: Record<string, string> = {
                      'A': 'bg-green-100 text-green-800',
                      'B': 'bg-blue-100 text-blue-800',
                      'C': 'bg-yellow-100 text-yellow-800',
                      'D': 'bg-orange-100 text-orange-800',
                      'F': 'bg-red-100 text-red-800',
                    };
                    const colorClass = gradeColors[grade.grade_letter] || 'bg-slate-100 text-slate-800';

                    return (
                      <tr key={grade.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-medium text-slate-700">{grade.course.code}</td>
                        <td className="px-6 py-4 text-slate-600">{grade.course.name}</td>
                        <td className="px-6 py-4 text-slate-600">{grade.course.credits}</td>
                        <td className="px-6 py-4 text-slate-600">{grade.marks_obtained}/{grade.max_marks}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${colorClass}`}>
                            {grade.grade_letter}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex flex-col md:flex-row gap-8 shadow-lg">
        <div>
          <div className="text-sm text-blue-200 uppercase tracking-wider font-semibold mb-1">Cumulative GPA</div>
          <div className="text-4xl font-bold">{data.cgpa.toFixed(2)}</div>
        </div>
        <div className="hidden md:block w-px bg-blue-400/50"></div>
        <div>
          <div className="text-sm text-blue-200 uppercase tracking-wider font-semibold mb-1">Total Credits</div>
          <div className="text-4xl font-bold">{data.total_credits}</div>
        </div>
        <div className="hidden md:block w-px bg-blue-400/50"></div>
        <div>
          <div className="text-sm text-blue-200 uppercase tracking-wider font-semibold mb-1">Major</div>
          <div className="text-2xl font-semibold mt-1">{data.student.major}</div>
        </div>
      </div>
    </div>
  );
}
