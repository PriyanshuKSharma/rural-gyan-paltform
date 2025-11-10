import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Brain, Code, Video, Calendar, TrendingUp, Clock, Award } from 'lucide-react';
import { studentAPI } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';

const StudentHome = () => {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await studentAPI.getDashboard();
      setDashboardData(response.data.data);
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
      title: 'Attendance',
      value: `${dashboardData?.stats?.attendancePercentage || 0}%`,
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Average Marks',
      value: `${dashboardData?.stats?.averageMarks || 0}%`,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Quizzes Taken',
      value: dashboardData?.stats?.totalQuizzes || 0,
      icon: BookOpen,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Rank',
      value: '#12',
      icon: Award,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {dashboardData?.student?.userId?.fullName}!
        </h1>
        <p className="text-blue-100">Ready to continue your learning journey?</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickActionCard
          title="Join Virtual Class"
          description="Join live sessions with your teachers"
          icon={Video}
          color="bg-blue-500"
          bgColor="bg-blue-50 dark:bg-blue-900/20"
          href="/student/class"
        />
        <QuickActionCard
          title="AI Tutor"
          description="Get help from your AI assistant"
          icon={Brain}
          color="bg-purple-500"
          bgColor="bg-purple-50 dark:bg-purple-900/20"
          href="/student/ai-tutor"
        />
        <QuickActionCard
          title="Code Editor"
          description="Practice coding in our online editor"
          icon={Code}
          color="bg-green-500"
          bgColor="bg-green-50 dark:bg-green-900/20"
          href="/student/code-editor"
        />
        <QuickActionCard
          title="Study Materials"
          description="Access notes, quizzes, and exams"
          icon={BookOpen}
          color="bg-orange-500"
          bgColor="bg-orange-50 dark:bg-orange-900/20"
          href="/student/materials"
        />
      </div>

      {/* Upcoming Quizzes */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Upcoming Quizzes
        </h3>
        <div className="space-y-4">
          {dashboardData?.upcomingQuizzes?.length > 0 ? (
            dashboardData.upcomingQuizzes.map((quiz, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{quiz.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {quiz.subject} • Due: {new Date(quiz.endTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {quiz.questions.length} Questions
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {quiz.duration} min
                    </p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Take Quiz
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No upcoming quizzes</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Performance
        </h3>
        <div className="space-y-3">
          {dashboardData?.student?.performance?.slice(-5).map((perf, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Award size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{perf.subject}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{perf.examType}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  {perf.marks}/{perf.totalMarks}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {((perf.marks / perf.totalMarks) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({ title, description, icon: Icon, color, bgColor, href }) => {
  return (
    <div className={`${bgColor} rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer`}>
      <div className={`${color} p-3 rounded-xl w-fit mb-4`}>
        <Icon className="text-white" size={24} />
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
        Get Started →
      </button>
    </div>
  );
};

export default StudentHome;