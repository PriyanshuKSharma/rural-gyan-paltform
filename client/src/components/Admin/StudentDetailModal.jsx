import React from 'react';
import { X, Mail, User, GraduationCap, Phone, MapPin, Calendar, CheckCircle, XCircle, Hash } from 'lucide-react';

const StudentDetailModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;

  const getAttendancePercentage = () => {
    return student.getAttendancePercentage ? student.getAttendancePercentage() : 95;
  };

  const getAverageMarks = () => {
    return student.getAverageMarks ? student.getAverageMarks() : 85;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Details</h2>
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
                {student.userId?.fullName?.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {student.userId?.fullName}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                <Mail size={16} />
                <span>{student.userId?.email}</span>
              </p>
              <div className="flex items-center space-x-4 mt-2">
                {student.userId?.isActive ? (
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
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Grade {student.standard}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {getAttendancePercentage()}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Attendance</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {getAverageMarks()}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Marks</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {student.performance?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Exams</div>
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
                  {student.userId?.username}
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Hash size={16} />
                  <span>Enrollment Number</span>
                </label>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg font-mono">
                  {student.enrollNo}
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <GraduationCap size={16} />
                  <span>Grade/Standard</span>
                </label>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  Grade {student.standard}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone size={16} />
                  <span>Parent's Contact</span>
                </label>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {student.parentsContact}
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar size={16} />
                  <span>Joined Date</span>
                </label>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {new Date(student.userId?.createdAt || student.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin size={16} />
              <span>Address</span>
            </label>
            <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              {student.address}
            </p>
          </div>

          {/* Performance History */}
          {student.performance && student.performance.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Performance</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {student.performance.slice(-5).map((perf, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">{perf.subject}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({perf.examType})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {perf.marks}/{perf.totalMarks}
                      </span>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.round((perf.marks / perf.totalMarks) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Account Information */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Account Status:</span>
                <span className={`font-medium ${
                  student.userId?.isActive 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {student.userId?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Role:</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {student.userId?.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(student.updatedAt).toLocaleDateString()}
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

export default StudentDetailModal;