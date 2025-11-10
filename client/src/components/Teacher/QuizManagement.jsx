import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Eye, Clock, Users, BookOpen } from 'lucide-react';
import { teacherAPI } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';

const QuizManagement = () => {
  const { t } = useTranslation();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await teacherAPI.getQuizzes();
      setQuizzes(response.data.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;

    try {
      await teacherAPI.deleteQuiz(quizId);
      setQuizzes(quizzes.filter(q => q._id !== quizId));
      toast.success('Quiz deleted successfully');
    } catch (error) {
      toast.error('Failed to delete quiz');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Create and manage quizzes for your classes</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Quiz</span>
        </button>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {quiz.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {quiz.description}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingQuiz(quiz)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteQuiz(quiz._id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Class:</span>
                <span className="font-medium text-gray-900 dark:text-white">{quiz.classAssigned}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subject:</span>
                <span className="font-medium text-gray-900 dark:text-white">{quiz.subject}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Questions:</span>
                <span className="font-medium text-gray-900 dark:text-white">{quiz.questions.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                <span className="font-medium text-gray-900 dark:text-white flex items-center">
                  <Clock size={14} className="mr-1" />
                  {quiz.duration} min
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Submissions:</span>
                <span className="font-medium text-gray-900 dark:text-white flex items-center">
                  <Users size={14} className="mr-1" />
                  {quiz.submissions?.length || 0}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span>Start: {new Date(quiz.startTime).toLocaleDateString()}</span>
                <span>End: {new Date(quiz.endTime).toLocaleDateString()}</span>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                  <Eye size={14} className="inline mr-1" />
                  View Results
                </button>
                <button 
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    quiz.isActive 
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {quiz.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {quizzes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No quizzes yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first quiz to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create Quiz
          </button>
        </div>
      )}

      {/* Create/Edit Quiz Modal would go here */}
      {showCreateModal && (
        <CreateQuizModal 
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchQuizzes();
          }}
        />
      )}
    </div>
  );
};

// Simple Create Quiz Modal Component
const CreateQuizModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classAssigned: '',
    subject: '',
    duration: 30,
    startTime: '',
    endTime: '',
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0, marks: 1 }]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await teacherAPI.createQuiz(formData);
      toast.success('Quiz created successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to create quiz');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create New Quiz</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Quiz Title</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="form-label">Class</label>
              <input
                type="text"
                className="form-input"
                value={formData.classAssigned}
                onChange={(e) => setFormData({...formData, classAssigned: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizManagement;