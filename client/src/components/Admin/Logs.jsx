import React, { useState } from 'react';
import { Calendar, Filter, Download, Search, Activity } from 'lucide-react';

const Logs = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  const logs = [
    {
      id: 1,
      type: 'user',
      action: 'User Login',
      user: 'John Doe (Student)',
      timestamp: '2024-01-15 09:30:45',
      details: 'Successful login from IP: 192.168.1.100',
      status: 'success'
    },
    {
      id: 2,
      type: 'quiz',
      action: 'Quiz Submitted',
      user: 'Jane Smith (Student)',
      timestamp: '2024-01-15 09:25:12',
      details: 'Mathematics Quiz - Score: 85/100',
      status: 'success'
    },
    {
      id: 3,
      type: 'class',
      action: 'Virtual Class Started',
      user: 'Dr. Wilson (Teacher)',
      timestamp: '2024-01-15 09:00:00',
      details: 'Physics Class - Grade 11A',
      status: 'success'
    },
    {
      id: 4,
      type: 'system',
      action: 'Failed Login Attempt',
      user: 'Unknown User',
      timestamp: '2024-01-15 08:45:23',
      details: 'Invalid credentials from IP: 192.168.1.150',
      status: 'error'
    },
    {
      id: 5,
      type: 'admin',
      action: 'Teacher Added',
      user: 'Admin User',
      timestamp: '2024-01-15 08:30:15',
      details: 'New teacher: Sarah Johnson - Mathematics',
      status: 'success'
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Logs', count: logs.length },
    { id: 'user', label: 'User Activity', count: logs.filter(l => l.type === 'user').length },
    { id: 'quiz', label: 'Quiz Activity', count: logs.filter(l => l.type === 'quiz').length },
    { id: 'class', label: 'Class Activity', count: logs.filter(l => l.type === 'class').length },
    { id: 'system', label: 'System Events', count: logs.filter(l => l.type === 'system').length }
  ];

  const getLogIcon = (type) => {
    const icons = {
      user: '👤',
      quiz: '📝',
      class: '🎓',
      system: '⚙️',
      admin: '👑'
    };
    return icons[type] || '📋';
  };

  const getStatusColor = (status) => {
    return status === 'success' 
      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
      : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
  };

  const filteredLogs = activeTab === 'all' 
    ? logs 
    : logs.filter(log => log.type === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Logs & Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor system activity and user actions</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search logs..."
                className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar size={16} />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="table-header">Type</th>
                <th className="table-header">Action</th>
                <th className="table-header">User</th>
                <th className="table-header">Timestamp</th>
                <th className="table-header">Details</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getLogIcon(log.type)}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {log.type}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {log.action}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {log.user}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {log.details}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{logs.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl">
              <Activity className="text-white" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((logs.filter(l => l.status === 'success').length / logs.length) * 100)}%
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-xl">
              <span className="text-white text-lg">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Errors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {logs.filter(l => l.status === 'error').length}
              </p>
            </div>
            <div className="bg-red-500 p-3 rounded-xl">
              <span className="text-white text-lg">⚠</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-xl">
              <span className="text-white text-lg">👥</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs;