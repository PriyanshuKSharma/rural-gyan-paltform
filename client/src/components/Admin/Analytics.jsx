import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react';

const Analytics = () => {
  const monthlyData = [
    { month: 'Jan', teachers: 45, students: 320, classes: 28 },
    { month: 'Feb', teachers: 52, students: 380, classes: 32 },
    { month: 'Mar', teachers: 48, students: 420, classes: 35 },
    { month: 'Apr', teachers: 61, students: 450, classes: 38 },
    { month: 'May', teachers: 55, students: 480, classes: 40 },
    { month: 'Jun', teachers: 67, students: 520, classes: 42 }
  ];

  const performanceData = [
    { grade: 'Grade 6', average: 78 },
    { grade: 'Grade 7', average: 82 },
    { grade: 'Grade 8', average: 85 },
    { grade: 'Grade 9', average: 80 },
    { grade: 'Grade 10', average: 88 },
    { grade: 'Grade 11', average: 86 },
    { grade: 'Grade 12', average: 90 }
  ];

  const subjectData = [
    { name: 'Mathematics', value: 25, color: '#3B82F6' },
    { name: 'Science', value: 20, color: '#10B981' },
    { name: 'English', value: 18, color: '#F59E0B' },
    { name: 'History', value: 15, color: '#EF4444' },
    { name: 'Others', value: 22, color: '#8B5CF6' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Comprehensive insights into your educational institution</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,245</p>
              <p className="text-xs text-green-600 dark:text-green-400">+12% from last month</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl">
              <Users className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">67</p>
              <p className="text-xs text-green-600 dark:text-green-400">+8% from last month</p>
            </div>
            <div className="bg-green-500 p-3 rounded-xl">
              <Award className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Active Classes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">42</p>
              <p className="text-xs text-green-600 dark:text-green-400">+5% from last month</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-xl">
              <BookOpen className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Avg Performance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">84.5%</p>
              <p className="text-xs text-green-600 dark:text-green-400">+3% from last month</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-xl">
              <TrendingUp className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Growth */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#3B82F6" name="Students" />
              <Bar dataKey="teachers" fill="#10B981" name="Teachers" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance by Grade */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance by Grade</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="average" stroke="#8B5CF6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Distribution and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {subjectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {subjectData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {entry.name}: {entry.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Users size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  5 new students enrolled
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Award size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  New teacher added to Mathematics
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <BookOpen size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Quiz completed by Grade 10A
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <TrendingUp size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Performance improved by 15%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;