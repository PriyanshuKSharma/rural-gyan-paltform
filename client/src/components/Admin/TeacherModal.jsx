import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const TeacherModal = ({ isOpen, onClose, teacher, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    qualifications: '',
    subjects: [''],
    assignedClasses: ['']
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teacher) {
      setFormData({
        username: teacher.userId?.username || '',
        email: teacher.userId?.email || '',
        password: '',
        fullName: teacher.userId?.fullName || '',
        qualifications: teacher.qualifications || '',
        subjects: teacher.subjects?.length ? teacher.subjects : [''],
        assignedClasses: teacher.assignedClasses?.length ? teacher.assignedClasses : ['']
      });
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        fullName: '',
        qualifications: '',
        subjects: [''],
        assignedClasses: ['']
      });
    }
  }, [teacher]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        subjects: formData.subjects.filter(s => s.trim()),
        assignedClasses: formData.assignedClasses.filter(c => c.trim())
      };

      if (teacher) {
        await adminAPI.updateTeacher(teacher._id, submitData);
        toast.success('Teacher updated successfully');
      } else {
        await adminAPI.createTeacher(submitData);
        toast.success('Teacher created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const addSubject = () => {
    setFormData({ ...formData, subjects: [...formData.subjects, ''] });
  };

  const removeSubject = (index) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((_, i) => i !== index)
    });
  };

  const updateSubject = (index, value) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index] = value;
    setFormData({ ...formData, subjects: newSubjects });
  };

  const addClass = () => {
    setFormData({ ...formData, assignedClasses: [...formData.assignedClasses, ''] });
  };

  const removeClass = (index) => {
    setFormData({
      ...formData,
      assignedClasses: formData.assignedClasses.filter((_, i) => i !== index)
    });
  };

  const updateClass = (index, value) => {
    const newClasses = [...formData.assignedClasses];
    newClasses[index] = value;
    setFormData({ ...formData, assignedClasses: newClasses });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {teacher ? 'Edit Teacher' : 'Add New Teacher'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!!teacher}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {!teacher && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  minLength={6}
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Qualifications
              </label>
              <textarea
                required
                rows={3}
                className="form-input"
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                placeholder="e.g., M.Sc. Mathematics, B.Ed."
              />
            </div>
          </div>

          {/* Subjects */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subjects
              </label>
              <button
                type="button"
                onClick={addSubject}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
              >
                <Plus size={16} />
                <span>Add Subject</span>
              </button>
            </div>
            <div className="space-y-2">
              {formData.subjects.map((subject, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="form-input flex-1"
                    value={subject}
                    onChange={(e) => updateSubject(index, e.target.value)}
                    placeholder="Subject name"
                  />
                  {formData.subjects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubject(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Classes */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Assigned Classes
              </label>
              <button
                type="button"
                onClick={addClass}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
              >
                <Plus size={16} />
                <span>Add Class</span>
              </button>
            </div>
            <div className="space-y-2">
              {formData.assignedClasses.map((className, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <select
                    className="form-input flex-1"
                    value={className}
                    onChange={(e) => updateClass(index, e.target.value)}
                  >
                    <option value="">Select Grade</option>
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(grade => (
                      <option key={grade} value={grade}>Grade {grade}</option>
                    ))}
                  </select>
                  {formData.assignedClasses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeClass(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Saving...' : (teacher ? 'Update Teacher' : 'Create Teacher')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherModal;