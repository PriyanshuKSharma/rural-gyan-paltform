import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Award, Target, Loader2, AlertCircle } from 'lucide-react';
import { teacherAPI } from '../../services/api';

const PerformanceAnalysis = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teacherAPI.getPerformanceAnalytics();
      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching performance analytics:', err);
      setError('Failed to load performance data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-cyan-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="text-red-500" size={48} />
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={fetchPerformanceData}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, performanceData, trendData, insights } = analytics || {};
  const defaultStats = { classAverage: 0, topPerformer: 0, totalStudents: 0, improvement: 0 };
  const currentStats = stats || defaultStats;

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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentStats.classAverage}%</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentStats.topPerformer}%</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentStats.totalStudents}</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentStats.improvement > 0 ? '+' : ''}{currentStats.improvement}%</p>
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
          {performanceData && performanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="average" fill="#3B82F6" name="Average" />
                <Bar dataKey="highest" fill="#10B981" name="Highest" />
                <Bar dataKey="lowest" fill="#EF4444" name="Lowest" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No performance data available yet
            </div>
          )}
        </div>

        {/* Performance Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Trend</h3>
          {trendData && trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="performance" stroke="#8B5CF6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No trend data available yet
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Insights</h3>
        {insights && insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  insight.type === 'positive'
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : insight.type === 'warning'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20'
                    : 'bg-green-50 dark:bg-green-900/20'
                }`}
              >
                <h4
                  className={`font-medium mb-2 ${
                    insight.type === 'positive'
                      ? 'text-blue-900 dark:text-blue-300'
                      : insight.type === 'warning'
                      ? 'text-yellow-900 dark:text-yellow-300'
                      : 'text-green-900 dark:text-green-300'
                  }`}
                >
                  {insight.title}
                </h4>
                <p
                  className={`text-sm ${
                    insight.type === 'positive'
                      ? 'text-blue-800 dark:text-blue-400'
                      : insight.type === 'warning'
                      ? 'text-yellow-800 dark:text-yellow-400'
                      : 'text-green-800 dark:text-green-400'
                  }`}
                >
                  {insight.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            No insights available yet. Add student performance data to see AI-powered insights.
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceAnalysis;
