import React from 'react';
import { BookOpen, Users, Clock, Calendar } from 'lucide-react';

const AllocatedSubjects = () => {
  const subjects = [
    { name: 'Mathematics', classes: ['10A', '10B'], students: 45, schedule: 'Mon, Wed, Fri - 9:00 AM' },
    { name: 'Physics', classes: ['11A'], students: 25, schedule: 'Tue, Thu - 10:00 AM' },
    { name: 'Chemistry', classes: ['11B', '12A'], students: 38, schedule: 'Mon, Wed - 2:00 PM' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Allocated Subjects</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your assigned subjects and classes</p>
      </div>

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

            <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Manage Subject
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllocatedSubjects;