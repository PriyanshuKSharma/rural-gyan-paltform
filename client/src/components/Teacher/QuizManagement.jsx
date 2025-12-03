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
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

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

  const handleViewResults = (quiz) => {
    setSelectedQuiz(quiz);
    setShowResultsModal(true);
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

  const handleToggleStatus = async (quiz) => {
    try {
      const updatedQuiz = { ...quiz, isActive: !quiz.isActive };
      await teacherAPI.updateQuiz(quiz._id, { isActive: updatedQuiz.isActive });
      
      setQuizzes(quizzes.map(q => 
        q._id === quiz._id ? { ...q, isActive: updatedQuiz.isActive } : q
      ));
      
      toast.success(`Quiz ${updatedQuiz.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update quiz status');
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
                  onClick={() => {
                    setEditingQuiz(quiz);
                    setShowCreateModal(true);
                  }}
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
                <span className="font-medium text-gray-900 dark:text-white">
                  {quiz.questions ? quiz.questions.length : (quiz.sections?.reduce((acc, sec) => acc + sec.questions.length, 0) || 0)}
                </span>
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
                <button 
                  onClick={() => handleViewResults(quiz)}
                  className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <Eye size={14} className="inline mr-1" />
                  View Results
                </button>
                <button 
                  onClick={() => handleToggleStatus(quiz)}
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

      {/* Create/Edit Quiz Modal */}
      {showCreateModal && (
        <CreateQuizModal 
          quizToEdit={editingQuiz}
          onClose={() => {
            setShowCreateModal(false);
            setEditingQuiz(null);
          }}
          onSuccess={() => {
            setShowCreateModal(false);
            setEditingQuiz(null);
            fetchQuizzes();
          }}
        />
      )}

      {/* Quiz Results Modal */}
      {showResultsModal && selectedQuiz && (
        <QuizResultsModal
          quiz={selectedQuiz}
          onClose={() => {
            setShowResultsModal(false);
            setSelectedQuiz(null);
          }}
        />
      )}
    </div>
  );
};

// Quiz Results Modal Component
const QuizResultsModal = ({ quiz, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Results</h2>
            <p className="text-gray-600 dark:text-gray-400">{quiz.title} - {quiz.classAssigned}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Submissions</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{quiz.submissions?.length || 0}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
            <div className="text-sm text-gray-500 dark:text-gray-400">Average Score</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {quiz.submissions?.length > 0 
                ? (quiz.submissions.reduce((acc, sub) => acc + sub.score, 0) / quiz.submissions.length).toFixed(1)
                : 0} / {quiz.totalMarks}
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
            <div className="text-sm text-gray-500 dark:text-gray-400">Pass Rate</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {quiz.submissions?.length > 0
                ? ((quiz.submissions.filter(sub => sub.percentage >= 40).length / quiz.submissions.length) * 100).toFixed(1)
                : 0}%
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Student</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Submitted At</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Score</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Percentage</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {quiz.submissions?.map((submission, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3 text-sm font-bold text-gray-600 dark:text-gray-300">
                        {submission.studentId?.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{submission.studentId?.fullName || 'Unknown'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{submission.studentId?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {submission.score} / {quiz.totalMarks}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                    {submission.percentage.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      submission.percentage >= 40 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {submission.percentage >= 40 ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                </tr>
              ))}
              {(!quiz.submissions || quiz.submissions.length === 0) && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No submissions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Enhanced Create Quiz Modal Component
const CreateQuizModal = ({ onClose, onSuccess, quizToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classAssigned: '',
    subject: '',
    duration: 30,
    startTime: '',
    endTime: '',
    sections: [{ title: 'General', description: '', questions: [] }]
  });
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (quizToEdit) {
      // Format dates for datetime-local input
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
          .toISOString()
          .slice(0, 16);
      };

      let sections = quizToEdit.sections || [];
      // Backward compatibility: if no sections, wrap questions in a default section
      if (sections.length === 0 && quizToEdit.questions && quizToEdit.questions.length > 0) {
        sections = [{
          title: 'General',
          description: '',
          questions: quizToEdit.questions.map(q => ({
            ...q,
            options: q.options || ['', '', '', ''],
            type: q.type || 'mcq'
          }))
        }];
      } else if (sections.length === 0) {
         sections = [{ title: 'General', description: '', questions: [] }];
      }

      setFormData({
        title: quizToEdit.title,
        description: quizToEdit.description || '',
        classAssigned: quizToEdit.classAssigned,
        subject: quizToEdit.subject,
        duration: quizToEdit.duration,
        startTime: formatDate(quizToEdit.startTime),
        endTime: formatDate(quizToEdit.endTime),
        sections: sections
      });
    }
  }, [quizToEdit]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await teacherAPI.getClasses();
        const classList = response.data.data.assignedClasses || [];
        const classObjects = classList.map((className, index) => ({
          _id: index,
          name: className
        }));
        setClasses(classObjects); 
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast.error('Failed to load classes');
      }
    };
    fetchClasses();
  }, []);

  const handleSectionChange = (index, field, value) => {
    const newSections = [...formData.sections];
    newSections[index][field] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { title: 'New Section', description: '', questions: [] }]
    });
  };

  const removeSection = (index) => {
    if (formData.sections.length === 1) {
      toast.error('At least one section is required');
      return;
    }
    const newSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: newSections });
  };

  const handleQuestionChange = (sectionIndex, qIndex, field, value) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].questions[qIndex][field] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const handleOptionChange = (sectionIndex, qIndex, oIndex, value) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].questions[qIndex].options[oIndex] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const addQuestion = (sectionIndex) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].questions.push({ 
      question: '', 
      options: ['', '', '', ''], 
      correctAnswer: 0, 
      marks: 1, 
      type: 'mcq' 
    });
    setFormData({ ...formData, sections: newSections });
  };

  const removeQuestion = (sectionIndex, qIndex) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].questions = newSections[sectionIndex].questions.filter((_, i) => i !== qIndex);
    setFormData({ ...formData, sections: newSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calculate total marks based on all questions in all sections
      const totalMarks = formData.sections.reduce((acc, section) => {
        return acc + section.questions.reduce((qAcc, q) => qAcc + (parseInt(q.marks) || 0), 0);
      }, 0);

      const payload = { ...formData, totalMarks };

      if (quizToEdit) {
        await teacherAPI.updateQuiz(quizToEdit._id, payload);
        toast.success('Quiz updated successfully');
      } else {
        await teacherAPI.createQuiz(payload);
        toast.success('Quiz created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(quizToEdit ? 'Failed to update quiz' : 'Failed to create quiz');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {quizToEdit ? 'Edit Quiz' : 'Create New Quiz'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Section */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quiz Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="e.g., Mathematics Final Exam"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.classAssigned}
                  onChange={(e) => setFormData({...formData, classAssigned: e.target.value})}
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls.name}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the quiz..."
              />
            </div>
          </div>

          {/* Sections Management */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quiz Sections</h3>
              <button
                type="button"
                onClick={addSection}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus size={18} />
                <span>Add Section</span>
              </button>
            </div>

            {formData.sections.map((section, sIndex) => (
              <div key={sIndex} className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 relative">
                 <button
                  type="button"
                  onClick={() => removeSection(sIndex)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove Section"
                >
                  <Trash2 size={20} />
                </button>

                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section Title</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      value={section.title}
                      onChange={(e) => handleSectionChange(sIndex, 'title', e.target.value)}
                      placeholder="e.g., Aptitude, Coding Challenge"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section Description</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      value={section.description}
                      onChange={(e) => handleSectionChange(sIndex, 'description', e.target.value)}
                      placeholder="Optional description"
                    />
                  </div>
                </div>

                {/* Questions in Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">Questions ({section.questions.length})</h4>
                    <button
                      type="button"
                      onClick={() => addQuestion(sIndex)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                    >
                      <Plus size={16} />
                      <span>Add Question</span>
                    </button>
                  </div>

                  {section.questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-200 dark:border-gray-700 relative group">
                      <button
                        type="button"
                        onClick={() => removeQuestion(sIndex, qIndex)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Question"
                      >
                        <Trash2 size={18} />
                      </button>

                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="w-32">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Type</label>
                            <select
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                              value={q.type || 'mcq'}
                              onChange={(e) => handleQuestionChange(sIndex, qIndex, 'type', e.target.value)}
                            >
                              <option value="mcq">MCQ</option>
                              <option value="code">Code</option>
                            </select>
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Question {qIndex + 1}</label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                              value={q.question}
                              onChange={(e) => handleQuestionChange(sIndex, qIndex, 'question', e.target.value)}
                              required
                              placeholder="Enter your question here"
                            />
                          </div>
                          <div className="w-24">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Marks</label>
                            <input
                              type="number"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                              value={q.marks}
                              onChange={(e) => handleQuestionChange(sIndex, qIndex, 'marks', parseInt(e.target.value))}
                              min="1"
                              required
                            />
                          </div>
                        </div>

                        {/* MCQ Options */}
                        {(!q.type || q.type === 'mcq') && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {q.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name={`correct-${sIndex}-${qIndex}`}
                                  checked={q.correctAnswer === oIndex}
                                  onChange={() => handleQuestionChange(sIndex, qIndex, 'correctAnswer', oIndex)}
                                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                  value={option}
                                  onChange={(e) => handleOptionChange(sIndex, qIndex, oIndex, e.target.value)}
                                  required
                                  placeholder={`Option ${oIndex + 1}`}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Code Configuration */}
                        {q.type === 'code' && (
                          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Language</label>
                              <select
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                value={q.codeConfig?.language || 'javascript'}
                                onChange={(e) => {
                                  const newSections = [...formData.sections];
                                  if (!newSections[sIndex].questions[qIndex].codeConfig) {
                                    newSections[sIndex].questions[qIndex].codeConfig = {};
                                  }
                                  newSections[sIndex].questions[qIndex].codeConfig.language = e.target.value;
                                  setFormData({ ...formData, sections: newSections });
                                }}
                              >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                                <option value="sql">SQL</option>
                              </select>
                            </div>
                            {/* Test Cases UI could be added here */}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-500/30"
            >
              {quizToEdit ? 'Update Quiz' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizManagement;