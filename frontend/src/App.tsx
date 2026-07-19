import { useState } from 'react';
import StudentSearch from './components/StudentSearch';
import TranscriptView from './components/TranscriptView';

function App() {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 mb-2">
            Marks Entry System
          </h1>
          <p className="text-lg text-slate-500">
            Official Transcript Generator Module
          </p>
        </header>
        
        <main>
          {selectedStudentId ? (
            <TranscriptView 
              studentId={selectedStudentId} 
              onBack={() => setSelectedStudentId(null)} 
            />
          ) : (
            <StudentSearch onSelectStudent={setSelectedStudentId} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
