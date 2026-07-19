import { useState, useEffect } from 'react';

interface Student {
  id: number;
  registration_number: string;
  first_name: string;
  last_name: string;
  email: string;
  major: string;
  enrollment_year: number;
}

export default function StudentSearch({ onSelectStudent }: { onSelectStudent: (id: number) => void }) {
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (searchQuery = '') => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/students?query=${searchQuery}`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents(query);
  };

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold mb-2 text-slate-800">Search Students</h2>
      <p className="text-slate-500 mb-8">Find a student to generate their academic transcript.</p>
      
      <form className="flex gap-3 mb-8" onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search by name or registration number..." 
          className="flex-1 px-5 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          type="submit"
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:translate-y-0"
        >
          Search
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {students.map((student) => (
            <div 
              key={student.id} 
              className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-blue-200 cursor-pointer transition-all duration-300"
              onClick={() => onSelectStudent(student.id)}
            >
              <div className="text-sm font-semibold text-blue-600 tracking-wider mb-1">
                {student.registration_number}
              </div>
              <div className="text-xl font-bold text-slate-800 mb-2">
                {student.first_name} {student.last_name}
              </div>
              <div className="flex flex-col gap-1 text-sm text-slate-500">
                <span>{student.major}</span>
                <span>Enrolled: {student.enrollment_year}</span>
              </div>
            </div>
          ))}
          {students.length === 0 && (
            <div className="col-span-full text-center text-slate-500 py-10">
              No students found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
