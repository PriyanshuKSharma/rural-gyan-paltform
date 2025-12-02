import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Eye, BookOpen, Video, Image } from 'lucide-react';
import { studentAPI } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';

const Materials = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await studentAPI.getMaterials();
      setMaterials(response.data.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="text-red-500" size={24} />;
      case 'video':
        return <Video className="text-blue-500" size={24} />;
      case 'image':
        return <Image className="text-green-500" size={24} />;
      default:
        return <BookOpen className="text-gray-500" size={24} />;
    }
  };

  const tabs = [
    { id: 'all', label: 'All Materials' },
    { id: 'notes', label: 'Notes' },
    { id: 'videos', label: 'Videos' },
    { id: 'assignments', label: 'Assignments' }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Study Materials</h1>
        <p className="text-gray-600 dark:text-gray-400">Access your course materials, notes, and resources</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials
          .filter(material => activeTab === 'all' || 
            (activeTab === 'assignments' && material.type === 'assignment') ||
            (activeTab === 'notes' && material.type === 'pdf') ||
            (activeTab === 'videos' && material.type === 'video')
          )
          .map((material, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getFileIcon(material.type === 'assignment' ? 'document' : material.type)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{material.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {material.subject || material.type}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {material.type === 'assignment' ? (
                  <span className="text-red-500">Due: {new Date(material.dueDate).toLocaleDateString()}</span>
                ) : (
                  <span>Uploaded on {new Date(material.uploadedAt).toLocaleDateString()}</span>
                )}
              </p>

              <div className="flex space-x-2">
                <button 
                  onClick={() => material.isQuiz ? navigate(`/student/quiz/${material._id}`) : null}
                  className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <Eye size={14} className="inline mr-1" />
                  {material.isQuiz ? 'Start Quiz' : 'View'}
                </button>
                {!material.isQuiz && (
                  <button className="flex-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                    <Download size={14} className="inline mr-1" />
                    Download
                  </button>
                )}
              </div>
            </div>
          ))}
          
        {materials.length === 0 && (
          <div className="col-span-full text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No materials available</h3>
            <p className="text-gray-600 dark:text-gray-400">Check back later for new study materials</p>
          </div>
        )}
      </div>


    </div>
  );
};

export default Materials;