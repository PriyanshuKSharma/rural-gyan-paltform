import React from 'react';
import { X, Mail, User, BookOpen, GraduationCap, Calendar, CheckCircle, XCircle } from 'lucide-react';

const TeacherDetailModal = ({ isOpen, onClose, teacher }) => {
  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {teacher.userId?.fullName?.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {teacher.userId?.fullName}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                <Mail size={16} />
                <span>{teacher.userId?.email}</span>
              </p>
              <div className="flex items-center space-x-2 mt-2">
                {teacher.userId?.isActive ? (
                  <span className="flex items-center space-x-1 text-green-600">
                    <CheckCircle size={16} />
                    <span className="text-sm font-medium">Active</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-red-600">
                    <XCircle size={16} />
                    <span className="text-sm font-medium">Inactive</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User size={16} />
                  <span>Username</span>
                </label>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {teacher.userId?.username}
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar size={16} />
                  <span>Joined Date</span>
                </label>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {new Date(teacher.userId?.createdAt || teacher.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <GraduationCap size={16} />
                  <span>Qualifications</span>
                </label>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {teacher.qualifications || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <BookOpen size={16} />
              <span>Subjects Teaching</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {teacher.subjects?.length > 0 ? (
                teacher.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-lg text-sm font-medium"
                  >
                    {subject}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 dark:text-gray-400 italic">No subjects assigned</span>
              )}
            </div>
          </div>

          {/* Assigned Classes */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <GraduationCap size={16} />
              <span>Assigned Classes</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {teacher.assignedClasses?.length > 0 ? (
                teacher.assignedClasses.map((className, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg text-sm font-medium"
                  >
                    Grade {className}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 dark:text-gray-400 italic">No classes assigned</span>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Account Status:</span>
                <span className={`font-medium ${
                  teacher.userId?.isActive 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {teacher.userId?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Role:</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {teacher.userId?.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(teacher.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailModal;