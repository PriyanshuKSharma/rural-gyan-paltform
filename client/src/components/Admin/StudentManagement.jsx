import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await adminAPI.getStudents();
      setStudents(response.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      await adminAPI.deleteStudent(studentId);
      setStudents(students.filter(s => s._id !== studentId));
      toast.success('Student deleted successfully');
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const filteredStudents = students.filter(student =>
    student.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.enrollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.standard?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage students and their academic records</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Student</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search students..."
          className="pl-10 form-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStudents.map((student) => (
          <div key={student._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-lg font-bold">
                  {student.userId?.fullName?.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {student.userId?.fullName}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Grade {student.standard}
              </p>
              
              <p className="text-xs text-gray-500 dark:text-gray-500 font-mono mb-4">
                ID: {student.enrollNo}
              </p>

              <div className="w-full space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Attendance:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {student.getAttendancePercentage ? student.getAttendancePercentage() : '95'}%
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Average:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {student.getAverageMarks ? student.getAverageMarks() : '85'}%
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 w-full">
                <button className="flex-1 p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                  <Eye size={16} className="mx-auto" />
                </button>
                <button className="flex-1 p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                  <Edit size={16} className="mx-auto" />
                </button>
                <button
                  onClick={() => handleDeleteStudent(student._id)}
                  className="flex-1 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={16} className="mx-auto" />
                </button>
              </div>

              <div className="mt-3 w-full">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full w-full justify-center ${
                  student.userId?.isActive
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                }`}>
                  {student.userId?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">No students found</div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredStudents.length} of {students.length} students
        </span>
        <div className="flex space-x-2">
          <button className="btn-secondary">Previous</button>
          <button className="btn-secondary">Next</button>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;