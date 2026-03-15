import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Clock, X, FileText, Video, ClipboardList, Loader2, AlertCircle } from 'lucide-react';
import { teacherAPI } from '../../services/api';

const AllocatedSubjects = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teacherAPI.getClasses();
      
      if (response.data.success) {
        const classrooms = response.data.data.classrooms || [];
        // Group by subject to combine multiple classes
        const subjectMap = {};
        
        classrooms.forEach(classroom => {
          const subjectName = classroom.subject || 'General';
          if (!subjectMap[subjectName]) {
            subjectMap[subjectName] = {
              name: subjectName,
              classes: [],
              students: 0,
              schedule: 'Not scheduled'
            };
          }
          subjectMap[subjectName].classes.push(classroom.className);
          subjectMap[subjectName].students += classroom.students?.length || 0;
        });
        
        setSubjects(Object.values(subjectMap));
      }
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-cyan-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="text-red-500" size={48} />
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={fetchSubjects}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Allocated Subjects</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your assigned subjects and classes</p>
      </div>

      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{subject.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Subject</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Classes:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {subject.classes.join(', ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <Users size={14} className="mr-1" />
                    Students:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{subject.students}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <Clock size={14} className="mr-1" />
                    Schedule:
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{subject.schedule}</p>
              </div>

              <button 
                onClick={() => setSelectedSubject(subject)}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Manage Subject
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No subjects allocated</h3>
          <p className="text-gray-600 dark:text-gray-400">Contact admin to get subjects assigned</p>
        </div>
      )}
    </div>

    {/* Subject Management Modal */}
    {selectedSubject && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedSubject.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Subject Management</p>
            </div>
            <button
              onClick={() => setSelectedSubject(null)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Subject Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                <div className="text-sm text-gray-500 dark:text-gray-400">Classes</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{selectedSubject.classes.join(', ')}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Students</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{selectedSubject.students}</div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
              <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Schedule</div>
              <div className="text-gray-900 dark:text-white font-medium">{selectedSubject.schedule}</div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
              
              <button
                onClick={() => {
                  setSelectedSubject(null);
                  navigate('/teacher/students', { state: { subject: selectedSubject.name } });
                }}
                className="w-full flex items-center gap-3 p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <Users className="text-blue-600" size={24} />
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">View Students</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Manage class roster and attendance</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedSubject(null);
                  navigate('/teacher/materials', { state: { subject: selectedSubject.name } });
                }}
                className="w-full flex items-center gap-3 p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <FileText className="text-yellow-600" size={24} />
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">Upload Materials</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Add notes, videos, and resources</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedSubject(null);
                  navigate('/teacher/quiz', { state: { subject: selectedSubject.name } });
                }}
                className="w-full flex items-center gap-3 p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <ClipboardList className="text-green-600" size={24} />
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">Create Quiz</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Set up assessments for this subject</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedSubject(null);
                  navigate('/teacher/virtual-class', { state: { subject: selectedSubject.name } });
                }}
                className="w-full flex items-center gap-3 p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <Video className="text-purple-600" size={24} />
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">Start Virtual Class</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Begin live session for this subject</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default AllocatedSubjects;
