import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search, UserCheck, UserX } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import TeacherModal from './TeacherModal';
import TeacherDetailModal from './TeacherDetailModal';
import toast from 'react-hot-toast';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await adminAPI.getTeachers();
      setTeachers(response.data.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;

    try {
      await adminAPI.deleteTeacher(teacherId);
      fetchTeachers();
      toast.success('Teacher deleted successfully');
    } catch (error) {
      toast.error('Failed to delete teacher');
    }
  };

  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setShowModal(true);
  };

  const handleCreateTeacher = () => {
    setSelectedTeacher(null);
    setShowModal(true);
  };

  const handleModalSuccess = () => {
    fetchTeachers();
    setShowModal(false);
    setSelectedTeacher(null);
  };

  const handleToggleStatus = async (teacherId, currentStatus) => {
    try {
      await adminAPI.toggleTeacherStatus(teacherId);
      fetchTeachers();
      toast.success(`Teacher ${currentStatus ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      toast.error('Failed to update teacher status');
    }
  };

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDetailModal(true);
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjects?.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage teachers and their assignments</p>
        </div>
        <button
          onClick={handleCreateTeacher}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Teacher</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search teachers..."
          className="pl-10 form-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Teachers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="table-header">Teacher</th>
                <th className="table-header">Subjects</th>
                <th className="table-header">Classes</th>
                <th className="table-header">Qualifications</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {teacher.userId?.fullName?.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {teacher.userId?.fullName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {teacher.userId?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects?.map((subject, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {teacher.assignedClasses?.join(', ') || 'None'}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {teacher.qualifications}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      teacher.userId?.isActive
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                    }`}>
                      {teacher.userId?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewDetails(teacher)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditTeacher(teacher)}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(teacher._id, teacher.userId?.isActive)}
                        className={`p-2 rounded-lg ${
                          teacher.userId?.isActive
                            ? 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                            : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                        title={teacher.userId?.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {teacher.userId?.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher._id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredTeachers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">No teachers found</div>
        </div>
      )}

      {/* Teacher Modal */}
      <TeacherModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        teacher={selectedTeacher}
        onSuccess={handleModalSuccess}
      />

      {/* Teacher Detail Modal */}
      <TeacherDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        teacher={selectedTeacher}
      />
    </div>
  );
};

export default TeacherManagement;