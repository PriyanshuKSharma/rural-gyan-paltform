import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Award, Target } from 'lucide-react';

const PerformanceAnalysis = () => {
  const performanceData = [
    { subject: 'Math', average: 85, highest: 98, lowest: 72 },
    { subject: 'Physics', average: 78, highest: 95, lowest: 65 },
    { subject: 'Chemistry', average: 82, highest: 94, lowest: 70 },
    { subject: 'Biology', average: 88, highest: 96, lowest: 75 }
  ];

  const trendData = [
    { month: 'Jan', performance: 75 },
    { month: 'Feb', performance: 78 },
    { month: 'Mar', performance: 82 },
    { month: 'Apr', performance: 85 },
    { month: 'May', performance: 88 },
    { month: 'Jun', performance: 90 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Performance Analysis</h1>
        <p className="text-gray-600 dark:text-gray-400">AI-driven insights into student performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Class Average</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">83.5%</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl">
              <TrendingUp className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Top Performer</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">98%</p>
            </div>
            <div className="bg-green-500 p-3 rounded-xl">
              <Award className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">45</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-xl">
              <Users className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Improvement</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">+12%</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-xl">
              <Target className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="average" fill="#3B82F6" name="Average" />
              <Bar dataKey="highest" fill="#10B981" name="Highest" />
              <Bar dataKey="lowest" fill="#EF4444" name="Lowest" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="performance" stroke="#8B5CF6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Insights</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">📈 Positive Trend</h4>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Overall class performance has improved by 12% over the last 6 months. Mathematics shows the strongest improvement.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-300 mb-2">⚠️ Areas for Attention</h4>
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              5 students are performing below average in Physics. Consider additional support or tutoring sessions.
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">🎯 Recommendations</h4>
            <p className="text-sm text-green-800 dark:text-green-400">
              Implement peer learning groups for Chemistry. Top performers can mentor struggling students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalysis;