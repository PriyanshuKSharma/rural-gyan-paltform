import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, BookOpen, Video, BarChart3, Calendar, Clock } from 'lucide-react';
import { teacherAPI, authAPI } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';

const TeacherHome = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState('');

  useEffect(() => {
    fetchDashboardData();
    fetchTeacherProfile();
  }, []);

  const fetchTeacherProfile = async () => {
    try {
      const response = await authAPI.profile();
      if (response.data.success) {
        setTeacherName(response.data.user.fullName || 'Teacher');
      }
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      setTeacherName('Teacher');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [classesRes, quizzesRes] = await Promise.all([
        teacherAPI.getClasses(),
        teacherAPI.getQuizzes()
      ]);
      
      setData({
        classes: classesRes.data.data,
        quizzes: quizzesRes.data.data
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const stats = [
    {
      title: 'Total Classes',
      value: data?.classes?.assignedClasses?.length || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Active Quizzes',
      value: data?.quizzes?.filter(q => q.isActive)?.length || 0,
      icon: BookOpen,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Live Sessions',
      value: data?.classes?.classrooms?.filter(c => c.isLive)?.length || 0,
      icon: Video,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Total Students',
      value: data?.classes?.classrooms?.reduce((acc, c) => acc + c.students.length, 0) || 0,
      icon: BarChart3,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome Back, {teacherName}!</h1>
        <p className="text-blue-100">Ready to inspire and educate your students today?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-2xl p-6 border border-gray-100 dark:border-gray-700`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Classes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Assigned Classes
          </h3>
          <div className="space-y-3">
            {data?.classes?.assignedClasses?.length > 0 ? (
              data.classes.assignedClasses.map((className, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Users size={16} className="text-white" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {className}
                    </span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No classes assigned</p>
            )}
          </div>
        </div>

        {/* Recent Quizzes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Quizzes
          </h3>
          <div className="space-y-3">
            {data?.quizzes?.length > 0 ? (
              data.quizzes.slice(0, 5).map((quiz, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <BookOpen size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {quiz.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {quiz.classAssigned} • {quiz.subject}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {quiz.submissions?.length || 0} submissions
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No quizzes created yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Today's Schedule
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Calendar size={48} className="mx-auto mb-4 opacity-50" />
          <p>No scheduled classes for today</p>
          <p className="text-sm mt-2">Schedule information will appear here when available</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;
